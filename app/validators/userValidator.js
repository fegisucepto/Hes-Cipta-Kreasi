import { body } from 'express-validator'
import {
  emailNotExist, commonExistsFieldUpdate,
} from './customValidator'

const password = [
  body('password')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.password') }))
    .isLength({ min: 8 })
    .withMessage((value, { req }) => req.t('validator.password', { field: req.t('field.user.password') })),
]

const general = [
  body('firstname')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.firstname') }))
    .isString()
    .withMessage((value, { req }) => req.t('validator.string', { field: req.t('field.user.firstname') })),
  body('lastname')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.lastname') }))
    .isString()
    .withMessage((value, { req }) => req.t('validator.string', { field: req.t('field.user.lastname') })),
  body('email')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.email') }))
    .isEmail()
    .withMessage((value, { req }) => req.t('validator.email', { field: req.t('field.user.email') })),
  body('role_uuid')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.role') })),
  body('sales_office_uuid')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.sales_office') })),
  body('storage_location_uuid')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.storage_location') })),
  body('sales_organization_uuid')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.sales_organization') })),
]

export const createValidator = [
  ...general,
  ...password,
  body('email')
    .custom(emailNotExist),
]

export const updateValidator = [
  body('email')
    .custom(commonExistsFieldUpdate('User', 'email', 'user.email')),
  ...general,
]

export const updateStatusValidator = [
  body('is_active')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.is_active') }))
    .isBoolean()
    .withMessage((value, { req }) => req.t('validator.boolean', { field: req.t('field.user.is_active') })),
]
