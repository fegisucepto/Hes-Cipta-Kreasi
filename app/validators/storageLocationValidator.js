import { body } from 'express-validator'

const general = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.code') })),
  body('name')
    .trim()
    .notEmpty()
    .withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.name') })),
]

export const createValidatorStorage = [
  ...general,
]

export const updateValidatorStorage = [
  ...general,
]
