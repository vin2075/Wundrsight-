const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret';

function sign(user) {
  const payload = { id: user.id, role: user.role, email: user.email };
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

function verify(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { sign, verify };
