/* pages/api/registerCustomerAPI.js */

import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { 
      lineId, 
      firstName, 
      lastName, 
      phone, 
      birthdate, 
      gender, 
      age 
    } = req.body;
    try {
      const { db } = await connectToDatabase();
      // ตรวจสอบว่ามี Line ID อยู่แล้วหรือไม่
      const existingUser = await db.collection("users").findOne({ lineId });
      if (existingUser) {
        return res.status(400).json({ message: "\nLineID นี้ทำการสมัครสมาชิกไว้อยู่แล้ว!" });
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
          hour12: false, // ใช้เวลาแบบ 24 ชั่วโมง
          timeZone: "Asia/Bangkok",
        });
      };
      // หากไม่มี Line ID ซ้ำ ให้เพิ่มข้อมูลลงฐานข้อมูล
      await db.collection("users").insertOne({
        lineId,
        firstName,
        lastName,
        phone,
        birthdate,
        gender,
        age,
        userType: "customer", // กำหนดประเภทเป็น customer
        createdAt: formatDateTime(new Date()), // เพิ่มวันที่สมัครแบบแปลงแล้ว
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
