import mongoose from "mongoose";

const eventModel = new mongoose.Schema(
  {
    title: String,
    description: String,
    location: String,
    locationLink: String,
    category: {
      type: String,
      enum: ["Music", "Tech", "Sports", "Business", "Education"],
    },
    image: String,
    public_id: String,
    startDate: Date,
    endDate: Date,
    ticketPrice: Number,
    maxUsers: { type: Number, default: 0 },
    totalTicketsSold: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isPromoted: {
      type: Boolean,
      default: false,
    },

    promotionTypes: [
      {
        type: String,
        enum: ["highlight", "whatsapp"],
      },
    ],

    promotionAmount: {
      type: Number,
      default: 0,
    },
      // 🔥 IMPORTANT (for AI)
    embedding: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true },
);

// const Event = mongoose.model("Event", eventModel);
const Event = mongoose.models.Event || mongoose.model("Event", eventModel);

export default Event;
