/**
 * @module routes/salesOrganizationRouter
 *
 *
 */
import express from 'express'
import parameterModel from '../helpers/parameterModel'
import {
  list, create, update, destroy,
} from '../controllers/salesOrganizationController'
import { detail } from '../controllers/commonController'
import { createValidatorOrganization, updateValidatorOrganization } from '../validators/salesOrganization'
import { hasPermission } from '../middlewares/authMiddleware'
import validate from '../validators'

const salesOrganizationRouter = express.Router()
salesOrganizationRouter.get(
  '/',
  hasPermission(['LIST_SALES_ORGANIZATION']),
  parameterModel.define('SalesOrganization'),
  list,
)

salesOrganizationRouter.post(
  '/',
  hasPermission(['CREATE_SALES_ORGANIZATION']),
  validate(createValidatorOrganization),
  parameterModel.define('SalesOrganization'),
  create,
)

salesOrganizationRouter.get(
  '/:uuid',
  hasPermission(['LIST_SALES_ORGANIZATION']),
  parameterModel.define('SalesOrganization'),
  detail,
)

salesOrganizationRouter.put(
  '/:uuid',
  hasPermission(['EDIT_SALES_ORGANIZATION']),
  validate(updateValidatorOrganization),
  parameterModel.define('SalesOrganization'),
  update,
)

salesOrganizationRouter.delete(
  '/:uuid',
  hasPermission(['DELETE_SALES_ORGANIZATION']),
  parameterModel.define('SalesOrganization'),
  destroy,
)

export default salesOrganizationRouter
