import { body } from 'express-validator'

const general = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('field.user.code') })),
  body('description')
    .trim()
    .notEmpty()
    .withMessage((value, { req }) => req.t('validator.not_empty', { field: req.t('description') })),
]

export const createValidatorOrganization = [
  ...general,
]

export const updateValidatorOrganization = [
  ...general,
]
