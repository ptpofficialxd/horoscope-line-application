import { connectToDatabase } from "../../lib/mongodb";
import User from '../../models/user';
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { lineId } = req.body;
    const customerRichMenuId = process.env.CUSTOMER_RICH_MENU_ID;
    const astrologerRichMenuId = process.env.ASTROLOGER_RICH_MENU_ID;

    try {
      await connectToDatabase();

      const user = await User.findOne({ lineId });

      if (!user) {
        return res.status(404).json({ message: "Cannot find userId in the database" });
      }

      let richMenuId;

      if (user.userType === "customer") {
        richMenuId = customerRichMenuId;
      } else if (user.userType === "astrologer") {
        richMenuId = astrologerRichMenuId;
      } else {
        return res.status(400).json({ message: "Invalid userType" });
      }

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