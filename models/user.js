import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  lineId: String,
  firstName: String,
  lastName: String,
  phone: String,
  birthdate: Date,
  age: Number,
  gender: String,
  userType: String,
  selfDescription: String,
  branch: String,
  createdAt: Date,
});

export default mongoose.models.User || mongoose.model("User", userSchema);
