/**
 * @module controllers/authController
 *
*/
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import handlebars from 'handlebars'
import fs from 'fs/promises'
import models from '../models'
import service from '../sevices/index'
import errorResponse from '../helpers/errorResponse'
import { checkHash } from '../helpers/password'
import { addHour, isExpired } from '../helpers/time'

const {
  User, Role, Session, sequelize,
  ForgetPassword,
} = models

export async function login(req, res, next) {
  try {
    const data = req.body
    const user = await User.findOne({
      include: [{
        model: Role,
        attributes: ['uuid', 'name'],
      }],
      where: {
        email: data.email,
      },
      attributes: [
        ...User.getBasicAttribute(),
        'password',
      ],
    })

    if (!user || !checkHash(data.password, user.password)) {
      return res.status(400).json(errorResponse('Email atau password Anda tidak ditemukan'))
    }
    if (!user || !user?.is_active) {
      return res.status(403).json(errorResponse('Akun anda di blokir'))
    }

    user.update({
      last_login: new Date(),
    })
    const userData = user.dataValues
    const sessionID = `session-${Date.now()}`
    const payload = {
      session_id: sessionID,
      id: userData.id,
      email: userData.email,
    }

    await Session.destroy({ where: { user_id: userData.id } })
    await Session.create({ id: sessionID, uuid: crypto.randomUUID(), user_id: userData.id })
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '3d' })
    delete userData.password
    userData.token = token

    return res.status(200).json(userData)
  } catch (err) {
    return next(err)
  }
}

export async function logout(req, res, next) {
  const t = await sequelize.transaction()
  try {
    const { session } = req

    let data = {}
    const body = {}
    data = await Session.findByPk(session.id)
    if (!data) return res.json(404, { message: req.t('404') })
    await data.update(body, { transaction: t })
    await data.destroy({ transaction: t })
    await t.commit()

    return res.status(200).json({ message: 'logout success' })
  } catch (err) {
    await t.rollback()
    return next(err)
  }
}

export async function forgetPassword(req, res, next) {
  const t = await sequelize.transaction()
  try {
    const data = req.body
    const user = await User.findOne({
      where: {
        email: data.email,
        is_active: 1,
      },
      attributes: [
        'firstname',
        'lastname',
        'email',
      ],
    })

    if (!user) return res.status(404).json(errorResponse('Email tidak terdaftar'))

    const token = crypto.randomUUID()
    const dataHtml = {
      firstname: user.firstname,
      lastname: user.lastname,
      linkForgetPassword: `${process.env.URL_RESET_MAIL}?token=${token}`,
      linkLogo: `${process.env.BASE_URL}/public/wicaksana.png`,
    }

    // make html for email message
    const htmlForgetPassword = await fs.readFile('./app/views/forgetPassword.hbs', 'utf8')
    const dataHtmlForgetPassword = handlebars.compile(htmlForgetPassword)
    const html = dataHtmlForgetPassword(dataHtml)

    // send email
    const resEmail = await service.email(user, 'Forget Password', null, html)
    if (!resEmail) return res.status(424).json(errorResponse('Email gagal dikirim'))

    // Save data forget password
    const dataForgetPassword = {
      token,
      email: user.email,
      expired_at: addHour(2),
    }
    await ForgetPassword.create(dataForgetPassword, { transaction: t })
    await t.commit()

    return res.status(200).json({ message: 'Email berhasil dikirim' })
  } catch (err) {
    await t.rollback()
    return next(err)
  }
}

export async function resetPassword(req, res, next) {
  const t = await sequelize.transaction()
  try {
    const data = req.body
    const dataForgetPassword = await ForgetPassword.findOne({
      where: {
        token: data.token,
      },
      attributes: [
        'token',
        'email',
        'expired_at',
      ],
    })

    if (!dataForgetPassword) return res.status(404).json(errorResponse('token tidak ditemukan'))
    if (isExpired(dataForgetPassword.expired_at)) {
      await ForgetPassword.destroy({ where: { token: data.token }, transaction: t })
      await t.commit()
      return res.status(401).json(errorResponse('token expired'))
    }

    // update password user
    await User.update(
      { password: data.password },
      { where: { email: dataForgetPassword.email }, transaction: t },
    )

    // delete token forget pasword
    await ForgetPassword.destroy({ where: { token: data.token }, transaction: t })
    await t.commit()
    return res.status(200).json({ message: 'Password berhasil di ubah' })
  } catch (err) {
    await t.rollback()
    return next(err)
  }
}
