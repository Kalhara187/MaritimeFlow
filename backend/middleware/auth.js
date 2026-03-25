const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET || 'maritime_secret_key_change_in_production'

/**
 * Authentication middleware.
 * @param {string[]} roles  Optional list of allowed roles. If omitted, any authenticated user passes.
 */
function auth(roles = []) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token      = authHeader && authHeader.split(' ')[1] // Bearer <token>

    if (!token)
      return res.status(401).json({ message: 'No token provided. Please log in.' })

    try {
      const decoded = jwt.verify(token, jwtSecret)
      req.user = decoded

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions.' })
      }

      next()
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' })
    }
  }
}

module.exports = auth
