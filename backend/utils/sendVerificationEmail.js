// utils/sendVerificationEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (email, token) => {
//   const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  const verificationLink = `${process.env.BACKEND_URL}/auth/verify-email?token=${token}`;


  const mailOptions = {
  from: `"Saath Chaloge" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: 'Complete Your Saath Chaloge Registration',
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4A90E2;">Welcome to Saath Chaloge!</h2>
      
      <p>Thank you for registering with us. To complete your account setup and start using our services, please verify your email address by clicking the link below:</p>
      
      <p style="margin: 20px 0;">
        <a href="${verificationLink}" 
           style="color: #ffffff; background-color: #4A90E2; padding: 10px 20px; 
                  text-decoration: none; border-radius: 4px; font-weight: bold;">
          Verify Email Address
        </a>
      </p>
      
      <p style="font-size: 14px; color: #666666;">
        <strong>Note:</strong> This verification link will expire in 24 hours. If you didn't create this account, please ignore this email.
      </p>
    </div>
  `,
  text: `Welcome to Saath Chaloge!\n\nPlease verify your email address by visiting this link:\n${verificationLink}\n\nThis link expires in 24 hours. If you didn't request this, please ignore this email.`
};

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(' Email sent:', info.response);
  } catch (err) {
    console.error(' Email failed:', err.message);
  }
};

export default sendVerificationEmail;
