import User from '../models/user.model.js';
import { sendOtpSchema, verifyOtpSchema, loginSchema } from '../validation/auth.validation.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import mockDb from '../config/mockDb.js';
import nodemailer from 'nodemailer';

// Helper to check if DB is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// Utility function to generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Utility function to send OTP via Email
const sendOTPToEmail = async (email, otp) => {
  // Check if email configuration is present
  const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = process.env;

  const isEmailConfigured = EMAIL_USER && EMAIL_PASS && EMAIL_USER !== 'your-email@gmail.com';

  if (!isEmailConfigured) {
    console.log(`[SIMULATED EMAIL] OTP ${otp} sent to ${email}`);
    console.warn('⚠️ Email credentials not configured in .env. Using simulated mode.');
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE || 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL_FROM || '"JobReady" <noreply@jobready.com>',
      to: email,
      subject: 'Your JobReady Verification Code',
      text: `Your verification code is: ${otp}. This code is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5;">JobReady Verification</h2>
          <p>Hello,</p>
          <p>Your verification code for JobReady Vocational Assistant is:</p>
          <div style="font-size: 32px; font-weight: bold; color: #4f46e5; margin: 20px 0; letter-spacing: 5px;">${otp}</div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[REAL EMAIL] OTP sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Nodemailer Error:', error);
    // Fallback to simulation for dev if real fails? No, better to report error if they wanted real.
    throw new Error('Failed to send verification email');
  }
};

// Send OTP Controller
export const sendOtp = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = sendOtpSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, email, phone, password, role } = value;

    // Check if user with email already exists and is verified
    let existingUser;
    if (isDbConnected()) {
      existingUser = await User.findOne({ email });
    } else {
      existingUser = await mockDb.findUserByEmail(email);
    }

    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({
        success: false,
        message: 'Account already exists'
      });
    }

    // Check if phone is already registered and verified
    let existingPhone;
    if (isDbConnected()) {
      existingPhone = await User.findOne({ phone, isVerified: true });
    } else {
      existingPhone = await mockDb.findUserByPhone(phone);
    }

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: 'Phone number already registered'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Send OTP to email
    await sendOTPToEmail(email, otp);

    // If user exists but not verified, update their record
    if (existingUser) {
      existingUser.name = name;
      existingUser.password = password;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      existingUser.role = role;

      if (isDbConnected()) {
        await existingUser.save();
      } else {
        await mockDb.saveUser(existingUser);
      }
    } else {
      // Create temporary user record
      const userData = {
        name,
        email,
        phone,
        password,
        role,
        otp,
        otpExpires,
        isVerified: false
      };

      if (isDbConnected()) {
        const user = new User(userData);
        await user.save();
      } else {
        await mockDb.saveUser(userData);
      }
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email',
      // For development/testing only - remove in production
      ...(process.env.NODE_ENV === 'development' && { otp })
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
};

// Verify OTP Controller
export const verifyOtp = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = verifyOtpSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, otp } = value;

    // Find user by email
    let user;
    if (isDbConnected()) {
      user = await User.findOne({ email });
    } else {
      user = await mockDb.findUserByEmail(email);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if OTP has expired
    if (!user.otpExpires || new Date() > user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    if (isDbConnected()) {
      await user.save();
    } else {
      await mockDb.saveUser(user);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id || user.id,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    );

    // Prepare response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. Account created!',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
};

// Resend OTP Controller
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    let user;
    if (isDbConnected()) {
      user = await User.findOne({ email, isVerified: false });
    } else {
      user = await mockDb.findUserByEmail(email);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found or already verified'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Send OTP to email
    await sendOTPToEmail(user.email, otp);

    // Update user record
    user.otp = otp;
    user.otpExpires = otpExpires;

    if (isDbConnected()) {
      await user.save();
    } else {
      await mockDb.saveUser(user);
    }

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      // For development/testing only - remove in production
      ...(process.env.NODE_ENV === 'development' && { otp })
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP'
    });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password } = value;

    // Check if user exists
    let user;
    if (isDbConnected()) {
      user = await User.findOne({ email, isVerified: true });
    } else {
      user = await mockDb.findUserByEmail(email);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id || user.id,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    );

    // Prepare response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
