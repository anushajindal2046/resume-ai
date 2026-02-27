import { User } from '../models/index.js';
import { verifyToken } from '../config/jwt.js';

/**
 * Optional auth: attach req.user if valid token present; don't fail if missing.
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password').lean();
    req.user = user || null;
  } catch {
    req.user = null;
  }
  next();
}

/**
 * Require auth: 401 if no valid user.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password').lean();
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
}
