import express from "express";
import {signUp , otpVerify , googleSignUp , getUserData , completeProfile , getUser , login} from "../controllers/userController.js"
// import { isAuthenticated } from "../middleware/isAuthenticated";
import {isAuthenticated} from "../middleware/isAuthenticated.js"
import { upload } from "../middleware/multer.js";
const router = express.Router();
router.post("/signUp", signUp);
router.post("/otpVerification" , otpVerify);
router.post("/googleSignUp", googleSignUp);
router.post("/getUserData",getUserData);
router.patch("/completeProfile", upload.none(),completeProfile );  
router.post("/login" , login);
router.get("/getUser",isAuthenticated , getUser);


export default router;