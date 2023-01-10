import { body } from 'express-validator'
import { checkPassword } from './customValidator'

const email = [
  body('email')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.email') }))
    .isEmail()
    .withMessage((value, { req }) => req.t('validator.email', { field: req.t('field.user.email') })),
]

const password = [
  body('password')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.password') }))
    .isLength({ min: 8 })
    .withMessage((value, { req }) => req.t('validator.password', { field: req.t('field.user.password') })),
]

export const loginValidator = [
  ...email,
  ...password,
]

export const forgetPasswordValidator = [
  ...email,
]

export const resetPasswordValidator = [
  body('token')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.token') })),
  ...password,
  body('password')
    .custom(checkPassword),
]
