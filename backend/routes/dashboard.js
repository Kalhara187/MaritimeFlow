/**
 * Dashboard Statistics Routes
 */

const router = require('express').Router()
const db = require('../config/db')
const auth = require('../middleware/auth')

// GET /api/dashboard/stats - Overview statistics
router.get('/stats', auth(), async (req, res) => {
  try {
    // Shipment statistics
    const [shipmentStats] = await db.query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'in_transit' THEN 1 ELSE 0 END) as in_transit,
        SUM(CASE WHEN status = 'arrived' THEN 1 ELSE 0 END) as arrived,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM shipments
    `)

    // Container statistics
    const [containerStats] = await db.query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'at_sea' THEN 1 ELSE 0 END) as at_sea,
        SUM(CASE WHEN status = 'at_port' THEN 1 ELSE 0 END) as at_port,
        SUM(CASE WHEN status = 'under_inspection' THEN 1 ELSE 0 END) as under_inspection,
        SUM(CASE WHEN status = 'cleared' THEN 1 ELSE 0 END) as cleared,
        SUM(CASE WHEN status = 'released' THEN 1 ELSE 0 END) as released
      FROM containers
    `)

    // Document count
    const [docCount] = await db.query('SELECT COUNT(*) as total FROM documents')

    // User count
    const [userCount] = await db.query('SELECT COUNT(*) as total FROM users')

    // Recent shipments (last 5)
    const [recentShipments] = await db.query(`
      SELECT id, tracking_number, vessel_name, status, estimated_arrival, created_at
      FROM shipments
      ORDER BY created_at DESC
      LIMIT 5
    `)

    res.json({
      shipments: shipmentStats[0],
      containers: containerStats[0],
      documents: docCount[0].total,
      users: userCount[0].total,
      recent_shipments: recentShipments,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/dashboard/shipment-trends - Shipment trend data
router.get('/shipment-trends', auth(), async (req, res) => {
  try {
    const [trends] = await db.query(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'in_transit' THEN 1 ELSE 0 END) as in_transit,
        SUM(CASE WHEN status = 'arrived' THEN 1 ELSE 0 END) as arrived,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered
      FROM shipments
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `)

    res.json(trends)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/dashboard/container-types - Container type breakdown
router.get('/container-types', auth(), async (req, res) => {
  try {
    const [types] = await db.query(`
      SELECT
        type,
        COUNT(*) as count,
        SUM(weight_kg) as total_weight
      FROM containers
      GROUP BY type
      ORDER BY count DESC
    `)

    res.json(types)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/dashboard/port-activity - Top routes/ports
router.get('/port-activity', auth(), async (req, res) => {
  try {
    const [origins] = await db.query(`
      SELECT origin as port, COUNT(*) as shipments
      FROM shipments
      GROUP BY origin
      ORDER BY shipments DESC
      LIMIT 10
    `)

    const [destinations] = await db.query(`
      SELECT destination as port, COUNT(*) as shipments
      FROM shipments
      GROUP BY destination
      ORDER BY shipments DESC
      LIMIT 10
    `)

    res.json({
      top_origins: origins,
      top_destinations: destinations,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
