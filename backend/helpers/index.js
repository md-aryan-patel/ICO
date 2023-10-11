require("dotenv").config();
const erc20Abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];

const Networks = [process.env.sepolia_network, process.env.bsc_network];

const CompareTwoString = (s1, s2) => {
  if (s1.toString().toUpperCase() === s2.toString().toUpperCase()) return true;
  return false;
};

const ToUpperString = (s) => {
  return s.toString().toUpperCase();
};

// const testTransaction = [
//   {
//     "provider": JsonRpcProvider {},
//     blockNumber: 4435848,
//     blockHash: '0x9919eed11c4c7655d4ce297dc22c1fc5e85965f5d417901639c96c61ba714668',
//     index: undefined,
//     hash: '0x2e153a41d0a7a1c9b96800d98a50fc5368c2593e487e9de1bfb8eecb73c5c9c8',
//     type: 2,
//     to: '0x24d15b56badfe7266E6cA4A74aDA2218639010ef',
//     from: '0x80A344d8095d099bb72e6298aA8bA2C9E82A4Cbe',
//     nonce: 894,
//     gasLimit: 52615n,
//     gasPrice: 1500000061n,
//     maxPriorityFeePerGas: 1500000000n,
//     maxFeePerGas: 1500000096n,
//     data: '0xa9059cbb00000000000000000000000056050f19bcbd8ac5e7462ca198e57d0a8867352b0000000000000000000000000000000000000000000000000de0b6b3a7640000',
//     value: 0n,
//     chainId: 11155111n,
//     signature: Signature { r: "0x4c12a15fc1c3b3d481271088f72fb72f8d0f613b3c36da3d0146770029647923", s: "0x234f6faead31921e21ef335e3a8a588cb63f82f47b65838aed32f78fe21af6ab", yParity: 0, networkV: null },
//     accessList: [],
//     tokenName: 'creak',
//     tokenSymbol: 'CCK',
//     tokenDecimal: 18n,
//     tokenAmount: 1000000000000000000,
//     toAddress: '0x56050f19bcbd8ac5e7462ca198e57d0a8867352b'
//   }
// ]

module.exports = { erc20Abi, Networks, CompareTwoString };
