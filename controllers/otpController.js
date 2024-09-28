// otpController.js

import OTP from '../models/otp.js';
import { generateOTP, sendEmail } from '../utils/otpUtils.js';


export const sendOTP = async (req, res) => {
  const { identifier } = req.body;

  // Generate OTP and sign it with the identifier
  const otp = generateOTP();
  const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration
  
    try {
      
    // Store OTP in the database
    await OTP.findOneAndUpdate(
        { identifier },
        { otp, expirationTime },
        { upsert: true, new: true } // Create if doesn't exist, update if exists
    );
    // Check if identifier is a phone number or email
    if (/^\d{10}$/.test(identifier)) {
      // Phone number
      await sendSMS(identifier, otp); // Send OTP via SMS
    } else {
      // Email
      await sendEmail(identifier, otp); // Send OTP via Email
    }

    // Respond with success and the OTP token
    res.status(200).json({ success: true, otpToken, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending OTP' });
  }
};

export const verifyOTP = async (req, res) => {
  const { otp, identifier } = req.body;

  try {
    // Retrieve the OTP from the database
    const otpRecord = await OTP.findOne({ identifier });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired' });
    }

    // Check if the OTP matches
    if (otpRecord.otp !== parseInt(otp, 10)) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    

    // OTP is valid
    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
};
