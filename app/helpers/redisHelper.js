/** @module helpers/redisHelper */

import redis from 'redis'
import { promisify } from 'util'
import { debug } from 'winston'
import dotenv from 'dotenv'

dotenv.config()

const redisClient = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD || undefined,
})

const getAsync = promisify(redisClient.get).bind(redisClient)
const setAsync = promisify(redisClient.set).bind(redisClient)
const expireAsync = promisify(redisClient.expire).bind(redisClient)

redisClient.on('error', (err) => {
  debug(err)
})

export const getClient = redisClient

/**
 * Get key from redis client
 * @param {string} key - key
 * @returns {object} - the body/payload
 */
export async function getKey(key) {
  const cacheValue = await getAsync(key)
  return JSON.parse(cacheValue)
}

/**
 * Set key & message to redis
 * @param {object} param
 * @param {string} param.key - key
 * @param {string} param.ttl - time to live
 * @param {object} param.body - body/payload
 * @returns {any}
 */
export async function setKey({ key, ttl = 600, body }) {
  const stringBody = JSON.stringify(body)
  await setAsync(key, stringBody)
  await expireAsync(key, ttl)
}

/**
 * Delete key from redis
 * @param {string} key - key
 * @returns {any}
 */
export function delKey(key) {
  redisClient.del(key)
}
