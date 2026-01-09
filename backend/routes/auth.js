import express from 'express';
import User from '../models/User.js';
import { verifyPassword, createAccessToken } from '../utils/security.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ detail: 'Email and password are required' });
    }

    const user = await User.findOne({ email: username.toLowerCase() });

    if (!user) {
      return res.status(400).json({ detail: 'Incorrect email or password' });
    }

    if (!user.is_active) {
      return res.status(400).json({ detail: 'User account is inactive' });
    }

    const isValidPassword = await verifyPassword(password, user.hashed_password);

    if (!isValidPassword) {
      return res.status(400).json({ detail: 'Incorrect email or password' });
    }

    if (!user.is_admin) {
      return res.status(403).json({ detail: 'Access denied. Admin privileges required.' });
    }

    const token = createAccessToken(user.email);

    res.json({
      access_token: token,
      token_type: 'bearer',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

export default router;
