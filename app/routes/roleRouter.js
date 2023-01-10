/**
 * @module routes/roleRouter
 *
 *
 */
import express from 'express'
import parameterModel from '../helpers/parameterModel'
import {
  list, destroy, create, update, detail, testSetPermission,
} from '../controllers/roleController'
import { hasPermission } from '../middlewares/authMiddleware'

const roleRouter = express.Router()

// hapus ini kalo sudah test
roleRouter.post(
  '/test',
  testSetPermission,
)

roleRouter.get(
  '/',
  parameterModel.define('Role'),
  list,
)

roleRouter.delete(
  '/:uuid',
  hasPermission([]),
  parameterModel.define('Role'),
  destroy,
)

roleRouter.post(
  '/',
  hasPermission([]),
  parameterModel.define('Role'),
  create,
)

roleRouter.get(
  '/:uuid',
  hasPermission([]),
  parameterModel.define('Role'),
  detail,
)

roleRouter.put(
  '/:uuid',
  hasPermission([]),
  parameterModel.define('Role'),
  update,
)

export default roleRouter
