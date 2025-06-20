const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRETKey = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      console.log('🔐 Authenticated user:', req.user?.email); // Add this
      next();
    } catch (error) {
      console.error('❌ Token error:', error);
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};


module.exports = { protect };
