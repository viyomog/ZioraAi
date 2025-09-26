const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'zioraai_jwt_secret');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Check for professional or enterprise user
const premiumAuth = (req, res, next) => {
  if (req.user.role !== 'professional' && req.user.role !== 'enterprise') {
    return res.status(403).json({ message: 'Access denied. Professional or Enterprise subscription required.' });
  }
  next();
};

// Check for enterprise user only
const enterpriseAuth = (req, res, next) => {
  if (req.user.role !== 'enterprise') {
    return res.status(403).json({ message: 'Access denied. Enterprise subscription required.' });
  }
  next();
};

module.exports = { auth, premiumAuth, enterpriseAuth };