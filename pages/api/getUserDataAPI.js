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

      const user = await User.findOne({ lineId });

      if (!user) {
        return res.status(404).json({ message: "User data not found" });
      }

      const formattedUser = {
        ...user.toObject(),
        birthdate: moment(user.birthdate).format('DD/MM/YYYY'),
        createdAt: moment(user.createdAt).tz('Asia/Bangkok').format('DD/MM/YYYY HH:mm:ss'),
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