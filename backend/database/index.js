const { MongoClient } = require("mongodb");
require("dotenv").config();

// Connection URL
const uri = "mongodb://0.0.0.0:27017/";
const client = new MongoClient(uri);

const userDatabase = "icoInvestors";
const cacheDatabase = "cache-database";
const pendingTransactionDb = "pending-transaction";

const inserUserTransaction = async (
  userAddress,
  usdt,
  transactionTime,
  isPending
) => {
  await client.connect();
  let db, collection;

  if (isPending) {
    db = client.db(pendingTransactionDb);
    collection = db.collection("pending-tx");
  } else {
    db = client.db(userDatabase);
    collection = db.collection("ico-user");
  }

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
  await client.connect();
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
  await client.connect();
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

const getAllPendingTransaction = async () => {
  let allTx;
  try {
    await client.connect();
    const db = client.db(pendingTransactionDb);
    const collection = db.collection("pending-tx");
    allTx = await collection.find({}).toArray();
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
  return allTx;
};

const removeFromPending = async (_id) => {
  try {
    await client.connect();
    const db = client.db(pendingTransactionDb);
    const query = { _id: _id };
    const collection = db.collection("pending-tx");
    const res = await collection.deleteOne(query);
    return res;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
};

// main();

module.exports = {
  cacheContractData,
  getContractCacheData,
  inserUserTransaction,
  getAllPendingTransaction,
  removeFromPending,
};
