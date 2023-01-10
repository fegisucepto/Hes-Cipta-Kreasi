/**
 * @module middlewares/authMiddleware
 *
 *
 * @requires jsonwebtoken
 * @requires helpers/errorResponse
 * @requires models
 *
*/

import jwt from 'jsonwebtoken'
import { USER_ROLE } from '../helpers/constants'
import errorResponse from '../helpers/errorResponse'
import models from '../models'

const {
  User, Session, SalesOffice, SalesOrganization,
  StorageLocation, RolePermission, Permission,
} = models

const checkHeader = (headers) => {
  if (!headers.authorization) {
    return { code: 401, message: 'Unauthorized' }
  }

  const splitToken = headers.authorization.split(' ')
  if (splitToken.length !== 2 || splitToken[0] !== 'Bearer') {
    return { code: 400, message: 'Wrong authorization format' }
  }

  return { code: 200, data: splitToken }
}

const getRolePermission = async (roleId, permissions) => RolePermission.findOne({
  include: { model: Permission, attributes: ['name_key'] },
  where: {
    role_id: roleId,
    '$Permission.name_key$': permissions,
  },
})

/**
 * check is have any user authenticate from token, save user data in request
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns {any}
 */
export function isAuthenticate(req, res, next) {
  const resCheckHeader = checkHeader(req.headers)
  if (resCheckHeader.code !== 200) {
    res.status(resCheckHeader.code).json(errorResponse(resCheckHeader.message))
    return
  }
  const splitToken = resCheckHeader.data

  jwt.verify(splitToken[1], process.env.SECRET, { algorithms: ['HS256'] }, async (err, payload) => {
    if (err && err.name === 'TokenExpiredError') {
      res.status(401).json(errorResponse('Expired Token'))
    } else if (err) {
      res.status(401).json(errorResponse('Invalid Token'))
    } else {
      const session = await Session.findOne({
        include: [
          {
            model: User,
            attributes: ['is_active'],
          },
        ],
        where: {
          id: payload.session_id,
          '$User.is_active$': true,
        },
      })

      if (!session) {
        res.status(401).json(errorResponse('Invalid Token'))
        return
      }

      const user = await User.findOne({
        include: [
          {
            model: SalesOffice,
            attributes: ['uuid'],
            through: { attributes: [] },
          }, {
            model: SalesOrganization,
            attributes: ['uuid'],
            through: { attributes: [] },
          }, {
            model: StorageLocation,
            attributes: ['uuid'],
            through: { attributes: [] },
          },
        ],
        where: {
          id: payload.id,
        },
        attributes: [
          ...User.getBasicAttribute(),
          'role_id',
        ],
      })

      if (!user) {
        res.status(401).json(errorResponse('Invalid Token'))
        return
      }

      req.session = session
      req.user = user
      req.user.view_all_data = user.role_id === USER_ROLE.SUPERADMIN
      next()
    }
  })
}

/**
 * Check if logged user have same role with param
 * @param {array} roles - array of role key
 * @returns {any}
 */
export function hasRole(roles = []) {
  return async (req, res, next) => {
    try {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of roles) {
        if (item === req.user.role_id) {
          return next()
        }
      }
      return res.status(403).json(errorResponse('Forbidden Access'))
    } catch (err) {
      return next(err)
    }
  }
}

export function hasPermission(permissions = []) {
  return async (req, res, next) => {
    try {
      // if superadmin
      if (req.user.role_id === USER_ROLE.SUPERADMIN) return next()
      // get permission exists
      const dataPermission = await getRolePermission(req.user.role_id, permissions)
      // if permission exists
      if (dataPermission) return next()

      return res.status(403).json(errorResponse('Forbidden Access'))
    } catch (err) {
      return next(err)
    }
  }
}

export function canViewAllData(permissions = []) {
  return async (req, res, next) => {
    try {
      const { user } = req
      user.view_all_data = false
      // if superadmin
      if (user.role_id === USER_ROLE.SUPERADMIN) {
        user.view_all_data = true
        return next()
      }
      // get permission exists
      const dataPermission = await getRolePermission(req.user.role_id, permissions)

      if (dataPermission) user.view_all_data = true
      return next()
    } catch (err) {
      return next(err)
    }
  }
}
