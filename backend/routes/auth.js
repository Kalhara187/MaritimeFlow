const router     = require('express').Router()
const bcrypt     = require('bcryptjs')
const jwt        = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const db         = require('../config/db')

// ── Nodemailer transporter ────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST   || 'smtp.gmail.com',
  port:   Number(process.env.EMAIL_PORT)   || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

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
    const allowedRoles = ['viewer', 'operator']
    const assignedRole = allowedRoles.includes(role) ? role : 'viewer'
    const [result] = await db.query(
      'INSERT INTO users (name, email, username, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, username, hash, assignedRole]
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
      process.env.JWT_SECRET,
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

// POST /api/auth/forgot-password
// Returns a short-lived reset token. In production this token would be emailed;
// here it is returned directly so the frontend can display it (dev mode).
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body
  if (!email)
    return res.status(400).json({ message: 'Email is required.' })

  try {
    const [rows] = await db.query('SELECT id, password FROM users WHERE email = ?', [email])
    if (rows.length === 0)
      return res.status(404).json({ message: 'No account found with that email address.' })

    const user = rows[0]
    // sig = last 8 chars of current hash — token is invalidated the moment the password changes
    const sig = user.password.slice(-8)
    const resetToken = jwt.sign(
      { id: user.id, purpose: 'reset', sig },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const resetLink   = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`

    await transporter.sendMail({
      from:    process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to:      email,
      subject: 'MaritimeFlow — Password Reset Request',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <h2 style="color:#0B3D91">Reset Your Password</h2>
          <p>We received a request to reset the password for your MaritimeFlow account.</p>
          <p>Click the button below to set a new password. This link expires in <strong>15 minutes</strong>.</p>
          <a href="${resetLink}"
             style="display:inline-block;margin:16px 0;padding:12px 24px;
                    background:#0B3D91;color:#fff;border-radius:8px;
                    text-decoration:none;font-weight:600">
            Reset Password
          </a>
          <p style="color:#888;font-size:12px">If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
    })

    res.json({ message: 'A password reset link has been sent to your email address.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body
  if (!token || !password)
    return res.status(400).json({ message: 'Token and new password are required.' })

  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters.' })

  try {
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      return res.status(400).json({ message: 'Reset link is invalid or has expired. Please request a new one.' })
    }

    if (decoded.purpose !== 'reset')
      return res.status(400).json({ message: 'Invalid reset token.' })

    const [rows] = await db.query('SELECT id, password FROM users WHERE id = ?', [decoded.id])
    if (rows.length === 0)
      return res.status(404).json({ message: 'User not found.' })

    // Verify the password has not already been changed (single-use guarantee)
    if (rows[0].password.slice(-8) !== decoded.sig)
      return res.status(400).json({ message: 'This reset link has already been used. Please request a new one.' })

    const hash = await bcrypt.hash(password, 10)
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hash, decoded.id])

    res.json({ message: 'Password updated successfully. You can now log in with your new password.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
