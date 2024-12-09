import { connectToDatabase } from "../../lib/mongodb";
import User from '../../models/user';
import { getCookie } from "cookies-next";
import moment from "moment";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const lineId = getCookie('lineId', { req, res });

    if (!lineId) {
      return res.status(400).json({ message: "lineId cookie is required" });
    }

    try {
      await connectToDatabase();

      const astrologer = await User.findOne({ lineId, userType: "astrologer" });

      if (!astrologer) {
        return res.status(404).json({ message: "Astrologer data not found" });
      }

      const formattedAstrologer = {
        _id: astrologer._id,
        lineId: astrologer.lineId,
        userType: 
          astrologer.userType === "astrologer" ? "หมอดูดวง" : "",
        firstName: astrologer.firstName,
        lastName: astrologer.lastName,
        phone: astrologer.phone,
        gender: 
          astrologer.gender === "male" ? "ชาย" : 
          astrologer.gender === "female" ? "หญิง" : 
          astrologer.gender === "others" ? "อื่นๆ" : "",  // แปลงค่า gender เป็นภาษาไทย
        birthdate: moment(astrologer.birthdate).format("DD/MM/YYYY"),
        age: astrologer.age,
        selfDescription: astrologer.selfDescription,
        branch: astrologer.branch.map((branch) =>
          branch === "astrology" ? "โหราศาสตร์" :
          branch === "numerology" ? "เลขศาสตร์" :
          branch === "tarot" ? "ทำนายไพ่" :
          branch === "palmistry" ? "ลายมือ" :
          branch === "zodiac" ? "ราศี" :
          branch === "fengshui" ? "ฮวงจุ้ย" : ""
        ),
        serviceHours: astrologer.serviceHours && {
          start: moment(astrologer.serviceHours.start).tz('Asia/Bangkok').format('HH:mm'),
          end: moment(astrologer.serviceHours.end).tz('Asia/Bangkok').format('HH:mm'),
        },
        createdAt: moment(astrologer.createdAt).tz("Asia/Bangkok").format("DD/MM/YYYY @HH:mm:ss"),
      };

      res.status(200).json({ astrologer: formattedAstrologer });
    } catch (error) {
      console.error("Error fetching astrologer:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}