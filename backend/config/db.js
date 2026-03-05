const mysql = require('mysql2/promise')
require('dotenv').config()

/**
 * MySQL connection pool for portsync_lanka database.
 *
 * Config:
 *   Host     : localhost
 *   User     : root
 *   Password : (empty — development only)
 *   Database : portsync_lanka
 *   Port     : 3306
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portsync_lanka',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

/**
 * Test the database connection on startup.
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log(
      `[DB] Connected to MySQL — database: "${process.env.DB_NAME || 'portsync_lanka'}" @ ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`
    )
    connection.release()
  } catch (err) {
    console.error('[DB] Failed to connect to MySQL:', err.message)
    process.exit(1)
  }
}

testConnection()

module.exports = pool
