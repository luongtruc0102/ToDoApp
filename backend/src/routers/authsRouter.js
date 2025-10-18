import express from 'express'
import { Register, Login, sendOtp, verifyOtp, changePassword} from "../controllers/authControllers.js";
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/change-password", auth, changePassword);

export default router