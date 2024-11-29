/* pages/api/getUserDataAPI.js */

import { connectToDatabase } from "../../lib/mongodb";
import { getCookie } from "cookies-next"; // นำเข้า getCookie

export default async function handler(req, res) {
  if (req.method === "GET") {
    // อ่านคุกกี้ lineId จาก request
    const lineId = getCookie('lineId', { req, res });

    if (!lineId) {
      return res.status(400).json({ message: "lineId cookie is required" });
    }

    try {
      const { db } = await connectToDatabase();

      // ค้นหาผู้ใช้จากฐานข้อมูลที่มี lineId
      const user = await db.collection("users").findOne({ lineId });

      if (!user) {
        return res.status(404).json({ message: "User data not found" });
      }

      // ถ้าผู้ใช้มี userType เป็น 'customer' หรือ 'astrologer' แสดงข้อมูลตาม userType
      if (user.userType === "customer") {
        return res.status(200).json({ customer: user });
      } else if (user.userType === "astrologer") {
        return res.status(200).json({ astrologer: user });
      } else {
        return res.status(404).json({ message: "User type not recognized" });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
