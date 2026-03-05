const router = require('express').Router()
const db     = require('../config/db')
const auth   = require('../middleware/auth')

// GET /api/reports
router.get('/', auth(), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, u.name AS generated_by_name
       FROM reports r
       LEFT JOIN users u ON u.id = r.generated_by
       ORDER BY r.generated_at DESC`
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/reports/:id
router.get('/:id', auth(), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, u.name AS generated_by_name
       FROM reports r
       LEFT JOIN users u ON u.id = r.generated_by
       WHERE r.id = ?`,
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ message: 'Report not found.' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/reports
router.post('/', auth(['admin', 'operator']), async (req, res) => {
  const { title, report_type, file_path } = req.body
  if (!title || !report_type)
    return res.status(400).json({ message: 'title and report_type are required.' })

  try {
    const [result] = await db.query(
      `INSERT INTO reports (title, report_type, generated_by, file_path) VALUES (?, ?, ?, ?)`,
      [title, report_type, req.user.id, file_path || null]
    )
    res.status(201).json({ message: 'Report created.', reportId: result.insertId })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/reports/:id
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    await db.query('DELETE FROM reports WHERE id = ?', [req.params.id])
    res.json({ message: 'Report deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
