const router = require('express').Router()
const db     = require('../config/db')
const auth   = require('../middleware/auth')
const { isValidShipmentStatus, validateRequiredFields, sanitizeString } = require('../utils/validation')

// GET /api/shipments (with search and filter)
router.get('/', auth(), async (req, res) => {
  try {
    const { search, status, origin, destination, page = 1, limit = 20 } = req.query

    let query = `
      SELECT s.*, u.name AS created_by_name
      FROM shipments s
      LEFT JOIN users u ON u.id = s.created_by
      WHERE 1=1
    `
    const params = []

    // Search by tracking number or vessel name
    if (search) {
      query += ` AND (s.tracking_number LIKE ? OR s.vessel_name LIKE ?)`
      const searchTerm = `%${sanitizeString(search)}%`
      params.push(searchTerm, searchTerm)
    }

    // Filter by status
    if (status && isValidShipmentStatus(status)) {
      query += ` AND s.status = ?`
      params.push(status)
    }

    // Filter by origin
    if (origin) {
      query += ` AND s.origin LIKE ?`
      params.push(`%${sanitizeString(origin)}%`)
    }

    // Filter by destination
    if (destination) {
      query += ` AND s.destination LIKE ?`
      params.push(`%${sanitizeString(destination)}%`)
    }

    // Count total results
    const countQuery = query.replace(/SELECT s\.\*, u\.name AS created_by_name/, 'SELECT COUNT(*) as total')
    const [countResult] = await db.query(countQuery, params)
    const total = countResult[0].total

    // Add ordering and pagination
    query += ` ORDER BY s.created_at DESC LIMIT ? OFFSET ?`
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)))
    const offset = (pageNum - 1) * limitNum

    params.push(limitNum, offset)

    const [rows] = await db.query(query, params)

    res.json({
      data: rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
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

    // Get associated containers
    const [containers] = await db.query(
      'SELECT * FROM containers WHERE shipment_id = ? ORDER BY created_at DESC',
      [req.params.id]
    )

    // Get associated documents
    const [documents] = await db.query(
      'SELECT * FROM documents WHERE shipment_id = ? ORDER BY uploaded_at DESC',
      [req.params.id]
    )

    res.json({
      ...rows[0],
      containers,
      documents,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/shipments
router.post('/', auth(['admin', 'operator']), async (req, res) => {
  const { tracking_number, vessel_name, origin, destination, status, estimated_arrival } = req.body

  // Validation
  const validation = validateRequiredFields(req.body, ['tracking_number', 'origin', 'destination'])
  if (!validation.valid) return res.status(400).json({ message: validation.message })

  if (status && !isValidShipmentStatus(status)) {
    return res.status(400).json({ message: 'Invalid shipment status.' })
  }

  try {
    const [result] = await db.query(
      `INSERT INTO shipments (tracking_number, vessel_name, origin, destination, status, estimated_arrival, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        sanitizeString(tracking_number),
        sanitizeString(vessel_name) || null,
        sanitizeString(origin),
        sanitizeString(destination),
        status || 'pending',
        estimated_arrival || null,
        req.user.id,
      ]
    )
    res.status(201).json({ message: 'Shipment created.', shipmentId: result.insertId })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Tracking number already exists.' })
    }
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/shipments/:id
router.put('/:id', auth(['admin', 'operator']), async (req, res) => {
  const { vessel_name, origin, destination, status, estimated_arrival, actual_arrival } = req.body

  if (status && !isValidShipmentStatus(status)) {
    return res.status(400).json({ message: 'Invalid shipment status.' })
  }

  try {
    // Verify shipment exists
    const [check] = await db.query('SELECT id FROM shipments WHERE id = ?', [req.params.id])
    if (!check.length) return res.status(404).json({ message: 'Shipment not found.' })

    await db.query(
      `UPDATE shipments
       SET vessel_name=?, origin=?, destination=?, status=?, estimated_arrival=?, actual_arrival=?
       WHERE id=?`,
      [
        sanitizeString(vessel_name) || null,
        sanitizeString(origin),
        sanitizeString(destination),
        status,
        estimated_arrival || null,
        actual_arrival || null,
        req.params.id,
      ]
    )
    res.json({ message: 'Shipment updated.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/shipments/:id
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const [check] = await db.query('SELECT id FROM shipments WHERE id = ?', [req.params.id])
    if (!check.length) return res.status(404).json({ message: 'Shipment not found.' })

    await db.query('DELETE FROM shipments WHERE id = ?', [req.params.id])
    res.json({ message: 'Shipment deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
