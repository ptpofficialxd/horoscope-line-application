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
        ...astrologer.toObject(),
        birthdate: moment(astrologer.birthdate).format('DD/MM/YYYY'),
        createdAt: moment(astrologer.createdAt).format('DD/MM/YYYY HH:mm:ss'),
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