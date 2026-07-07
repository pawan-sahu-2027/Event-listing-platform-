import mongoose from "mongoose";

const pendingEventSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    eventData: {
      title: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },

      location: {
        type: String,
        required: true,
      },

      locationLink: {
        type: String,
      },

      category: {
        type: String,
        enum: ["Music", "Tech", "Sports", "Business", "Education"],
        required: true,
      },

      startDate: {
        type: Date,
        required: true,
      },

      endDate: {
        type: Date,
        required: true,
      },

      startTime: {
        type: String,
        required: true,
      },

      endTime: {
        type: String,
        required: true,
      },

      ticketPrice: {
        type: Number,
        default: 0,
      },

      maxUsers: {
        type: Number,
        default: 0,
      },

      imageBuffer: {
        type: String,
      },

      imageMimeType: {
        type: String,
      },
    },

    advertisementData: {
      planType: {
        type: String,
        enum: ["basic", "whatsapp"],
        required: true,
      },

      promotionTypes: [
        {
          type: String,
          enum: ["highlight", "whatsapp"],
        },
      ],

      price: {
        type: Number,
        required: true,
      },

      endDate: {
        type: Date,
        required: true,
      },
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PendingEvent ||
  mongoose.model("PendingEvent", pendingEventSchema);