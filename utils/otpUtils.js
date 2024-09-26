import jwt from 'jsonwebtoken';
import twilio from 'twilio';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Generate a 6-digit OTP
export const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Sign the OTP with a JWT token
export const signOTPToken = (otp, identifier) => {
  const payload = { otp, identifier };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: `${process.env.OTP_EXPIRY_MINUTES}m` });
};

// Verify the JWT token for OTP
export const verifyOTPToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired OTP token.');
  }
};

// Initialize Twilio client with credentials from the environment variables
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Send OTP via SMS using Twilio
 * @param {string} phoneNumber - The user's phone number (without country code)
 * @param {string} otp - The OTP to be sent
 * @param {string} [countryCode='+91'] - Country code, defaults to +91 for India
 * @returns {Promise<void>}
 */
export const sendOTPMessage = async (phoneNumber, otp, countryCode = '+91') => {
  try {
    const phoneNumberWithCode = countryCode + phoneNumber;
    await client.messages.create({
      body: `Your OTP for LaundryBinApp is ${otp}. It will expire in ${process.env.OTP_EXPIRY_MINUTES} minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumberWithCode,
    });
    console.log(`OTP sent to ${phoneNumberWithCode}`);
  } catch (error) {
    console.error('Failed to send OTP:', error);
    throw new Error('Failed to send OTP via SMS');
  }
};

/**
 * Send OTP via Email using Nodemailer
 * @param {string} identifier - The user's email address
 * @param {string} otp - The OTP to be sent
 * @returns {Promise<void>}
 */
export const sendEmail = async (identifier, otp) => {
  console.log("Email being sent to:", identifier);
  try {
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    const transporter = nodemailer.createTransport({
      // service:"gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
      },
      
      requireTLS:true,
      logger:true
      
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: identifier,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    });
    console.log(`OTP sent to ${identifier}}`);
  } catch (error) {
    console.error('Failed to send OTP via email:', error);
    throw new Error('Failed to send OTP via email');
  }
};
