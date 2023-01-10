/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
import models from '../models'

const { User } = models

export function checkPassword(password, { req }) {
  if (password) {
    const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
    if (password.length < 8 || !reg.test(password)) {
      throw Error('Password minimal 8 karakter, ada kombinasi huruf besar, huruf kecil dan angka')
    }
  }

  return true
}

export function checkPasswordConfirm(passwordConfirmation, { req }) {
  if (passwordConfirmation !== req.body.password) {
    throw Error(req.t('validator.same_value', { field: req.t('field.user.password_konfirm') }))
  }

  return true
}

export async function emailNotExist(email, { req }) {
  const user = await User.findOne({
    where: {
      email,
    },
  })

  if (user) {
    throw Error(req.t('validator.exist', { field: req.t('field.user.email') }))
  }

  return true
}

export function commonExistsFieldUpdate(model, fieldCondition = '', field = '') {
  let Model = null
  if (typeof model === 'string') Model = models[model]
  else if (typeof model === 'function') Model = model
  return async function (value, { req }) {
    const { uuid } = req.params
    if (uuid) {
      const prev = await Model.findOne({ where: { uuid } })
      if (prev && prev[fieldCondition] !== value) {
        const data = await Model.findOne({
          where: { [fieldCondition]: value },
        })
        if (data) throw Error(req.t('validator.exist', { field: req.t(`field.${field}`) }))
      }
    }

    return true
  }
}
