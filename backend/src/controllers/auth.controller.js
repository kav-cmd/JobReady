import User from '../models/user.model.js';
import { sendOtpSchema, verifyOtpSchema, loginSchema, registerSchema } from '../validation/auth.validation.js';
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

    // Log OTP for local development (always log, not just in development mode)
    console.log(`[Auth Controller] Generated OTP for ${email}: ${otp}`);
    console.log(`[Auth Controller] NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

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

    const responseData = {
      success: true,
      message: 'OTP sent successfully to your email',
      // For development/testing only - include OTP if not in production
      ...(process.env.NODE_ENV !== 'production' && { otp })
    };
    
    console.log(`[Auth Controller] Sending response with OTP included: ${!!responseData.otp}`);
    
    res.status(200).json(responseData);
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

    // Check if OTP exists
    if (!user.otp) {
      console.log('[Auth Controller] No OTP found for user:', user.email);
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.'
      });
    }

    // Check if OTP has expired
    const otpExpiresDate = user.otpExpires instanceof Date 
      ? user.otpExpires 
      : new Date(user.otpExpires);
    
    if (!user.otpExpires || new Date() > otpExpiresDate) {
      console.log('[Auth Controller] OTP expired:', {
        otpExpires: user.otpExpires,
        now: new Date(),
        expired: new Date() > otpExpiresDate
      });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check if OTP matches (convert both to string for comparison)
    const userOtp = String(user.otp || '').trim();
    const providedOtp = String(otp || '').trim();
    
    console.log('[Auth Controller] OTP comparison:', {
      userOtp,
      providedOtp,
      match: userOtp === providedOtp,
      userEmail: user.email
    });
    
    if (userOtp !== providedOtp) {
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

    // Get user ID (handle both MongoDB ObjectId and string IDs)
    const userId = user._id ? user._id.toString() : (user.id || user._id);
    
    // Generate JWT token
    const token = jwt.sign(
      {
        id: userId,
        role: user.role || 'student'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    );

    // Prepare response - ensure all IDs are strings
    const userResponse = {
      id: userId,
      _id: userId, // Include both for compatibility
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || 'student'
    };

    console.log('[Auth Controller] OTP verified, sending response with token');

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
      // For development/testing only - include OTP if not in production
      ...(process.env.NODE_ENV !== 'production' && { otp })
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP'
    });
  }
};

// Register Controller - Direct registration without OTP
export const register = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, email, phone, password, role } = value;

    // Check if user with email already exists
    let existingUser;
    if (isDbConnected()) {
      existingUser = await User.findOne({ email });
    } else {
      existingUser = await mockDb.findUserByEmail(email);
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Account already exists'
      });
    }

    // Check if phone is already registered
    let existingPhone;
    if (isDbConnected()) {
      existingPhone = await User.findOne({ phone });
    } else {
      existingPhone = await mockDb.findUserByPhone(phone);
    }

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: 'Phone number already registered'
      });
    }

    // Create user record - automatically verified
    const userData = {
      name,
      email,
      phone,
      password,
      role: role || 'student',
      isVerified: true
    };

    let user;
    if (isDbConnected()) {
      user = new User(userData);
      await user.save();
    } else {
      user = await mockDb.saveUser(userData);
    }

    // Get user ID (handle both MongoDB ObjectId and string IDs)
    const userId = user._id ? user._id.toString() : (user.id || user._id);
    
    // Generate JWT token
    const token = jwt.sign(
      {
        id: userId,
        role: user.role || 'student'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    );

    // Prepare response - ensure all IDs are strings
    const userResponse = {
      id: userId,
      _id: userId, // Include both for compatibility
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || 'student'
    };

    console.log('[Auth Controller] User registered and verified automatically:', user.email);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create account'
    });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    console.log('[Auth Controller] Login attempt:', { body: req.body });
    
    // Validate request body
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      console.error('[Auth Controller] Validation error:', error.details[0].message);
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
      console.log('[Auth Controller] MongoDB user found:', user ? 'Yes' : 'No');
    } else {
      user = await mockDb.findUserByEmail(email);
      console.log('[Auth Controller] Mock DB user found:', user ? 'Yes' : 'No');
      
      // For mock DB, also check isVerified
      if (user && !user.isVerified) {
        console.log('[Auth Controller] User not verified in mock DB');
        user = null;
      }
    }

    if (!user) {
      console.log('[Auth Controller] User not found or not verified');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isPasswordMatch = await user.comparePassword(password);
    console.log('[Auth Controller] Password match:', isPasswordMatch);

    if (!isPasswordMatch) {
      console.log('[Auth Controller] Password mismatch');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Get user ID (handle both MongoDB ObjectId and string IDs)
    const userId = user._id ? user._id.toString() : (user.id || user._id);
    
    if (!userId) {
      console.error('[Auth Controller] No user ID found');
      return res.status(500).json({
        success: false,
        message: 'User ID not found'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: userId,
        role: user.role || 'student'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    );

    console.log('[Auth Controller] Token generated successfully for user:', userId);

    // Prepare response - ensure all IDs are strings
    const userResponse = {
      id: userId,
      _id: userId, // Include both for compatibility
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || 'student'
    };

    console.log('[Auth Controller] Login successful, sending response');
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('[Auth Controller] Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    console.log('[Auth Controller] Fetching profile for user:', userId);

    let user;
    if (isDbConnected()) {
      user = await User.findById(userId).select('-password -otp -otpExpires');
    } else {
      user = await mockDb.findUserById(userId);
      if (user) {
        // Remove sensitive data
        delete user.password;
        delete user.otp;
        delete user.otpExpires;
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Ensure ID is string
    const userResponse = {
      id: user._id ? user._id.toString() : (user.id || user._id),
      _id: user._id ? user._id.toString() : (user.id || user._id),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || 'student',
      isVerified: user.isVerified || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    console.log('[Auth Controller] Profile fetched successfully');

    res.status(200).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('[Auth Controller] Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { name, phone } = req.body;

    console.log('[Auth Controller] Updating profile for user:', userId, { name, phone });

    let user;
    if (isDbConnected()) {
      user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update fields
      if (name) user.name = name;
      if (phone) {
        // Check if phone is already taken by another user
        const existingPhone = await User.findOne({ phone, _id: { $ne: userId } });
        if (existingPhone) {
          return res.status(409).json({
            success: false,
            message: 'Phone number already registered'
          });
        }
        user.phone = phone;
      }

      await user.save();
    } else {
      user = await mockDb.findUserById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (name) user.name = name;
      if (phone) {
        const existingPhone = await mockDb.findUserByPhone(phone);
        if (existingPhone && existingPhone._id !== userId && existingPhone.id !== userId) {
          return res.status(409).json({
            success: false,
            message: 'Phone number already registered'
          });
        }
        user.phone = phone;
      }

      await mockDb.saveUser(user);
    }

    // Prepare response
    const userResponse = {
      id: user._id ? user._id.toString() : (user.id || user._id),
      _id: user._id ? user._id.toString() : (user.id || user._id),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || 'student',
      isVerified: user.isVerified || false
    };

    console.log('[Auth Controller] Profile updated successfully');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('[Auth Controller] Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
