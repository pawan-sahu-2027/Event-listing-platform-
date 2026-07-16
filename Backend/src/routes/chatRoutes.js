// import express from "express";
// import { chatWithAI } from "../controllers/chatController.js";

// const router = express.Router();

// router.post("/", chatWithAI);

// export default router;


import express from "express";
import { chatWithAI } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", (req, res, next) => {
  console.log("🔥 Chat Route Hit");
  next();
}, chatWithAI);

export default router;