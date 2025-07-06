import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import axios from 'axios';
import { oauth2client } from '../utils/googleConfig.js';

export const googleLogin = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ 
                success: false,
                message: "Authorization code is required" 
            });
        }

        // Exchange code for tokens
        const { tokens } = await oauth2client.getToken(code);
        oauth2client.setCredentials(tokens);

        // Get user info using the access token
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

        // Find or create user
        let user = await User.findOne({ 
            $or: [{ email }, { googleId }] 
        });

        if (!user) {
            user = await User.create({
                email,
                name,
                image: picture,
                googleId,
                authMethod: 'google',
                isVerified: true,
                declaredGender: 'male',
                collegeId: `temp-${crypto.randomBytes(4).toString('hex')}`,
                branch: 'PIE'
            });
        } else if (!user.googleId) {
            // Update existing user with Google credentials
            user.googleId = googleId;
            user.authMethod = 'google';
            user.isVerified = true;
            if (picture) user.image = picture;
            await user.save();
        }

        // Create JWT token
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
                authMethod: user.authMethod
            }
        });

    } catch (error) {
        console.error('Google login error:', error);
        
        // More specific error handling
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





