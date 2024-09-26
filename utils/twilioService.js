import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Twilio client with credentials from the environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio phone number

const client = twilio(accountSid, authToken);

/**
 * Send OTP message to a user's phone number
 * @param {string} phoneNumber - The user's phone number
 * @param {string} otp - The OTP to be sent
 * @returns {Promise<void>}
 */
export const sendOTPMessage = async (phoneNumber, otp) => {
  try {
    const phoneNumberWithCode = '+91' + phoneNumber;
    await client.messages.create({
      body: `Your OTP for LaundryBinApp is ${otp}. It will expire in ${process.env.OTP_EXPIRY_MINUTES} minutes.`,
      from: twilioPhoneNumber, // Use your Twilio phone number
      to: phoneNumberWithCode,
    });
    console.log(`OTP sent to ${phoneNumberWithCode}`);
  } catch (error) {
    console.error('Failed to send OTP:', error);
    throw new Error('Failed to send OTP');
  }
};