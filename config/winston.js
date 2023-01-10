require('dotenv').config()
const winston = require('winston')

require('winston-mongodb')

const options = {
  file: {
    level: 'info',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
  mongo: {
    level: 'error',
    collection: process.env.LOG_COLLECTION,
    db: `mongodb://${process.env.LOG_USER}:${process.env.LOG_PASSWORD}@${process.env.LOG_MONGODB}?authSource=${process.env.LOG_AUTHSRC}`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
}

const loggerOptions = {
  format: winston.format.combine(
    // winston.format.colorize(),
    winston.format.json(),
    // myFormat,
    winston.format.metadata(),
  ),
  transports: [
    // new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
  metadata: true,
}

if (process.env.LOG_MONGODB) {
  loggerOptions.transports.push(
    new winston.transports.MongoDB(options.mongo),
  )
}

const logger = winston.createLogger(loggerOptions)

logger.stream = {
  write(message) {
    const log = JSON.parse(message)
    const { code } = log
    if (code === '500') {
      logger.error(message, log)
    } else {
      logger.info(message, log)
    }
  },
}

exports.winstonLogger = logger
