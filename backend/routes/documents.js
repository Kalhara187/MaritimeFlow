const router = require('express').Router()
const path   = require('path')
const multer = require('multer')
const db     = require('../config/db')
const auth   = require('../middleware/auth')

// ── Multer config ──────────────────────────────────────────
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, `${Date.now()}_${safeName}`)
  },
})
const ALLOWED_MIME = [
  'application/pdf',
  'image/jpeg', 'image/png', 'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
]
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) cb(null, true)
    else cb(new Error('File type not allowed.'))
  },
})

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

// POST /api/documents  (supports optional multipart file upload)
router.post('/', auth(['admin', 'operator']), upload.single('file'), async (req, res) => {
  const { shipment_id, doc_type, file_name, file_path } = req.body
  if (!doc_type || !file_name)
    return res.status(400).json({ message: 'doc_type and file_name are required.' })

  // If a file was uploaded, use its server path; otherwise fall back to the text value
  const resolvedPath = req.file ? `/uploads/${req.file.filename}` : (file_path || '')

  try {
    const [result] = await db.query(
      `INSERT INTO documents (shipment_id, uploaded_by, doc_type, file_name, file_path)
       VALUES (?, ?, ?, ?, ?)`,
      [shipment_id || null, req.user.id, doc_type, file_name, resolvedPath]
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
