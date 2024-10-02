// otpRoutes.js

import express from 'express';
import { verifyLoginOTP, verifyPasswordResetOTP } from '../utils/otpUtils.js';


const router = express.Router();



// Route for OTP verification
router.post('/verify-otp', verifyLoginOTP);
router.post('/verify-passwordreset-otp', verifyPasswordResetOTP);

export default router;
