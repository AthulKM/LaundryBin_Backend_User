import { generateOTP, signOTPToken, verifyOTPToken } from '../utils/otpUtils.js';
import { sendOTPMessage } from '../utils/twilioService.js';

/**
 * Send OTP for account verification
 */
export const sendOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required.' });
  }

  try {
    const otp = generateOTP();
    const otpToken = signOTPToken(otp, phoneNumber);

    // Send OTP via Twilio
    await sendOTPMessage(phoneNumber, otp);

    res.status(200).json({ otpToken, message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP.' });
  }
};

/**
 * Verify OTP for account verification
 */
export const verifyOTP = async (req, res) => {
  const { otpToken, otp, phoneNumber } = req.body;

  try {
    const decoded = verifyOTPToken(otpToken);
    
    if (decoded.otp === otp && decoded.phoneNumber === phoneNumber) {
      return res.status(200).json({ message: 'OTP verified successfully.' });
    }

    return res.status(400).json({ message: 'Invalid OTP or phone number.' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(400).json({ message: 'OTP verification failed.' });
  }
};
