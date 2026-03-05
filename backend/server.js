const express = require('express')
const cors    = require('cors')
require('dotenv').config()

// Import database connection (establishes + tests pool on startup)
const db = require('./config/db')

// Import route modules
const authRoutes       = require('./routes/auth')
const userRoutes       = require('./routes/users')
const shipmentRoutes   = require('./routes/shipments')
const containerRoutes  = require('./routes/containers')
const documentRoutes   = require('./routes/documents')
const reportRoutes     = require('./routes/reports')

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',       authRoutes)
app.use('/api/users',      userRoutes)
app.use('/api/shipments',  shipmentRoutes)
app.use('/api/containers', containerRoutes)
app.use('/api/documents',  documentRoutes)
app.use('/api/reports',    reportRoutes)

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
