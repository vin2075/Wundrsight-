const { verify } = require('../utils/jwt');

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing Authorization header' } });
  }
  const token = header.split(' ')[1];
  try {
    const payload = verify(token);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: { code: 'INVALID_TOKEN', message: 'Invalid token' } });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'No user' } });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Insufficient role' } });
    }
    next();
  };
}

module.exports = { auth, requireRole };
