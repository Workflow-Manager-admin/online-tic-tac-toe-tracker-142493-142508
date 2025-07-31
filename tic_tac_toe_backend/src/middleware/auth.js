const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware (Express):
 * - Adds req.user if JWT is valid.
 * - Returns 401 if not authorized.
 */

/**
 * PUBLIC_INTERFACE
 * Middleware: Verifies user JWT. Sets req.user.
 */
function authMiddleware(req, res, next) {
  const auth = req.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.substring(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: 'Invalid JWT' });
    req.user = user;
    next();
  });
}

module.exports = authMiddleware;
