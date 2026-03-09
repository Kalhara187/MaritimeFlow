const router = require('express').Router()
const db     = require('../config/db')
const auth   = require('../middleware/auth')

// Basic email format validator (no external dependency needed)
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// GET /api/contact — admin views all submitted contact messages
router.get('/', auth(['admin']), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM contact_messages ORDER BY submitted_date DESC'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/contact/:id — admin deletes a contact message
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await db.query('DELETE FROM contact_messages WHERE message_id = ?', [req.params.id])
    res.json({ message: 'Message deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body

  // --- Validation ---
  if (!name || !email || !subject || !message)
    return res.status(400).json({ message: 'All fields (name, email, subject, message) are required.' })

  if (name.trim().length === 0 || subject.trim().length === 0 || message.trim().length === 0)
    return res.status(400).json({ message: 'Fields must not be blank.' })

  if (!isValidEmail(email))
    return res.status(400).json({ message: 'Please provide a valid email address.' })

  // --- Sanitise lengths to match column definitions ---
  if (name.length > 150)
    return res.status(400).json({ message: 'Name must be 150 characters or fewer.' })

  if (email.length > 150)
    return res.status(400).json({ message: 'Email must be 150 characters or fewer.' })

  if (subject.length > 255)
    return res.status(400).json({ message: 'Subject must be 255 characters or fewer.' })

  try {
    const [result] = await db.query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES (?, ?, ?, ?)`,
      [name.trim(), email.trim().toLowerCase(), subject.trim(), message.trim()]
    )

    res.status(201).json({
      message: 'Your message has been received. We will get back to you within 24 hours.',
      messageId: result.insertId,
    })
  } catch (err) {
    console.error('[Contact] DB error:', err)
    res.status(500).json({ message: 'Failed to submit your message. Please try again later.' })
  }
})

module.exports = router
