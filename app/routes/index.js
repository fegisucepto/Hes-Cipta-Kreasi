import express from 'express'
import { isAuthenticate } from '../middlewares/authMiddleware'

import usersRouter from './userRouter'
import authRouter from './authRouter'
import roleRouter from './roleRouter'
import salesOfficeRouter from './salesOfficeRouter'
import storageLocationRouter from './storageLocationRouter'
import regionRouter from './regionRouter'
import salesOrganizationRouter from './salesOrganizationRouter'
import permissionRouter from './permissionRouter'

const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => {
  res.json({ message: 'Starterkit API' })
})

router.use('/auth', authRouter)
router.use('/role', isAuthenticate, roleRouter)
router.use('/user', isAuthenticate, usersRouter)
router.use('/sales-office', isAuthenticate, salesOfficeRouter)
router.use('/storage-location', isAuthenticate, storageLocationRouter)
router.use('/region', isAuthenticate, regionRouter)
router.use('/sales-organization', isAuthenticate, salesOrganizationRouter)
router.use('/permission', isAuthenticate, permissionRouter)

/**
 * @typedef Error
 * @property {string} message - message - eg:message error
 *
 */

/**
 * @typedef ErrorValidation
 * @property {string} message - message - eg:Unprocessable Entity
 * @property {ErrorFields.model} errors - errors - eg:field tidak boleh kosong
 *
 */

/**
 * @typedef ErrorFields
 * @property {Array.<string>} field_1 - field - eg:["field tidak boleh kosong"]
 * @property {Array.<string>} field_2 - field - eg:["field tidak boleh kosong"]
 * @property {Array.<string>} field_n - field - eg:["field tidak boleh kosong"]
 *
 */

/**
 * @typedef PaginateResponse
 * @property {string} total - total - eg:20
 * @property {string} page - page - eg:1
 * @property {string} perPage - perPage - eg:10
 * @property {Array.<object>} list - list
 *
 */

export default router
