import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },  // Reference to User model
  identifier: {
    type: String,
    required: true,
    unique: true,  
  },
  otp: {
    type: Number,
    required: true,
  },
  expirationTime: {
    type: Date
  },
}, { timestamps: true });

// Automatically remove expired OTPs
otpSchema.index({ expirationTime: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
