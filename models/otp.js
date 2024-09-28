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
    type: Date,
    required: true,
  },
}, { timestamps: true });

// Automatically remove expired OTPs
otpSchema.index({ expirationTime: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
