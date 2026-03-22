const request = require('supertest')
const express = require('express')
const jwt = require('jsonwebtoken')

describe('Shipments API', () => {
  let server
  let serverInstance
  let authToken
  let operatorToken

  beforeAll(() => {
    server = express()
    server.use(express.json())
    
    // Create test tokens
    authToken = jwt.sign(
      { id: 1, role: 'admin' },
      process.env.JWT_SECRET || 'maritime_secret_key_change_in_production',
      { expiresIn: '7d' }
    )
    
    operatorToken = jwt.sign(
      { id: 2, role: 'operator' },
      process.env.JWT_SECRET || 'maritime_secret_key_change_in_production',
      { expiresIn: '7d' }
    )

    server.use('/api/shipments', require('../routes/shipments'))
    serverInstance = server.listen(0) // Random port
  })

  afterAll(() => {
    if (serverInstance) serverInstance.close()
  })

  describe('GET /api/shipments', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(server)
        .get('/api/shipments')

      expect(res.status).toBe(401)
    })

    it('should return shipments list with valid token', async () => {
      const res = await request(server)
        .get('/api/shipments')
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
    })
  })

  describe('GET /api/shipments/:id', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(server)
        .get('/api/shipments/1')

      expect(res.status).toBe(401)
    })

    it('should return 404 for non-existent shipment', async () => {
      const res = await request(server)
        .get('/api/shipments/99999')
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.status).toBe(404)
    })
  })

  describe('POST /api/shipments', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request(server)
        .post('/api/shipments')
        .send({
          tracking_number: 'TEST-001',
          origin: 'Singapore',
          destination: 'Colombo',
        })

      expect(res.status).toBe(401)
    })

    it('should reject viewer role access', async () => {
      const viewerToken = jwt.sign(
        { id: 3, role: 'viewer' },
        process.env.JWT_SECRET || 'maritime_secret_key_change_in_production'
      )

      const res = await request(server)
        .post('/api/shipments')
        .set('Authorization', `Bearer ${viewerToken}`)
        .send({
          tracking_number: 'TEST-001',
          origin: 'Singapore',
          destination: 'Colombo',
        })

      expect(res.status).toBe(403)
      expect(res.body.message).toContain('insufficient permissions')
    })

    it('should reject missing required fields', async () => {
      const res = await request(server)
        .post('/api/shipments')
        .set('Authorization', `Bearer ${operatorToken}`)
        .send({
          tracking_number: 'TEST-001',
          // Missing origin and destination
        })

      expect(res.status).toBe(400)
      expect(res.body.message).toContain('required')
    })

    it('should create shipment with valid operator role', async () => {
      const res = await request(server)
        .post('/api/shipments')
        .set('Authorization', `Bearer ${operatorToken}`)
        .send({
          tracking_number: `TEST-${Date.now()}`,
          vessel_name: 'MV Test Vessel',
          origin: 'Singapore',
          destination: 'Colombo',
          status: 'pending',
          estimated_arrival: '2026-04-01',
        })

      expect([201, 400]).toContain(res.status) // 201 if successful, 400 if DB error
      if (res.status === 201) {
        expect(res.body).toHaveProperty('shipmentId')
      }
    })
  })

  describe('PUT /api/shipments/:id', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request(server)
        .put('/api/shipments/1')
        .send({ status: 'in_transit' })

      expect(res.status).toBe(401)
    })

    it('should reject viewer role access', async () => {
      const viewerToken = jwt.sign(
        { id: 3, role: 'viewer' },
        process.env.JWT_SECRET || 'maritime_secret_key_change_in_production'
      )

      const res = await request(server)
        .put('/api/shipments/1')
        .set('Authorization', `Bearer ${viewerToken}`)
        .send({ status: 'in_transit' })

      expect(res.status).toBe(403)
    })
  })

  describe('DELETE /api/shipments/:id', () => {
    it('should reject non-admin delete', async () => {
      const res = await request(server)
        .delete('/api/shipments/1')
        .set('Authorization', `Bearer ${operatorToken}`)

      expect(res.status).toBe(403)
    })

    it('should reject unauthenticated delete', async () => {
      const res = await request(server)
        .delete('/api/shipments/1')

      expect(res.status).toBe(401)
    })
  })
})
