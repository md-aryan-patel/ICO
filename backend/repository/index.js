const ethers = require("ethers");
const { erc20Abi, Networks } = require("../helpers");
require("dotenv").config();
const transferSelector = "0xa9059cbb";

const icoAbi = require("../../artifacts/contracts/ICO.sol/ico.json");
const tokenAbi = require("../../artifacts/contracts/Token.sol/CFNC.json");
const {
  cacheContractData,
  getContractCacheData,
  inserUserTransaction,
} = require("../database");

const provider = new ethers.JsonRpcProvider(process.env.sepolia_network);
const adminWallet = new ethers.Wallet(process.env.admin_private_key, provider);

const ico = new ethers.Contract(process.env.ICO, icoAbi.abi, provider);
const icoContract = ico.connect(adminWallet);

const token = new ethers.Contract(process.env.Token, tokenAbi.abi, provider);
const tokenContract = ico.connect(adminWallet);

const providers = [];
let filters = [];

Networks.map(async (val, index) => {
  providers[index] = new ethers.JsonRpcProvider(val);
});

const _fetchTransactionDetail = async (
  recipientAddress,
  blockNumber,
  provider
) => {
  const erc20Transfers = [];
  try {
    const block = await provider.getBlock(blockNumber, true);
    if (block && block.prefetchedTransactions) {
      for (const tx of block.prefetchedTransactions) {
        const toAddress = "0x" + tx.data.slice(34, 74);
        const tokenAmountHex = "0x" + tx.data.slice(74);
        const tokenAmount = parseInt(tokenAmountHex, 16);
        const tokenAddress = tx.to !== null ? tx.to : "";
        if (
          toAddress.toLowerCase() === recipientAddress.toLowerCase() &&
          tx.data.startsWith(transferSelector)
        ) {
          const contract = new ethers.Contract(
            tokenAddress,
            erc20Abi,
            provider
          );
          const tokenName = await contract.name();
          const tokenSymbol = await contract.symbol();
          const tokenDecimal = await contract.decimals();

          erc20Transfers.push({
            ...tx,
            tokenName,
            tokenSymbol,
            tokenDecimal,
            tokenAmount,
            toAddress,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching ERC-20 transfers:", error);
  }
  return erc20Transfers;
};

const FetchTransactionDetail = async (recipientAddress) => {
  providers.forEach((provider, index) => {
    filters[index] = provider.on("block", async (blockNumber) => {
      const result = await _fetchTransactionDetail(
        recipientAddress,
        blockNumber,
        provider
      );
      if (result.length > 0) {
        result.forEach((tx, _) => {
          addTransactionInDatabase(tx);
        });
        // sendEmails(`The Latest Transaction to Your wallet:
        // Token name: ${result[0].tokenName},Token Received: ${result[0].tokenAmount}`);
      } else {
        return;
      }
    });
  });
};

const addTransactionInDatabase = async (transaction) => {
  if (transaction.to.toString() !== process.env.usdt_address) {
    return;
  }
  const currentDate = new Date();
  const cacheData = await getContractCacheData();
  const icoStartTime = new Date(cacheData.startTime * 1000);
  if (icoStartTime.getTime() > currentDate.getTime()) {
    // addTransaction in pending database
  }
  const fromAddress = transaction.from;
  const usdtAmount = transaction.tokenAmount;
  const res = await inserUserTransaction(
    fromAddress,
    usdtAmount,
    currentDate.getTime()
  );
  console.log(res);
};

const cacheData = async () => {
  const tokenName = "CFNC";
  const maxToken = await icoContract.maxToken();
  const pricePerToken = await icoContract.pricePerToken();
  const startTime = await icoContract.startTime();
  const endTime = await icoContract.endTime();
  const Owner = await icoContract.Owner();

  const res = await cacheContractData(
    tokenName,
    maxToken,
    pricePerToken,
    startTime,
    endTime,
    Owner
  );
  console.log(res);
};

const stopListening = async (_chainId) => {
  providers.forEach(async (provider, index) => {
    const { chainId } = await provider.getNetwork();
    if (_chainId === chainId.toString()) {
      filters[index].removeListener();
    }
  });
};

module.exports = { FetchTransactionDetail, stopListening, cacheData };
