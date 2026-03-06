const router  = require('express').Router()
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const db      = require('../config/db')

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, username, password, role } = req.body

  if (!name || !email || !username || !password)
    return res.status(400).json({ message: 'name, email, username, and password are required.' })

  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters.' })

  try {
    // Check for existing email
    const [byEmail] = await db.query('SELECT id FROM users WHERE email = ?', [email])
    if (byEmail.length > 0)
      return res.status(409).json({ message: 'Email already registered.' })

    // Check for existing username
    const [byUsername] = await db.query('SELECT id FROM users WHERE username = ?', [username])
    if (byUsername.length > 0)
      return res.status(409).json({ message: 'Username already taken.' })

    const hash = await bcrypt.hash(password, 10)
    const [result] = await db.query(
      'INSERT INTO users (name, email, username, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, username, hash, role || 'viewer']
    )
    res.status(201).json({ message: 'User registered successfully.', userId: result.insertId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' })

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
    if (rows.length === 0)
      return res.status(401).json({ message: 'No account found with that email address.' })

    const user  = rows[0]
    const match = await bcrypt.compare(password, user.password)
    if (!match)
      return res.status(401).json({ message: 'Incorrect password. Please try again.' })

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, username: user.username, role: user.role }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
