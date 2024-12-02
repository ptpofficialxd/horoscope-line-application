import mongoose from "mongoose";
import moment from "moment";

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

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.birthdate) {
      ret.birthdate = moment(ret.birthdate).format("DD-MM-YYYY");
    }
    if (ret.createdAt) {
      ret.createdAt = moment(ret.createdAt).format("DD-MM-YYYY HH:mm:ss");
    }
    return ret;
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
