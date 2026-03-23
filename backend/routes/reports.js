const router = require('express').Router()
const db     = require('../config/db')
const auth   = require('../middleware/auth')
const { generateShipmentReportPDF, generateContainerReportPDF, generateSummaryReportPDF } = require('../utils/pdfGenerator')

// GET /api/reports
router.get('/', auth(), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query

    // Count total
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM reports')
    const total = countResult[0].total

    // Get paginated results
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)))
    const offset = (pageNum - 1) * limitNum

    const [rows] = await db.query(
      `SELECT r.*, u.name AS generated_by_name
       FROM reports r
       LEFT JOIN users u ON u.id = r.generated_by
       ORDER BY r.generated_at DESC
       LIMIT ? OFFSET ?`,
      [limitNum, offset]
    )

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

// POST /api/reports - Generate a report
router.post('/', auth(['admin', 'operator']), async (req, res) => {
  const { title, report_type, shipment_id } = req.body

  if (!title || !report_type) {
    return res.status(400).json({ message: 'title and report_type are required.' })
  }

  try {
    let filePath = null

    // Generate PDF based on report type
    if (report_type === 'shipment_summary' && shipment_id) {
      // Get shipment data with related containers and documents
      const [shipmentData] = await db.query(
        `SELECT s.*, u.name AS created_by_name
         FROM shipments s
         LEFT JOIN users u ON u.id = s.created_by
         WHERE s.id = ?`,
        [shipment_id]
      )

      if (!shipmentData.length) {
        return res.status(404).json({ message: 'Shipment not found.' })
      }

      const [containers] = await db.query(
        'SELECT * FROM containers WHERE shipment_id = ? ORDER BY created_at DESC',
        [shipment_id]
      )

      const [documents] = await db.query(
        'SELECT * FROM documents WHERE shipment_id = ? ORDER BY uploaded_at DESC',
        [shipment_id]
      )

      const shipment = shipmentData[0]
      shipment.containers = containers
      shipment.documents = documents

      filePath = await generateShipmentReportPDF(shipment)
    } else if (report_type === 'container_status') {
      // Get all containers
      const [containers] = await db.query('SELECT * FROM containers ORDER BY created_at DESC')
      filePath = await generateContainerReportPDF(containers)
    } else if (report_type === 'daily_summary') {
      // Generate daily summary
      const [shipmentStats] = await db.query(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'in_transit' THEN 1 ELSE 0 END) as in_transit,
          SUM(CASE WHEN status = 'arrived' THEN 1 ELSE 0 END) as arrived,
          SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered
        FROM shipments
      `)

      const [containerStats] = await db.query(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'at_sea' THEN 1 ELSE 0 END) as at_sea,
          SUM(CASE WHEN status = 'at_port' THEN 1 ELSE 0 END) as at_port,
          SUM(CASE WHEN status = 'cleared' THEN 1 ELSE 0 END) as cleared
        FROM containers
      `)

      const [docCount] = await db.query('SELECT COUNT(*) as total FROM documents')

      const summaryData = {
        shipments_summary: shipmentStats[0],
        containers_summary: containerStats[0],
        documents_count: docCount[0].total,
      }

      filePath = await generateSummaryReportPDF(summaryData)
    } else {
      // If no PDF generation, just create the report record
      filePath = null
    }

    // Save report to database
    const [result] = await db.query(
      `INSERT INTO reports (title, report_type, generated_by, file_path) VALUES (?, ?, ?, ?)`,
      [title, report_type, req.user.id, filePath]
    )

    res.status(201).json({
      message: 'Report generated successfully.',
      reportId: result.insertId,
      file_path: filePath,
    })
  } catch (err) {
    console.error('[Reports] Error generating report:', err)
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/reports/:id
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const [check] = await db.query('SELECT id FROM reports WHERE id = ?', [req.params.id])
    if (!check.length) return res.status(404).json({ message: 'Report not found.' })

    await db.query('DELETE FROM reports WHERE id = ?', [req.params.id])
    res.json({ message: 'Report deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
