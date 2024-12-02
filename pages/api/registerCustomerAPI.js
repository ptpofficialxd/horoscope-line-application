import { connectToDatabase } from '../../lib/mongodb';
import User from '../../models/user';
import { setCookie } from 'cookies-next';

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { lineId, firstName, lastName, phone, birthdate, age, gender } = req.body;

    try {
      await connectToDatabase();

      const existingUser = await User.findOne({ lineId });
      if (existingUser) {
        return res.status(400).json({ message: "LineID นี้ทำการสมัครสมาชิกไว้อยู่แล้ว!" });
      }

      const newUser = new User({
        lineId,
        firstName,
        lastName,
        phone,
        birthdate,
        age,
        gender,
        userType: "customer",
        createdAt: new Date(),
      });

      await newUser.save();

      setCookie('lineId', lineId, {
        req,
        res,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      res.status(201).json({ message: "Customer registered successfully" });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Database error", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}