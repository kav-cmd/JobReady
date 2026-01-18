import User from '../models/user.model.js';
import { sendOtpSchema, verifyOtpSchema, loginSchema } from '../validation/auth.validation.js';
import jwt from 'jsonwebtoken';

// Utility function to generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Utility function to send OTP (simulated - in production, use Twilio or similar)
const sendOTPToPhone = async (phone, otp) => {
  // In production, integrate with Twilio or another SMS service
  console.log(`[SIMULATED SMS] OTP ${otp} sent to ${phone}`);
  // For testing purposes, we log the OTP
  return true;
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
    const existingUser = await User.findOne({ email });
    
    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({
        success: false,
        message: 'Account already exists'
      });
    }

    // Check if phone is already registered and verified
    const existingPhone = await User.findOne({ phone, isVerified: true });
    
    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: 'Phone number already registered'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Send OTP to phone
    await sendOTPToPhone(phone, otp);

    // If user exists but not verified, update their record
    if (existingUser) {
      existingUser.name = name;
      existingUser.password = password;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      existingUser.role = role;
      await existingUser.save();
    } else {
      // Create temporary user record
      const user = new User({
        name,
        email,
        phone,
        password,
        role,
        otp,
        otpExpires,
        isVerified: false
      });
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your phone',
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
    const user = await User.findOne({ email });
    
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
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
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
      message: 'Phone verified successfully. Account created!',
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
    const user = await User.findOne({ email, isVerified: false });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found or already verified'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Send OTP to phone
    await sendOTPToPhone(user.phone, otp);

    // Update user record
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

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
    const user = await User.findOne({ email, isVerified: true });
    
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
        id: user._id,
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
