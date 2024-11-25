// pages/api/registerCustomer.js
import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, phone, email } = req.body;

    try {
      const db = await connectToDatabase();
      const collection = db.collection("customers");
      const result = await collection.insertOne({ name, phone, email });

      return res.status(200).json({
        message: "Customer registered successfully!",
        result,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error registering customer",
        error,
      });
    }
  }
}
