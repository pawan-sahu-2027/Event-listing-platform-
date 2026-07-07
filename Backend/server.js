import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import paymentRoutes from "./routes/paymentRoutes.js";
import { stripeWebhook } from "./controllers/paymentController.js";
import chatRoutes from "./routes/chatRoutes.js";
dotenv.config();

const app = express();




app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.originalUrl}`);
//   next();
// });

app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);



app.use(express.json());


// other routes...
app.use("/api/v1/event", eventRoutes); 
app.use("/api/v1/user",  userRoutes);
app.use("/api/v1/payment" ,paymentRoutes);
app.use("/api/v1/chat", chatRoutes);  

const PORT = 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Server running on port ${PORT}`);
});

// 🔌 Connect to DB asynchronously without blocking app.listen

try {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from your environment variables!");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("🚀 MongoDb connected successfully");
} catch (dbError) {
  console.error("❌ MongoDB connection failed:", dbError.message);
}