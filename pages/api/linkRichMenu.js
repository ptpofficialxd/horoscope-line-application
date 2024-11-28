/* pages/api/linkRichMenu.js */

import { connectToDatabase } from "../../lib/mongodb";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { lineId } = req.body; // รับ lineId จาก body
    const customerRichMenuId = process.env.CUSTOMER_RICH_MENU_ID; // Rich Menu สำหรับ customer
    const astrologerRichMenuId = process.env.ASTROLOGER_RICH_MENU_ID; // Rich Menu สำหรับ astrologer

    try {
      const { db } = await connectToDatabase();

      // ค้นหาผู้ใช้ในฐานข้อมูลที่มี lineId
      const user = await db.collection("users").findOne({ lineId });

      if (!user) {
        return res.status(404).json({ message: "Cannot find userId in the database" });
      }

      // เลือก Rich Menu ที่ต้องการเชื่อมโยงตาม userType
      let richMenuId;
      
      // ตรวจสอบ userType
      if (user.userType === "customer") {
        richMenuId = customerRichMenuId; // ถ้า userType เป็น "customer"
      } else if (user.userType === "astrologer") {
        richMenuId = astrologerRichMenuId; // ถ้า userType เป็น "astrologer"
      } else {
        return res.status(400).json({ message: "Invalid userType" });
      }

      // ส่งคำขอไปที่ LINE API เพื่อเชื่อมโยง rich menu
      const response = await axios.post(
        `https://api.line.me/v2/bot/user/${lineId}/richmenu/${richMenuId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      res.status(200).json({ message: "Rich Menu linked successfully", data: response.data });
    } catch (error) {
      console.error("Error linking the Rich Menu:", error.response?.data || error.message);
      res.status(500).json({ error: error.response?.data || error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
