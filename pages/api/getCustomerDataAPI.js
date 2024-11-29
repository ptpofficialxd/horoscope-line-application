// pages/api/getCustomerDataAPI.js

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

      // ค้นหาผู้ใช้จากฐานข้อมูลที่มี userType เป็น 'customer'
      const customer = await db.collection("users").findOne({ lineId, userType: "customer" });

      if (!customer) {
        return res.status(404).json({ message: "Customer data not found" });
      }

      res.status(200).json({ customer });
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}