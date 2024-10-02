import jwt from 'jsonwebtoken';
import twilio from 'twilio';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

import OTP from '../models/otp.js';
import User from '../models/user.js';

dotenv.config();

// Generate a 6-digit OTP
export const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

export const sendOTP = async (req, res) => {
  const { identifier } = req.body;

  // Generate OTP and sign it with the identifier
  const otp = generateOTP();
  const expirationTime = new Date(Date.now() + process.env.OTP_EXPIRY_MINUTES * 60 * 1000); // 1 minute expiration by default
  
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
    res.status(200).json({ success: true, otpToken, message: `OTP sent successfully, OTP will be expired by ${expirationTime}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending OTP' });
  }
};

export const verifyLoginOTP = async (req, res) => {
  const { otp, userId } = req.body;
  console.log(` ${otp}`);
  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    // Check if OTP exists in the database
    const otpRecord = await OTP.findOne({ 
      identifier: user.email || user.phoneNumber, // Look up by email or phone number
      otp,
    });

    if (!otpRecord) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Check if OTP has expired
    if (otpRecord.expirationTime < new Date(Date.now())) {
      await OTP.deleteOne({ _id: otpRecord._id }); // Clean up expired OTP
      return res.status(401).json({ message: 'OTP expired' });
    }
    

    // OTP is valid, delete OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate JWT token after successful OTP verification
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expiration time
    });

    // Respond with success and the token
    return res.status(200).json({
      message: 'Login successful',
      token,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const verifyPasswordResetOTP = async (req, res) => {
  const { otp, userId } = req.body;
  console.log(` ${otp}`);
  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    // Check if OTP exists in the database
    const otpRecord = await OTP.findOne({ 
      identifier: user.email || user.phoneNumber, // Look up by email or phone number
      otp,
    });

    if (!otpRecord) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Check if OTP has expired
    if (otpRecord.expirationTime < new Date(Date.now())) {
      await OTP.deleteOne({ _id: otpRecord._id }); // Clean up expired OTP
      return res.status(401).json({ message: 'OTP expired' });
    }
    

    // OTP is valid, delete OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate JWT token after successful OTP verification
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expiration time
    });

    // Respond with success and the token
    return res.status(200).json({
      message: 'Set a new password',
      token,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};




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
