/**
 * @module routes/storageLocationRouter
 *
 *
 */
import express from 'express'
import multer from '../../config/multer'
import parameterModel from '../helpers/parameterModel'
import {
  list, update, create, destroy, importStorageLocation, download,
} from '../controllers/storageLocationController'
import { detail } from '../controllers/commonController'
import { createValidatorStorage, updateValidatorStorage } from '../validators/storageLocationValidator'
import validate from '../validators'
import { hasPermission } from '../middlewares/authMiddleware'

const storageLocationRouter = express.Router()

storageLocationRouter.get(
  '/download',
  hasPermission(['CREATE_STORAGE_LOCATION']),
  download,
)

storageLocationRouter.post(
  '/import',
  hasPermission(['CREATE_STORAGE_LOCATION']),
  parameterModel.define('StorageLocation'),
  multer.upload.single('data-excel'),
  importStorageLocation,
)

storageLocationRouter.get(
  '/',
  hasPermission(['LIST_STORAGE_LOCATION']),
  parameterModel.define('StorageLocation'),
  list,
)

storageLocationRouter.post(
  '/',
  hasPermission(['CREATE_STORAGE_LOCATION']),
  validate(createValidatorStorage),
  parameterModel.define('StorageLocation'),
  create,
)

storageLocationRouter.get(
  '/:uuid',
  hasPermission(['LIST_STORAGE_LOCATION']),
  parameterModel.define('StorageLocation'),
  detail,
)

storageLocationRouter.put(
  '/:uuid',
  hasPermission(['EDIT_STORAGE_LOCATION']),
  validate(updateValidatorStorage),
  parameterModel.define('StorageLocation'),
  update,
)

storageLocationRouter.delete(
  '/:uuid',
  hasPermission(['DELETE_STORAGE_LOCATION']),
  parameterModel.define('StorageLocation'),
  destroy,
)

export default storageLocationRouter
