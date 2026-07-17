import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

import { stripeWebhook } from "./controllers/paymentController.js";

dotenv.config();

const app = express();

/* -------------------- CORS -------------------- */

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* -------------------- Stripe Webhook -------------------- */
/* IMPORTANT: Must come BEFORE express.json() */

// app.post(
//   "/api/v1/payment/webhook",
//   express.raw({ type: "application/json" }),
//   stripeWebhook
// );


app.use((req, res, next) => {
  console.log("METHOD:", req.method);
  console.log("PATH:", req.path);
  console.log("URL:", req.url);
  next();
});


app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  (req,res,next)=>{
    console.log("🔥 APP.JS WEBHOOK ROUTE HIT");
    next();
  },
  stripeWebhook
);
/* -------------------- Body Parser -------------------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* -------------------- Routes -------------------- */

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/event", eventRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/chat", chatRoutes);
console.log("Connecting to MongoDB...");
/* -------------------- Health Check -------------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Running 🚀",
  });
});

/* -------------------- 404 -------------------- */

app.all("/{*any}", (req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

export default app;