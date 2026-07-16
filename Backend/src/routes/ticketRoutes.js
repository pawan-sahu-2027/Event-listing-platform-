import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {bookFreeTicket} from "../controllers/ticketController.js" 

const router = express.Router();



router.post("/book-free", isAuthenticated, bookFreeTicket);