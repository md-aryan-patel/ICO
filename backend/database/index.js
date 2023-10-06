const { MongoClient } = require("mongodb");
require("dotenv").config();

// Connection URL
const uri = "mongodb://0.0.0.0:27017/";
const client = new MongoClient(uri);

const userDatabase = "icoInvestors";
const cacheDatabase = "cache-database";

const inserUserTransaction = async (userAddress, usdt, transactionTime) => {
  client.connect();
  const db = client.db(userDatabase);
  const collection = db.collection("ico-user");
  try {
    const result = await collection.insertOne({
      userAddress,
      usdt,
      isClaimed: false,
      transactionTime,
    });
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
};

const cacheContractData = async (
  tokenName,
  maxToken,
  pricePerToken,
  startTime,
  endTime,
  owner
) => {
  client.connect();
  const replace = { tokenName: "CFNC" };
  const replacement = {
    tokenName,
    maxToken,
    pricePerToken,
    startTime,
    endTime,
    owner,
  };
  const db = client.db(cacheDatabase);
  const collection = db.collection("cache-data");
  let result;
  try {
    result = await collection.replaceOne(replace, replacement);
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
  return result;
};

const getContractCacheData = async () => {
  client.connect();
  const query = { tokenName: "CFNC" };
  const db = client.db(cacheDatabase);
  const collection = db.collection("cache-data");
  let res;
  try {
    res = await collection.findOne(query);
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
  return res;
};

const main = async () => {
  const res = await cacheContractData(100, 10, 16277777, 16626666, "Aryan");
  console.log(res);
};

// main();

module.exports = {
  cacheContractData,
  getContractCacheData,
  inserUserTransaction,
};
