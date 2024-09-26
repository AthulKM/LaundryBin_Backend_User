import jwt from 'jsonwebtoken';

export const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

export const signOTPToken = (otp, phoneNumber) => {
  const payload = { otp, phoneNumber };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: `${process.env.OTP_EXPIRY_MINUTES}m` });
};

export const verifyOTPToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired OTP token.');
  }
};
