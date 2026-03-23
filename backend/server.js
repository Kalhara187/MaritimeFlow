const express = require('express')
const cors    = require('cors')
const path    = require('path')
const helmet  = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

// Import database connection (establishes + tests pool on startup)
const db = require('./config/db')

// Import middleware
const requestLogger = require('./middleware/logger')
const authMiddleware = require('./middleware/auth')

// Import route modules
const authRoutes       = require('./routes/auth')
const userRoutes       = require('./routes/users')
const shipmentRoutes   = require('./routes/shipments')
const containerRoutes  = require('./routes/containers')
const documentRoutes   = require('./routes/documents')
const reportRoutes     = require('./routes/reports')
const contactRoutes    = require('./routes/contact')
const dashboardRoutes  = require('./routes/dashboard')

const app  = express()
const PORT = process.env.PORT || 5000

// ── Security Middleware ─────────────────────────────────────
app.use(helmet())

// ── Rate Limiting ────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger)

// ── Serve uploaded files ─────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',       authRoutes)
app.use('/api/users',      userRoutes)
app.use('/api/shipments',  shipmentRoutes)
app.use('/api/containers', containerRoutes)
app.use('/api/documents',  documentRoutes)
app.use('/api/reports',    reportRoutes)
app.use('/api/contact',    contactRoutes)
app.use('/api/dashboard',  dashboardRoutes)

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── 404 handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// ── Global error handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err)
  res.status(500).json({ message: 'Internal server error', error: err.message })
})

// ── Start server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[Server] MaritimeFlow backend running on http://localhost:${PORT}`)
})
