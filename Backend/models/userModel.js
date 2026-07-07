import mongoose from "mongoose";

const userModel = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  image: {type: String},
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user",
  },
  token:{type:String},
  otp:{type:String},
  password:{type:String},
  isVerified: { type: Boolean, default: false },
  password:{type:String},
  googleId: String,
  whatsAppNumber: String,
isWhatsAppVerified: Boolean
  
}, { timestamps: true });

// export default mongoose.model("User", userSchema);
// const User = mongoose.model("User", userSchema);
const User = mongoose.models.User || mongoose.model("User", userModel);

export default User;