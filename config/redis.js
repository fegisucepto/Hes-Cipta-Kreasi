require('dotenv').config()

module.exports = {
  port: process.env.REDIS_PORT || '6381',
  host: process.env.REDIS_HOST || 'localhost',
  password: process.env.REDIS_PASSWORD || undefined,
}
