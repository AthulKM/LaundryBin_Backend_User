// otpRoutes.js

import express from 'express';
import { sendOTP, verifyOTP } from '../controllers/otpController.js';

const router = express.Router();

// Route for OTP generation
router.post('/send-otp', sendOTP);

// Route for OTP verification
router.post('/verify-otp', verifyOTP);

export default router;
