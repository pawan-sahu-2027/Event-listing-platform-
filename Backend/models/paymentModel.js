import mongoose from "mongoose";

const paymentModel = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },

  amount: Number,

  paymentType: {
    type: String,
    enum: ["ticket", "advertisement"],
  },

  plan: {
    type: String,
    enum: ["featured", "whatsapp"],
  },

  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },

  stripePaymentIntentId: String,

  stripeSessionId: String,

}, {
  timestamps: true,
});

const Payment =
  mongoose.models.Payment ||
  mongoose.model("Payment", paymentModel);

export default Payment;