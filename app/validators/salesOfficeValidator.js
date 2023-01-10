import { body } from 'express-validator'

const general = [
  body('code')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.code') })),
  body('name')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.name') })),
  body('region_uuid')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('region_uuid') })),
]

export const createValidatorSales = [
  ...general,
]

export const updateValidatorSales = [
  ...general,
]
