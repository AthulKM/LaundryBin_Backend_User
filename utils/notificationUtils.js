import twilio from 'twilio';
import nodemailer from 'nodemailer';

// Example function to send SMS using Twilio
export const sendSMS = async (phoneNumber, otp) => {
    const numberWithCountryCode = "+91" + phoneNumber;
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  await client.messages.create({
    body: `Your OTP code is ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: numberWithCountryCode,
  });
};

// Example function to send email using Nodemailer
export const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  });
};
