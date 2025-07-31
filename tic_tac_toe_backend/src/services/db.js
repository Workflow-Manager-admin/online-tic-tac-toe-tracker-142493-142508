require('dotenv').config();
const { MongoClient } = require('mongodb');

/**
 * Central MongoDB connection utility.
 * Reads configuration from environment variables.
 * Exports helper to get (or create) MongoDB collections.
 */
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME || 'tic_tac_toe'; // fallback to sensible default

if (!uri) {
  throw new Error('Missing MONGODB_URI in environment variables');
}

let client;
let db;

/**
 * PUBLIC_INTERFACE
 * Connect to MongoDB, returns (singleton) DB object.
 */
async function connectDB() {
  if (db) return db;
  client = new MongoClient(uri, { useUnifiedTopology: true });
  await client.connect();
  db = client.db(dbName);
  return db;
}

/**
 * PUBLIC_INTERFACE
 * Retrieve a specific collection from the connected db.
 * Will call connectDB() if not yet connected.
 */
async function getCollection(collectionName) {
  const database = await connectDB();
  return database.collection(collectionName);
}

module.exports = {
  connectDB,
  getCollection,
};
