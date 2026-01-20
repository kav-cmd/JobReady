/**
 * Authentication Middleware
 * Verifies JWT token and attaches user data to request
 */

import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log('[Auth Middleware] Authorization header:', authHeader ? 'Present' : 'Missing');
    
    const token = authHeader?.split(' ')[1]; // Bearer <token>

    if (!token) {
      console.error('[Auth Middleware] No token provided');
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    console.log('[Auth Middleware] Token decoded successfully:', { id: decoded.id, role: decoded.role });
    
    // Attach user data to request (ensure _id and id are both available)
    req.user = {
      ...decoded,
      _id: decoded.id || decoded._id,
      id: decoded.id || decoded._id,
    };
    next();
  } catch (error) {
    console.error('[Auth Middleware] Token verification failed:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authorization failed',
    });
  }
};
