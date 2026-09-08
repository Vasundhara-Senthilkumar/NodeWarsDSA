const { verifyToken } = require('../utils/tokens');
const { db, toPublicUser } = require('../db');

function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const payload = verifyToken(token);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = toPublicUser(user);
    req.userRow = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (token) {
      const payload = verifyToken(token);
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.sub);
      if (user) {
        req.user = toPublicUser(user);
        req.userRow = user;
      }
    }
  } catch {
    // ignore
  }
  next();
}

module.exports = { authRequired, optionalAuth };
