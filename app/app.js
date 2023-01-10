import express from 'express'
import zip from 'express-easy-zip'
import path from 'path'
import cookieParser from 'cookie-parser'
import i18n from 'i18n'
import cors from 'cors'
import expressSwaggerModule from 'express-swagger-generator'
import indexRouter from './routes/index'
import configSwagger from '../config/swagger'
import { logger } from '../config/logger'
import { winstonLogger } from '../config/winston'

const corsOptions = {
  origin: '*',
  exposedHeaders: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

i18n.configure({
  defaultLocale: 'id',
  locales: ['en', 'id'],
  directory: path.join(__dirname, '../lang'),
  autoReload: true,
  updateFiles: false,
  objectNotation: true,
  api: {
    __: 't', // now req.__ becomes req.t
    __n: 'tn', // and req.__n can be called as req.tn
  },
})

const app = express()

const expressSwagger = expressSwaggerModule(app)

app.use(i18n.init)
app.use(cors(corsOptions))
app.use(zip())
app.use(logger({ stream: winstonLogger.stream }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

expressSwagger(configSwagger)

app.use('/api/v1', indexRouter)

app.use((req, res) => res.status(404).json({ message: 'Page not found' }))

// app.use(expressWinston.errorLogger(cfgErrorLog))

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  const message = req.app.get('env') === 'production' ? 'Internal server error' : err.message
  res.status(500).json({ message })
})

export default app
