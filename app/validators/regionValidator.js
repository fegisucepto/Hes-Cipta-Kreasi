import { body } from 'express-validator'

const general = [
  body('id_region')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('id_region') })),
  body('code')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.code') })),
  body('name')
    .notEmpty().withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.name') })),
]

export const createValidatorRegion = [
  ...general,
]

export const updateValidatorRegion = [
  ...general,
]
