const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Try again in 15 minutes.' }
});

function sameText(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

router.post('/login', loginLimiter, async (req, res) => {
  const { username = '', password = '' } = req.body || {};

  const userOk = sameText(username, process.env.ADMIN_USERNAME || '');
  const passOk = await bcrypt.compare(String(password), process.env.ADMIN_PASSWORD_HASH || '');

  if (!userOk || !passOk) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h'
  });

  res.json({ token });
});

module.exports = router;
