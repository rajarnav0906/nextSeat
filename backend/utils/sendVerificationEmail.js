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
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email',
    html: `<p>Click the link to verify your email:</p><a href="${verificationLink}">${verificationLink}</a>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);
  } catch (err) {
    console.error('❌ Email failed:', err.message);
  }
};

export default sendVerificationEmail;
