const router  = require('express').Router()
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const db      = require('../config/db')

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body
  if (!name || !email || !password)
    return res.status(400).json({ message: 'name, email and password are required.' })

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length > 0)
      return res.status(409).json({ message: 'Email already registered.' })

    const hash = await bcrypt.hash(password, 10)
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hash, role || 'viewer']
    )
    res.status(201).json({ message: 'User registered.', userId: result.insertId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ message: 'email and password are required.' })

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
    if (rows.length === 0)
      return res.status(401).json({ message: 'Invalid credentials.' })

    const user  = rows[0]
    const match = await bcrypt.compare(password, user.password)
    if (!match)
      return res.status(401).json({ message: 'Invalid credentials.' })

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
