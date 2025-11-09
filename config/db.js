// config/db.js
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    console.log('MongoDB connected');
    return client.db(process.env.DB_NAME || 'communityDB');
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }
}

module.exports = connectDB;
