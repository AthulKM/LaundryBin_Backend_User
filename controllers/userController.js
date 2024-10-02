import User from '../models/user.js';
import OTP from '../models/otp.js';
import { generateOTP, sendOTPMessage, sendEmail } from '../utils/otpUtils.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';



dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;




export const registerUser = async (req, res) => {
  const { username, email, phoneNumber, password} = req.body;

  try {
    // Ensure username, password, and either email or phone number exist
    if (!username || !password || (!email && !phoneNumber)) {
      return res.status(400).json({ message: 'Username, password, and either email or phone number are required' });
    }

    
    // Check if either the email or phone number is already registered (if they are provided)
    let existingEmailOrPhone;
    if (email) {
      existingEmailOrPhone = await User.findOne({ email });
    }
    if (phoneNumber) {
      existingEmailOrPhone = await User.findOne({ phoneNumber });
    }
    
    if (existingEmailOrPhone) {
      return res.status(400).json({ message: 'Email or phone number already in use' });
    }
    
    // Hash the password before saving
      let hashedPassword = await bcrypt.hash(password, 10);
      
      // Create a new user object
    const newUser = new User({
        username,
        email,
        phoneNumber,
        password : hashedPassword,
      });
  

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    return res.status(201).json({
      message: `${newUser.username} registered successfully`,
      data: newUser,
      error: false,
      status: "Success"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};




// Login route handler (Express)
export const loginUser = async (req, res) => {
    const { identifier, password } = req.body;
  
    try {
      // Check if the identifier is an email or phone number
      const isPhoneNumber = /^[0-9]{10}$/.test(identifier);
      const query = isPhoneNumber ? { "phoneNumber": identifier } : { "email": identifier };
  
      // Find user by email or phone number
      const user = await User.findOne(query);
      
      if (!user) {
        console.log(isPhoneNumber);
        return res.status(401).json({ message: 'User not found' });
      }
  
      // Compare password 
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // Generate OTP
      const otp = generateOTP();

      const newOtpEntry = new OTP({
        identifier,  // Use phone number or email as identifier
        otp
    });
    
    await newOtpEntry.save();

      // Send OTP based on the identifier
      if (isPhoneNumber) {
        await sendOTPMessage(user.phoneNumber, otp);
      } else {
        await sendEmail(user.email, otp);
      }

  
      // Respond with a message, OTP sent but user is not yet authenticated
      return res.status(200).json({
        message: `OTP sent to ${isPhoneNumber ? user.phoneNumber : user.email}`,
        userId: user._id, // Return userId to reference later for OTP verification
        otp,  // Remove this in production (for testing purposes only)
        success: true,
      });
    } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ message: 'Server error' });
    }
};
  


// Forgot Password - Send OTP to Email/Phone
export const forgotPassword = async (req, res) => {
  const { identifier } = req.body;

  try {
    // Check if the identifier is a phone number or email
    const isPhoneNumber = /^[0-9]{10}$/.test(identifier);
    const query = isPhoneNumber ? { "phoneNumber": identifier } : { "email": identifier };

    // Find the user by email or phone number
    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Save OTP in the database (upsert to avoid duplicate entries)
    await OTP.findOneAndUpdate(
      { identifier },
      { otp, expirationTime },
      { upsert: true, new: true }
    );

    // Send OTP based on identifier
    if (isPhoneNumber) {
      await sendOTPMessage(user.phoneNumber, otp);
    } else {
      await sendEmail(user.email, otp);
    }

    return res.status(200).json({
      message: `OTP sent to ${isPhoneNumber ? user.phoneNumber : user.email}`,
      success: true,
      otp:otp
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Reset Password - Verify OTP and Update Password
export const resetPassword = async (req, res) => {
  const { identifier, otp, newPassword } = req.body;

  try {
    // Check if OTP is valid
    const otpEntry = await OTP.findOne({ identifier });

    if (!otpEntry || otpEntry.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // If OTP is valid, update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = /^[0-9]{10}$/.test(identifier) ? { "phoneNumber": identifier } : { "email": identifier };

    await User.findOneAndUpdate(query, { password: hashedPassword });

    // Optionally, you can delete the OTP entry after successful password reset
    await OTP.findOneAndDelete({ identifier });

    return res.status(200).json({ message: 'Password reset successful', success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};



// Controller to get all users
export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json({
        status: 'Success',
        data: users,
        error: false,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Server error while fetching users',
        error: true,
      });
    }
};
  
// Controller to get a user by ID
export const getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
          error: true,
        });
      }
  
      res.status(200).json({
        status: 'Success',
        data: user,
        error: false,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Server error while fetching user by ID',
        error: true,
      });
    }
  };



// Update user data using findByIdAndUpdate
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email,phoneNumber, username, password, role } = req.body;

    try {
        // Prepare the fields to update
        const updateData = {};
        if (email) updateData.email = email;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (username) updateData.username = username;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt); // Hash the new password
        }
        if (role) updateData.role = role;

        // Find the user by ID and update
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: "User updated successfully",
            _id: updatedUser._id,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber,
            username: updatedUser.username,
            status: "Success",
            error: false
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user data', error: error.message });
    }
};

// Delete a user using findByIdAndDelete
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the user by ID and delete
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: "User deleted successfully",
            status: "Success",
            error: false
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};