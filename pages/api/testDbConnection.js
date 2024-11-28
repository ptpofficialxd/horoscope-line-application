// pages/api/testDbconnection.js
import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    // เชื่อมต่อกับฐานข้อมูล MongoDB
    const { db } = await connectToDatabase();

    // ดึงข้อมูลจาก collection "users"
    const users = await db.collection('users').find({}).toArray(); // ดึงข้อมูลในรูปแบบ array

    res.status(200).json({ users }); // ส่งผลลัพธ์กลับไปในรูปแบบ JSON
  } catch (error) {
    res.status(500).json({ message: "มีข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล", error });
  }
}
