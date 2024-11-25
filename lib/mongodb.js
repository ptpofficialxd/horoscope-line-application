import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export const connectToDatabase = async () => {
  // เชื่อมต่อ MongoDB (ไม่ต้องเช็ค isConnected)
  await client.connect();
  const db = client.db();
  return db;
};
