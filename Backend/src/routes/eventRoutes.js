import express from "express";
import { singleUpload } from "../middleware/multer.js";
import { getAllEvent , getSingleId ,deleteEvent , createEvent  } from "../controllers/eventController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
const router = express.Router();

router.post("/create",isAuthenticated, singleUpload, createEvent);  
router.get("/all", getAllEvent);
router.get("/single/:id" ,  getSingleId);
router.delete("/delete/:id" , isAuthenticated , deleteEvent );
export default router;