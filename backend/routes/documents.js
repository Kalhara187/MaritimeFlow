const router = require('express').Router()
const db     = require('../config/db')
const auth   = require('../middleware/auth')

// GET /api/documents
router.get('/', auth(), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT d.*, u.name AS uploaded_by_name, s.tracking_number
       FROM documents d
       LEFT JOIN users     u ON u.id = d.uploaded_by
       LEFT JOIN shipments s ON s.id = d.shipment_id
       ORDER BY d.uploaded_at DESC`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/documents/:id
router.get('/:id', auth(), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT d.*, u.name AS uploaded_by_name, s.tracking_number
       FROM documents d
       LEFT JOIN users     u ON u.id = d.uploaded_by
       LEFT JOIN shipments s ON s.id = d.shipment_id
       WHERE d.id = ?`,
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ message: 'Document not found.' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/documents
router.post('/', auth(['admin', 'operator']), async (req, res) => {
  const { shipment_id, doc_type, file_name, file_path } = req.body
  if (!doc_type || !file_name)
    return res.status(400).json({ message: 'doc_type and file_name are required.' })

  try {
    const [result] = await db.query(
      `INSERT INTO documents (shipment_id, uploaded_by, doc_type, file_name, file_path)
       VALUES (?, ?, ?, ?, ?)`,
      [shipment_id || null, req.user.id, doc_type, file_name, file_path || '']
    )
    res.status(201).json({ message: 'Document saved.', documentId: result.insertId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/documents/:id
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await db.query('DELETE FROM documents WHERE id = ?', [req.params.id])
    res.json({ message: 'Document deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
