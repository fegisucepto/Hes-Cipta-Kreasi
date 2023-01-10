/**
 * @module routes/permissionRouter
 *
 *
 */
import express from 'express'
import parameterModel from '../helpers/parameterModel'
import { list, detailAccessUser } from '../controllers/permissionController'
import { hasPermission } from '../middlewares/authMiddleware'

const permissionRouter = express.Router()

permissionRouter.get(
  '/',
  hasPermission([]),
  parameterModel.define('Permission'),
  list,
)

permissionRouter.get(
  '/detail-access-user',
  parameterModel.define('RolePermission'),
  detailAccessUser,
)

export default permissionRouter
