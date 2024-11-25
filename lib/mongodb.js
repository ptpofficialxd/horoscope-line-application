import { MongoClient } from "mongodb";

let client;
let db;

export const connectToDatabase = async () => {
  if (client && db) {
    return db;
  }

  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db();
  return db;
};
