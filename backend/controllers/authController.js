import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { oauth2client } from '../utils/googleConfig.js';
import crypto from 'crypto';
import sendVerificationEmail from '../utils/sendVerificationEmail.js';

// Google login
export const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ 
        success: false,
        message: "Authorization code is required" 
      });
    }

    const { tokens } = await oauth2client.getToken(code);
    oauth2client.setCredentials(tokens);

    const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });

    const { email, name, picture, sub: googleId } = data;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Could not get email from Google"
      });
    }

    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (!user) {
      user = await User.create({
        email,
        name,
        image: picture,
        googleId,
        authMethod: 'google',
        isVerified: true,
        collegeId: `temp-${crypto.randomBytes(4).toString('hex')}`
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.authMethod = 'google';
      user.isVerified = true;
      if (picture) user.image = picture;
      await user.save();
    }

    const token = jwt.sign(
      { 
        _id: user._id, 
        email: user.email,
        authMethod: user.authMethod 
      },
      process.env.JWT_SECRET,
      { expiresIn: '5d' }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        image: user.image,
        isVerified: user.isVerified,
        authMethod: user.authMethod,
        declaredGender: user.declaredGender,
        branch: user.branch
      }
    });

  } catch (error) {
    console.error('Google login error:', error);
    if (error.response?.data?.error === 'invalid_grant') {
      return res.status(400).json({
        success: false,
        message: "Invalid authorization code. Please try again."
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Failed to authenticate with Google' 
    });
  }
};

// Manual signup
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    const newUser = new User({
      name,
      email,
      password,
      authMethod: 'local',
      collegeId: `manual-${crypto.randomBytes(4).toString('hex')}`,
      emailVerificationToken: token,
      emailVerificationExpires: tokenExpiry
    });

    await newUser.save();
    await sendVerificationEmail(email, token);

    return res.status(201).json({ message: 'Signup successful. Please verify your email.' });
  } catch (err) {
  console.error("Signup error:", err);
  return res.status(500).json({ message: 'Error during signup', error: err.message });
}

};

// Email verification
export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/verify-failed`);
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    return res.redirect(`${process.env.CLIENT_URL}/verify-success`);
  } catch (err) {
    return res.status(500).json({ message: 'Error verifying email', error: err.message });
  }
};

// Manual login
export const manualLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (!user.isVerified) return res.status(403).json({ message: 'Email not verified' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        isVerified: user.isVerified,
        declaredGender: user.declaredGender,
        branch: user.branch
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
