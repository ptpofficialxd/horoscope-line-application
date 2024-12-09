import { connectToDatabase } from "../../lib/mongodb";
import User from "../../models/user";
import { getCookie } from "cookies-next";
import moment from "moment-timezone";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const lineId = getCookie("lineId", { req, res });

    if (!lineId) {
      return res.status(400).json({ message: "lineId cookie is required" });
    }

    try {
      await connectToDatabase();

      const user = await User.findOne({ lineId });

      if (!user) {
        return res.status(404).json({ message: "User data not found" });
      }

      const formattedUser = {
        _id: user._id,
        lineId: user.lineId,
        userType: 
          user.userType === "customer" ? "ลูกค้า" :
          user.userType === "astrologer" ? "หมอดูดวง" : "",
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        gender: 
          user.gender === "male" ? "ชาย" : 
          user.gender === "female" ? "หญิง" : 
          user.gender === "others" ? "อื่นๆ" : "",  // แปลงค่า gender เป็นภาษาไทย
        birthdate: moment(user.birthdate).format("DD/MM/YYYY"),
        age: user.age,
        selfDescription: user.selfDescription,
        branch: user.branch ? user.branch.map((branch) =>
          branch === "astrology" ? "โหราศาสตร์" :
          branch === "numerology" ? "เลขศาสตร์" :
          branch === "tarot" ? "ทำนายไพ่" :
          branch === "palmistry" ? "ลายมือ" :
          branch === "zodiac" ? "ราศี" :
          branch === "fengshui" ? "ฮวงจุ้ย" : ""
        ) : [],
        serviceHours: user.serviceHours && {
          start: moment(user.serviceHours.start).tz('Asia/Bangkok').format('HH:mm'),
          end: moment(user.serviceHours.end).tz('Asia/Bangkok').format('HH:mm'),
        },
        createdAt: moment(user.createdAt).tz("Asia/Bangkok").format("DD/MM/YYYY HH:mm:ss"),
      };

      if (user.userType === "customer") {
        return res.status(200).json({ customer: formattedUser });
      } else if (user.userType === "astrologer") {
        return res.status(200).json({ astrologer: formattedUser });
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
