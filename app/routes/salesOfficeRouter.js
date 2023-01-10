/**
 * @module routes/salesOfficeRouter
 *
 *
 */
import express from 'express'
import multer from '../../config/multer'
import parameterModel from '../helpers/parameterModel'
import {
  list, update, create, detail, destroy, importSalesOffice, downloadExample,
} from '../controllers/salesOfficeController'
import { updateValidatorSales, createValidatorSales } from '../validators/salesOfficeValidator'
import validate from '../validators'
import { hasPermission } from '../middlewares/authMiddleware'

const salesOfficeRouter = express.Router()

salesOfficeRouter.post(
  '/import',
  hasPermission(['CREATE_SALES_OFFICE']),
  parameterModel.define('SalesOffice'),
  multer.upload.single('data-excel'),
  importSalesOffice,
)

salesOfficeRouter.get(
  '/download-example',
  hasPermission(['CREATE_SALES_OFFICE']),
  downloadExample,
)

salesOfficeRouter.get(
  '/',
  hasPermission(['LIST_SALES_OFFICE']),
  parameterModel.define('SalesOffice'),
  list,
)

salesOfficeRouter.post(
  '/',
  hasPermission(['CREATE_SALES_OFFICE']),
  validate(createValidatorSales),
  parameterModel.define('SalesOffice'),
  create,
)

salesOfficeRouter.get(
  '/:uuid',
  hasPermission(['LIST_SALES_OFFICE']),
  parameterModel.define('SalesOffice'),
  detail,
)

salesOfficeRouter.put(
  '/:uuid',
  hasPermission(['EDIT_SALES_OFFICE']),
  validate(updateValidatorSales),
  parameterModel.define('SalesOffice'),
  update,
)

salesOfficeRouter.delete(
  '/:uuid',
  hasPermission(['DELETE_SALES_OFFICE']),
  parameterModel.define('SalesOffice'),
  destroy,
)

export default salesOfficeRouter
