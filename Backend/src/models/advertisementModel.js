import mongoose from "mongoose";

const advertisementModel = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  planType: {
    type: String,
    enum: ["basic", "premium"],
  },
  price: Number,
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Advertisement", advertisementModel);