const router = require('express').Router()
const db     = require('../config/db')
const auth   = require('../middleware/auth')
const { isValidContainerStatus, validateRequiredFields, sanitizeString } = require('../utils/validation')

// GET /api/containers (with filtering/pagination)
router.get('/', auth(), async (req, res) => {
  try {
    const { status, shipment_id, page = 1, limit = 20 } = req.query

    let query = `
      SELECT c.*, s.tracking_number
      FROM containers c
      LEFT JOIN shipments s ON s.id = c.shipment_id
      WHERE 1=1
    `
    const params = []

    // Filter by status
    if (status && isValidContainerStatus(status)) {
      query += ` AND c.status = ?`
      params.push(status)
    }

    // Filter by shipment_id
    if (shipment_id) {
      query += ` AND c.shipment_id = ?`
      params.push(shipment_id)
    }

    // Count total
    const countQuery = query.replace(/SELECT c\.\*, s\.tracking_number/, 'SELECT COUNT(*) as total')
    const [countResult] = await db.query(countQuery, params)
    const total = countResult[0].total

    // Add pagination
    query += ` ORDER BY c.created_at DESC LIMIT ? OFFSET ?`
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

    // Get container history
    const [history] = await db.query(
      `SELECT ch.*, u.name AS changed_by_name
       FROM container_history ch
       LEFT JOIN users u ON u.id = ch.changed_by
       WHERE ch.container_id = ?
       ORDER BY ch.changed_at DESC`,
      [req.params.id]
    )

    res.json({
      ...rows[0],
      history,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/containers
router.post('/', auth(['admin', 'operator']), async (req, res) => {
  const { container_number, shipment_id, type, weight_kg, status } = req.body

  const validation = validateRequiredFields(req.body, ['container_number'])
  if (!validation.valid) return res.status(400).json({ message: validation.message })

  if (status && !isValidContainerStatus(status)) {
    return res.status(400).json({ message: 'Invalid container status.' })
  }

  try {
    const [result] = await db.query(
      `INSERT INTO containers (container_number, shipment_id, type, weight_kg, status)
       VALUES (?, ?, ?, ?, ?)`,
      [sanitizeString(container_number), shipment_id || null, type || '20ft', weight_kg || null, status || 'at_port']
    )

    // Log initial status
    await db.query(
      `INSERT INTO container_history (container_id, old_status, new_status, changed_by, change_reason)
       VALUES (?, ?, ?, ?, ?)`,
      [result.insertId, null, status || 'at_port', req.user.id, 'Container created']
    )

    res.status(201).json({ message: 'Container created.', containerId: result.insertId })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Container number already exists.' })
    }
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/containers/:id
router.put('/:id', auth(['admin', 'operator']), async (req, res) => {
  const { shipment_id, type, weight_kg, status, change_reason } = req.body

  if (status && !isValidContainerStatus(status)) {
    return res.status(400).json({ message: 'Invalid container status.' })
  }

  try {
    // Get current container to check for status change
    const [currentContainer] = await db.query('SELECT status FROM containers WHERE id = ?', [req.params.id])
    if (!currentContainer.length) return res.status(404).json({ message: 'Container not found.' })

    const oldStatus = currentContainer[0].status
    const newStatus = status || oldStatus

    // Update container
    await db.query(
      `UPDATE containers SET shipment_id=?, type=?, weight_kg=?, status=? WHERE id=?`,
      [shipment_id || null, type, weight_kg || null, newStatus, req.params.id]
    )

    // Log status change if status changed
    if (oldStatus !== newStatus) {
      await db.query(
        `INSERT INTO container_history (container_id, old_status, new_status, changed_by, change_reason)
         VALUES (?, ?, ?, ?, ?)`,
        [req.params.id, oldStatus, newStatus, req.user.id, change_reason || null]
      )
    }

    res.json({ message: 'Container updated.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/containers/:id
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const [check] = await db.query('SELECT id FROM containers WHERE id = ?', [req.params.id])
    if (!check.length) return res.status(404).json({ message: 'Container not found.' })

    await db.query('DELETE FROM containers WHERE id = ?', [req.params.id])
    res.json({ message: 'Container deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
