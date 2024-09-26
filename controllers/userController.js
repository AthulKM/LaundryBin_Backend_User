import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendOTPMessage } from '../utils/twilioService.js';
import { generateOTP, signOTPToken, verifyOTPToken  } from '../utils/otpUtils.js';

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

    // // OTP verification flow
    // if (!otpToken) {
    //   // Generate OTP and sign it with a JWT
    //   const generatedOtp = generateOTP();
    //   const otpJWT = signOTPToken(generatedOtp, phoneNumber);

    //   // Send the OTP using your Twilio utility (assumed to be already implemented)
    //   await sendOTPMessage(phoneNumber, generatedOtp);

    //   return res.status(200).json({
    //     message: `OTP sent to ${phoneNumber}. Please verify.`,
    //     otpToken: otpJWT, // Return the signed OTP token
    //     otpSent: true,
    //   });
    // } else {
    //   // Step 2: Verify the provided OTP token
    //   const decodedToken = verifyOTPToken(otpToken);
      
    //   if (decodedToken.otp !== otp || decodedToken.phoneNumber !== phoneNumber) {
    //     return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    //   }

    //   // OTP verified, proceed to registration
    // }



    
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


// Controller to login a user
// export const loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     // Find user by email
//     const user = await User.findOne({ email });

//     if (user && (await bcrypt.compare(password, user.password))) {
//         const token = jwt.sign(
//             {
//                 id: user._id,
//                 email: user.email,
//                 phoneNumber: user.phoneNumber
//             },
//             JWT_SECRET,
//             { expiresIn: '1h' }
//         );
//         res.status(200).json({
//             message:"Login successful",
//             _id: user._id,
//             email: user.email,
//             phoneNumber: user.phoneNumber,
//             username: user.username,
//             role: user.role,
//             status: "Success",
//             token:token,
//             error:false
//         });
//     } else {
//         res.status(401).json({ message: 'Invalid email/phone number or password' });
//     }
// };

// Login route handler (Express)
export const loginUser = async (req, res) => {
    const { identifier, password } = req.body;
  
    try {
      // Check if the identifier is an email or phone number
      const isPhoneNumber = /^[0-9]{10}$/.test(identifier);
      const query = isPhoneNumber ? { phoneNumber: identifier } : { email: identifier };
  
      // Find user by email or phone number
      const user = await User.findOne(query);
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
  
      // Compare password (assuming you hash the password with bcrypt)
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // If the user exists and password matches, generate a token (e.g., JWT)
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expiration time
      });
  
      // Send a success response with the token
      return res.json({
        message: 'Login successful',
        token,
        data: user,
        success:true
      });
    } catch (error) {
      console.error(error); // Log the error for debugging
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