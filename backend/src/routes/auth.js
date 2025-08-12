const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { sign } = require('../utils/jwt');

const prisma = new PrismaClient();
const router = express.Router();

// POST /api/register
router.post('/register', [
  body('name').isLength({min:1}),
  body('email').isEmail(),
  body('password').isLength({min:6})
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: { code: 'INVALID_INPUT', message: errors.array() }});
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash: hash, role: 'patient' }
    });
    return res.status(201).json({ id: user.id, email: user.email });
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: 'Email already used' }});
    }
    console.error('Register error:', e);
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Internal error' }});
  }
});

// POST /api/login
router.post('/login', [
  body('email').isEmail(),
  body('password').isString()
], async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email }});
    if (!user) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Bad credentials' }});
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Bad credentials' }});
    const token = sign(user);
    res.json({ token, role: user.role });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Internal error' }});
  }
});

module.exports = router;
