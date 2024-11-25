// pages/api/test.js
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('bookings');
    const bookings = await collection.find({}).toArray();
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to the database', error });
  }
}