// otpRoutes.js

import express from 'express';
import { verifyLoginOTP } from '../utils/otpUtils.js';


const router = express.Router();



// Route for OTP verification
router.post('/verify-otp', verifyLoginOTP);

export default router;
