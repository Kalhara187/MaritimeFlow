const router = require('express').Router()
const db     = require('../config/db')
const auth   = require('../middleware/auth')

// GET /api/shipments
router.get('/', auth(), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.*, u.name AS created_by_name
       FROM shipments s
       LEFT JOIN users u ON u.id = s.created_by
       ORDER BY s.created_at DESC`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/shipments/:id
router.get('/:id', auth(), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.*, u.name AS created_by_name
       FROM shipments s
       LEFT JOIN users u ON u.id = s.created_by
       WHERE s.id = ?`,
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ message: 'Shipment not found.' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/shipments
router.post('/', auth(['admin', 'operator']), async (req, res) => {
  const { tracking_number, origin, destination, status, estimated_arrival } = req.body
  if (!tracking_number || !origin || !destination)
    return res.status(400).json({ message: 'tracking_number, origin and destination are required.' })

  try {
    const [result] = await db.query(
      `INSERT INTO shipments (tracking_number, origin, destination, status, estimated_arrival, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tracking_number, origin, destination, status || 'pending', estimated_arrival || null, req.user.id]
    )
    res.status(201).json({ message: 'Shipment created.', shipmentId: result.insertId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/shipments/:id
router.put('/:id', auth(['admin', 'operator']), async (req, res) => {
  const { origin, destination, status, estimated_arrival, actual_arrival } = req.body
  try {
    await db.query(
      `UPDATE shipments
       SET origin=?, destination=?, status=?, estimated_arrival=?, actual_arrival=?
       WHERE id=?`,
      [origin, destination, status, estimated_arrival || null, actual_arrival || null, req.params.id]
    )
    res.json({ message: 'Shipment updated.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/shipments/:id
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await db.query('DELETE FROM shipments WHERE id = ?', [req.params.id])
    res.json({ message: 'Shipment deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
