const router = require('express').Router()
const bcrypt = require('bcryptjs')
const db     = require('../config/db')
const auth   = require('../middleware/auth')

const VALID_ROLES = ['admin', 'operator', 'viewer']

// GET /api/users — list all users (admin only)
router.get('/', auth(['admin']), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, username, role, created_at FROM users ORDER BY created_at DESC'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/users/:id
router.get('/:id', auth(), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, username, role, created_at FROM users WHERE id = ?',
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ message: 'User not found.' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/users — admin creates a user with any role
router.post('/', auth(['admin']), async (req, res) => {
  const { name, email, username, password, role } = req.body
  if (!name || !email || !username || !password)
    return res.status(400).json({ message: 'name, email, username, and password are required.' })
  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters.' })
  if (role && !VALID_ROLES.includes(role))
    return res.status(400).json({ message: 'Invalid role.' })

  try {
    const [byEmail] = await db.query('SELECT id FROM users WHERE email = ?', [email])
    if (byEmail.length) return res.status(409).json({ message: 'Email already registered.' })
    const [byUsername] = await db.query('SELECT id FROM users WHERE username = ?', [username])
    if (byUsername.length) return res.status(409).json({ message: 'Username already taken.' })

    const hash = await bcrypt.hash(password, 10)
    const [result] = await db.query(
      'INSERT INTO users (name, email, username, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, username, hash, role || 'viewer']
    )
    res.status(201).json({ message: 'User created.', userId: result.insertId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/users/:id — admin updates name, email, role
router.put('/:id', auth(['admin']), async (req, res) => {
  const { name, email, role } = req.body
  if (!name || !email || !role)
    return res.status(400).json({ message: 'name, email, and role are required.' })
  if (!VALID_ROLES.includes(role))
    return res.status(400).json({ message: 'Invalid role.' })

  try {
    const [check] = await db.query(
      'SELECT id FROM users WHERE email = ? AND id != ?', [email, req.params.id]
    )
    if (check.length) return res.status(409).json({ message: 'Email already in use by another account.' })

    await db.query(
      'UPDATE users SET name=?, email=?, role=? WHERE id=?',
      [name, email, role, req.params.id]
    )
    res.json({ message: 'User updated.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/users/:id (admin only)
router.delete('/:id', auth(['admin']), async (req, res) => {
  // Prevent admins from deleting their own account
  if (parseInt(req.params.id) === req.user.id)
    return res.status(400).json({ message: 'You cannot delete your own account.' })

  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id])
    res.json({ message: 'User deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
