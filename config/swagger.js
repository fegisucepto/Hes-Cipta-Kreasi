'use strict'
require('dotenv').config()

const port = process.env.PORT || '8080'
const baseUrl = process.env.APP_URL || 'localhost'
const url = process.env.NODE_ENV === 'production' ? baseUrl : baseUrl + ':' + port

module.exports = {
  swaggerDefinition: {
    info: {
      title: 'API Documentation',
      description: `This is swagger generated api documentation for ${process.env.NODE_ENV} environment`,
      version: '1.0.0',
    },
    host: `${url}`,
    basePath: '/',
    produces: [
      'application/json',
      'application/xml'
    ],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: '',
      }
    }
  },
  basedir: __dirname, //app absolute path
  files: ['../app/routes/*.js'] //Path to the API handle folder
}