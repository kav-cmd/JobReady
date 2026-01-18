import express from 'express';
import { sendOtp, verifyOtp, resendOtp, login } from '../controllers/auth.controller.js';

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

export default router;
