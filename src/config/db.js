const { MongoClient } = require("mongodb");
const env = require("./env");

let client;
let db;

async function connectDB() {
  if (db) {
    return db;
  }

  client = new MongoClient(env.mongoUri);
  await client.connect();
  db = client.db(env.dbName);
  return db;
}

function getDB() {
  if (!db) {
    throw new Error("Database connection has not been established yet.");
  }

  return db;
}

async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

module.exports = { connectDB, getDB, closeDB };
