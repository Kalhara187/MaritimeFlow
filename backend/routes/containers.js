const router = require('express').Router()
const db     = require('../config/db')
const auth   = require('../middleware/auth')

// GET /api/containers
router.get('/', auth(), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, s.tracking_number
       FROM containers c
       LEFT JOIN shipments s ON s.id = c.shipment_id
       ORDER BY c.created_at DESC`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/containers/:id
router.get('/:id', auth(), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, s.tracking_number
       FROM containers c
       LEFT JOIN shipments s ON s.id = c.shipment_id
       WHERE c.id = ?`,
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ message: 'Container not found.' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/containers
router.post('/', auth(['admin', 'operator']), async (req, res) => {
  const { container_number, shipment_id, type, weight_kg, status } = req.body
  if (!container_number)
    return res.status(400).json({ message: 'container_number is required.' })

  try {
    const [result] = await db.query(
      `INSERT INTO containers (container_number, shipment_id, type, weight_kg, status)
       VALUES (?, ?, ?, ?, ?)`,
      [container_number, shipment_id || null, type || '20ft', weight_kg || null, status || 'empty']
    )
    res.status(201).json({ message: 'Container created.', containerId: result.insertId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/containers/:id
router.put('/:id', auth(['admin', 'operator']), async (req, res) => {
  const { shipment_id, type, weight_kg, status } = req.body
  try {
    await db.query(
      `UPDATE containers SET shipment_id=?, type=?, weight_kg=?, status=? WHERE id=?`,
      [shipment_id || null, type, weight_kg || null, status, req.params.id]
    )
    res.json({ message: 'Container updated.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/containers/:id
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await db.query('DELETE FROM containers WHERE id = ?', [req.params.id])
    res.json({ message: 'Container deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
