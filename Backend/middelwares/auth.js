import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const isAuth = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    let token = req.cookies.access_token;
    
    // If no token in cookies, check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }
    
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized request. Please login.",
        success: false,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN || process.env.JWT_SECRET || 'access_secret');
    
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token. Please login again.",
        success: false,
      });
    }

    // Find user and exclude sensitive fields
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Attach user to request object
    req.user = user;
    next();
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: "Token expired. Please login again.",
        success: false,
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: "Invalid token. Please login again.",
        success: false,
      });
    }

    res.status(500).json({
      message: "Authentication error",
      success: false,
      error: error.message
    });
  }
};

export default isAuth;