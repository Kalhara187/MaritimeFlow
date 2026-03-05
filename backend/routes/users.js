const router = require('express').Router()
const db     = require('../config/db')
const auth   = require('../middleware/auth')

// GET /api/users — list all users (admin only)
router.get('/', auth(['admin']), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
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
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ message: 'User not found.' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/users/:id (admin only)
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id])
    res.json({ message: 'User deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
