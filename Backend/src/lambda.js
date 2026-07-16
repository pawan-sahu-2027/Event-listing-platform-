import dotenv from "dotenv";
import mongoose from "mongoose";
import serverless from "serverless-http";

import app from "./app.js";

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error:", error);
    throw error;
  }
};

const server = serverless(app);

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await connectDB();

  return server(event, context);
};