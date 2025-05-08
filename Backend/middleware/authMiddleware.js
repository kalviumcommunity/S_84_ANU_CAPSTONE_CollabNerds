import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const SECRETKey = "SeCrEt_KeY";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token');

    const decoded = jwt.verify(token, SECRETKey);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) throw new Error('User not found');

    req.user = user;
    next();
  } catch (err) {
    console.error('❌ Authorization Error:', err.message);
    res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};
