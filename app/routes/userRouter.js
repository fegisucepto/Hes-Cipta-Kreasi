import express from 'express'
import parameterModel from '../helpers/parameterModel'
import {
  create, list,
  update, detail, destroy,
  updateStatus,
} from '../controllers/userController'
import { createValidator, updateValidator, updateStatusValidator } from '../validators/userValidator'
import { hasPermission } from '../middlewares/authMiddleware'
import validate from '../validators'

const userRouter = express.Router()

userRouter.get(
  '/',
  hasPermission(['LIST_USER']),
  parameterModel.define('User'),
  list,
)

userRouter.post(
  '/',
  hasPermission(['CREATE_USER']),
  validate(createValidator),
  parameterModel.define('User'),
  create,
)

userRouter.put(
  '/:uuid',
  hasPermission(['EDIT_USER']),
  validate(updateValidator),
  parameterModel.define('User'),
  update,
)

userRouter.put(
  '/status/:uuid',
  hasPermission(['EDIT_USER']),
  validate(updateStatusValidator),
  parameterModel.define('User'),
  updateStatus,
)

userRouter.get(
  '/:uuid',
  hasPermission(['LIST_USER']),
  parameterModel.define('User'),
  detail,
)

userRouter.delete(
  '/:uuid',
  hasPermission(['DELETE_USER']),
  parameterModel.define('User'),
  destroy,
)

export default userRouter
