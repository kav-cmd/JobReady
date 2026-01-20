import express from 'express';
import { sendOtp, verifyOtp, resendOtp, login, getProfile, updateProfile } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * POST /api/auth/send-otp
 * Send OTP to user's phone for registration
 */
router.post('/send-otp', sendOtp);

/**
 * POST /api/auth/verify-otp
 * Verify OTP and create account
 */
router.post('/verify-otp', verifyOtp);

/**
 * POST /api/auth/resend-otp
 * Resend OTP to user's phone
 */
router.post('/resend-otp', resendOtp);

/**
 * POST /api/auth/login
 * Login user and get JWT token
 */
router.post('/login', login);

/**
 * GET /api/auth/profile
 * Get current user profile (requires authentication)
 */
router.get('/profile', verifyToken, getProfile);

/**
 * PUT /api/auth/profile
 * Update current user profile (requires authentication)
 */
router.put('/profile', verifyToken, updateProfile);

export default router;
