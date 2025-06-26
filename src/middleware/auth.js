const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate user using JWT
const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }
    const secret = process.env.JWT_SECRET || 'dgdorm_secure_jwt_secret_key_2024';
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

// Middleware to require specific roles
const requireRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Insufficient role' });
  }
  next();
};

// Middleware to require admin role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// Middleware to require owner role
const requireOwner = (req, res, next) => {
  if (!req.user || (req.user.role !== 'owner' && req.user.role !== 'admin')) {
    return res.status(403).json({ success: false, message: 'Owner access required' });
  }
  next();
};

module.exports = {
  protect,
  requireRole,
  requireAdmin,
  requireOwner
};