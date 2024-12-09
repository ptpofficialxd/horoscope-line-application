import { connectToDatabase } from "../../lib/mongodb";
import User from "../../models/user";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function handler(req, res) {
  await connectToDatabase();

  const { branch, serviceTime } = req.body;

  console.log("Received branch from body:", branch);
  console.log("Received serviceTime from body:", serviceTime);

  try {
    if (!branch && !serviceTime) {
      console.log("No criteria selected.");
      return res.status(400).json({ message: "กรุณาเลือกสาขาที่เชี่ยวชาญหรือช่วงเวลาให้บริการ" });
    }

    const branchArray = branch ? (Array.isArray(branch) ? branch : [branch]) : [];

    // กำหนดช่วงเวลาให้บริการในเขตเวลาไทย
    let timeQuery = {};
    const morningStart = dayjs().tz("Asia/Bangkok").set('hour', 7).set('minute', 0).set('second', 0).toISOString();
    const morningEnd = dayjs().tz("Asia/Bangkok").set('hour', 12).set('minute', 0).set('second', 0).toISOString();
    const afternoonStart = dayjs().tz("Asia/Bangkok").set('hour', 12).set('minute', 0).set('second', 0).toISOString();

    if (serviceTime === "morning") {
      timeQuery = { "serviceHours.start": { $gte: morningStart, $lt: morningEnd } };
    } else if (serviceTime === "afternoon") {
      timeQuery = { "serviceHours.start": { $gte: afternoonStart } };
    }

    const query = {
      ...(branchArray.length > 0 && { branch: { $in: branchArray } }),
      ...timeQuery,
    };

    const astrologers = await User.find(query);

    console.log("Astrologers found:", astrologers);

    if (astrologers.length > 0) {
      res.status(200).json(astrologers);
    } else {
      console.log("No astrologers found in database.");
      res.status(404).json({ message: "ไม่พบหมอดูที่ตรงกับเงื่อนไข" });
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลหมอดู", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลหมอดู" });
  }
}