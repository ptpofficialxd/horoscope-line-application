/* pages/api/registerCustomerAPI.js */

import { connectToDatabase } from '../../lib/mongodb';
import { setCookie } from 'cookies-next';  // ใช้ฟังก์ชัน setCookie จาก cookies-next

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { lineId, 
      firstName, 
      lastName, 
      phone, 
      birthdate, 
      age, 
      gender 
    } = req.body;

    try {
      const { db } = await connectToDatabase();

      // ตรวจสอบว่ามี Line ID อยู่แล้วหรือไม่
      const existingUser = await db.collection("users").findOne({ lineId });
      if (existingUser) {
        return res.status(400).json({ message: "LineID นี้ทำการสมัครสมาชิกไว้อยู่แล้ว!" });
      }

      // กำหนดฟังก์ชันเพื่อแปลงวันที่
      const formatDateTime = (date) => {
        return date.toLocaleString("th-TH", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,  // ใช้เวลาแบบ 24 ชั่วโมง
          timeZone: "Asia/Bangkok",
        });
      };

      // เพิ่มข้อมูลลงฐานข้อมูล
      await db.collection("users").insertOne({
        lineId,
        firstName,
        lastName,
        phone,
        birthdate,
        age,
        gender,
        userType: "customer",  // กำหนดประเภทเป็น customer
        createdAt: formatDateTime(new Date()), // เพิ่มวันที่สมัคร
      });

      // ตั้งค่า Cookie เก็บ lineId ด้วย cookies-next
      setCookie('lineId', lineId, {
        req, // ต้องส่ง req ไปด้วย
        res, // และส่ง res ไปด้วย
        httpOnly: true,  // กำหนดว่า Cookie นี้จะไม่สามารถเข้าถึงจาก JavaScript ฝั่ง Client
        secure: process.env.NODE_ENV === 'production',  // ใช้ secure ในโหมด production
        maxAge: 60 * 60 * 24 * 7,  // ตั้งเวลาให้หมดอายุภายใน 7 วัน
        path: '/',  // Cookie ใช้ได้ในทุก path
      });

      res.status(201).json({ message: "Customer registered successfully" });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Database error", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
