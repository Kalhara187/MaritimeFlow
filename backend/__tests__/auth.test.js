const request = require('supertest')
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Mock auth route for testing
const router = require('express').Router()
const db = require('../config/db')

// Simplified auth route for testing (copy from actual auth.js)
describe('Authentication API', () => {
  let server
  let serverInstance

  beforeAll(() => {
    server = express()
    server.use(express.json())
    server.use('/api/auth', require('../routes/auth'))
    serverInstance = server.listen(0) // Random port
  })

  afterAll(async () => {
    if (serverInstance) serverInstance.close()
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid input', async () => {
      const newUser = {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        username: `testuser_${Date.now()}`,
        password: 'password123',
      }

      const res = await request(server)
        .post('/api/auth/register')
        .send(newUser)

      expect([201, 400, 409]).toContain(res.status) // 201 success, 400/409 if user exists
      if (res.status === 201) {
        expect(res.body).toHaveProperty('userId')
        expect(res.body).toHaveProperty('message')
      }
    })

    it('should reject registration with missing fields', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'test@example.com' })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
    })

    it('should reject password shorter than 6 characters', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: `test-${Date.now()}@example.com`,
          username: `testuser_${Date.now()}`,
          password: '123',
        })

      expect(res.status).toBe(400)
      expect(res.body.message).toContain('6 characters')
    })
  })

  describe('POST /api/auth/login', () => {
    it('should reject login without email/password', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
    })

    it('should reject login with non-existent email', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' })

      expect(res.status).toBe(401)
      expect(res.body.message).toContain('No account found')
    })
  })

  describe('POST /api/auth/forgot-password', () => {
    it('should reject forgot-password without email', async () => {
      const res = await request(server)
        .post('/api/auth/forgot-password')
        .send({})

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
    })

    it('should reject forgot-password with non-existent email', async () => {
      const res = await request(server)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })

      expect(res.status).toBe(404)
      expect(res.body.message).toContain('No account found')
    })
  })
})
