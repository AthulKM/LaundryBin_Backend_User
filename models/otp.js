import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
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
otpSchema.index({ expirationTime: 300 }, { expireAfterSeconds: 600 });

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
