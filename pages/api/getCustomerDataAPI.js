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

      const customer = await User.findOne({ lineId, userType: "customer" });

      if (!customer) {
        return res.status(404).json({ message: "Customer data not found" });
      }

      const formattedCustomer = {
        ...customer.toObject(),
        birthdate: moment(customer.birthdate).format('DD/MM/YYYY'),
        createdAt: moment(customer.createdAt).format('DD/MM/YYYY HH:mm:ss'),
      };

      res.status(200).json({ customer: formattedCustomer });
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}