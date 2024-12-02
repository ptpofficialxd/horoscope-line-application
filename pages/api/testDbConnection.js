import { connectToDatabase } from "../../lib/mongodb";
import User from '../../models/user';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    const users = await User.find({}).lean(); // Use lean() for better performance if you don't need Mongoose documents

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "มีข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล", error });
  }
}