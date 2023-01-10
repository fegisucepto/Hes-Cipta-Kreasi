/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
require('dotenv').config()

const morgan = require('morgan')
const moment = require('moment')

const logFormat = {
  timestamp: ':timestamp',
  remote: ':remote-addr',
  user: ':remote-user',
  method: ':method',
  path: ':url',
  code: ':status',
  size: ':res[content-length]',
  response: ':res-body',
  agent: ':user-agent',
  responseTime: ':response-time',
  env: ':env',
}

function escapeSpecialChars(string) {
  return string.replace(/[\\]/g, '\\\\')
    .replace(/[\"]/g, '\\\"')
    .replace(/[\/]/g, '\\/')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t')
}

function addCustomToken(selectedMorgan) {
  selectedMorgan.token('timestamp', (req, res) => moment().tz('Asia/Jakarta').toISOString())
  selectedMorgan.token('res-body', (req, res) => (res.locals.message ? escapeSpecialChars(res.locals.message) : res.statusMessage))
  selectedMorgan.token('env', (req, res) => process.env.NODE_ENV)
}

module.exports.logger = (stream) => {
  addCustomToken(morgan)
  return morgan(JSON.stringify(logFormat), stream)
}
