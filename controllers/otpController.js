// otpController.js

import { generateOTP, signOTPToken, verifyOTPToken, sendEmail } from '../utils/otpUtils.js';


export const sendOTP = async (req, res) => {
  const { identifier, password } = req.body;

  // Generate OTP and sign it with the identifier
  const otp = generateOTP();
  const otpToken = signOTPToken(otp, identifier); // Sign OTP with identifier
  
  try {
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
  const { otp, otpToken, identifier } = req.body;

  try {
    // Verify the OTP token and extract the payload
    const decoded = verifyOTPToken(otpToken);

    // Check if the OTP matches and identifier is the same
    if (decoded.otp !== parseInt(otp, 10) || decoded.identifier !== identifier) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // OTP is valid
    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
};
