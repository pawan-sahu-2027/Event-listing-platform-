import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {upload} from "../middleware/multer.js";

import {
  createAdvertisementCheckout,
  stripeWebhook,
  createCheckoutSession
} from "../controllers/paymentController.js";

const router = express.Router();

 router.post(
  "/advertisement-session",
  isAuthenticated,
  upload.single("image"),   
  createAdvertisementCheckout,
);
router.post(
  "/create-session",
  isAuthenticated,
  createCheckoutSession
);

export default router;
