/**
 * @module routes/regionRouter
 *
 *
 */
import express from 'express'
import multer from '../../config/multer'
import parameterModel from '../helpers/parameterModel'
import {
  list, create, destroy, update, importRegion, download,
} from '../controllers/regionController'
import { detail } from '../controllers/commonController'
import { createValidatorRegion, updateValidatorRegion } from '../validators/regionValidator'
import validate from '../validators'
import { hasPermission } from '../middlewares/authMiddleware'

const regionRouter = express.Router()

regionRouter.post(
  '/import',
  hasPermission(['CREATE_REGION']),
  parameterModel.define('Region'),
  multer.upload.single('data-excel'),
  importRegion,
)

regionRouter.get(
  '/download',
  hasPermission(['CREATE_REGION']),
  download,
)

regionRouter.get(
  '/',
  hasPermission(['LIST_REGION']),
  parameterModel.define('Region'),
  list,
)

regionRouter.post(
  '/',
  hasPermission(['CREATE_REGION']),
  validate(createValidatorRegion),
  parameterModel.define('Region'),
  create,
)

regionRouter.get(
  '/:uuid',
  hasPermission(['LIST_REGION']),
  parameterModel.define('Region'),
  detail,
)

regionRouter.put(
  '/:uuid',
  hasPermission(['EDIT_REGION']),
  validate(updateValidatorRegion),
  parameterModel.define('Region'),
  update,
)

regionRouter.delete(
  '/:uuid',
  hasPermission(['DELETE_REGION']),
  parameterModel.define('Region'),
  destroy,
)

export default regionRouter
