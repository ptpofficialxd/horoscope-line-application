import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  lineId: String,
  userType: String,
  firstName: String,
  lastName: String,
  phone: String,
  gender: String,
  birthdate: Date,
  age: Number,
  selfDescription: String,
  branch: String,
  serviceHours: {
    start: String,
    end: String,
  },
  profilePicture: String,
  certificate: String,
  createdAt: Date,
});

export default mongoose.models.User || mongoose.model("User", userSchema);
