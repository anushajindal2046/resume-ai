import { User } from '../models/index.js';
import { signToken } from '../config/jwt.js';

export async function signup(req, res) {
  const { email, password, name } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }
  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email already registered.' });
    }
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password,
      name: (name || '').trim(),
    });
    const token = signToken({ userId: user._id.toString() });
    const safe = user.toObject();
    delete safe.password;
    return res.status(201).json({ user: safe, token });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || 'Signup failed.' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }
    const token = signToken({ userId: user._id.toString() });
    const safe = user.toObject();
    delete safe.password;
    return res.json({ user: safe, token });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || 'Login failed.' });
  }
}

export async function me(req, res) {
  return res.json({ user: req.user });
}
