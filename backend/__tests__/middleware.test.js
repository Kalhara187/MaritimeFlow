const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

describe('Authentication Middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      headers: {},
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  describe('auth()', () => {
    it('should call next() with valid token', () => {
      const token = jwt.sign(
        { id: 1, role: 'admin' },
        process.env.JWT_SECRET || 'maritime_secret_key_change_in_production'
      )
      req.headers.authorization = `Bearer ${token}`

      const middleware = auth()
      middleware(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(req.user).toBeDefined()
      expect(req.user.id).toBe(1)
      expect(res.status).not.toHaveBeenCalled()
    })

    it('should reject request without token', () => {
      const middleware = auth()
      middleware(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it('should reject request with invalid token', () => {
      req.headers.authorization = 'Bearer invalid_token'

      const middleware = auth()
      middleware(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it('should reject request with wrong role', () => {
      const token = jwt.sign(
        { id: 1, role: 'viewer' },
        process.env.JWT_SECRET || 'maritime_secret_key_change_in_production'
      )
      req.headers.authorization = `Bearer ${token}`

      const middleware = auth(['admin', 'operator'])
      middleware(req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('insufficient permissions')
      }))
      expect(next).not.toHaveBeenCalled()
    })

    it('should allow correct role', () => {
      const token = jwt.sign(
        { id: 1, role: 'admin' },
        process.env.JWT_SECRET || 'maritime_secret_key_change_in_production'
      )
      req.headers.authorization = `Bearer ${token}`

      const middleware = auth(['admin', 'operator'])
      middleware(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(req.user).toBeDefined()
      expect(req.user.role).toBe('admin')
      expect(res.status).not.toHaveBeenCalled()
    })
  })
})
