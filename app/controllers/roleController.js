/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/**
 * @module controllers/roleController
 *
*/
import crypto from 'crypto'
import { Op, QueryTypes } from 'sequelize'
import models from '../models'
import listResponse from '../helpers/listResponse'
import { USER_ROLE } from '../helpers/constants'
import { deleteData } from './commonController'

const {
  sequelize, User, Role,
  RolePermission, Permission,
  Session,
} = models

const getAndSaveRolePermission = async (dataRole, bodyPermission, t) => {
  const dataSelectRole = await sequelize.query(
    'SELECT id AS permission_id, ? AS role_id FROM permissions WHERE uuid IN (?)',
    {
      replacements: [dataRole.id, bodyPermission],
      type: QueryTypes.SELECT,
      transaction: t,
    },
  )
  if (!dataSelectRole[0] || dataSelectRole.length !== bodyPermission.length) return false
  await RolePermission.bulkCreate(dataSelectRole, { transaction: t })
  return true
}

export async function list(req, res, next) {
  const t = await sequelize.transaction()
  try {
    const { model, query, user } = req
    const { page = 1, paginate = 10, keyword = '' } = query

    let docs = {}
    let total = {}
    const options = {
      attributes: ['uuid', 'name', 'description'],
      where: [
        {
          [Op.or]: [
            { name: { [Op.like]: `%${keyword.trim()}%` } },
            { description: { [Op.like]: `%${keyword.trim()}%` } },
          ],
        },
      ],
      limit: Number(paginate),
      offset: (page - 1) * Number(paginate),
    }

    const Model = models[model]
    docs = await Model.findAll(options)
    total = await Model.count(options)

    if (user.role_id !== USER_ROLE.SUPERADMIN) {
      await t.rollback()
      docs.shift()
      total -= 1
      return res.status(200).json(listResponse(total, +page, +paginate, docs))
    }

    return res.status(200).json(listResponse(total, +page, +paginate, docs))
  } catch (err) {
    return next(err)
  }
}

export async function create(req, res, next) {
  const t = await sequelize.transaction()
  try {
    const { model, user, body } = req
    const Model = models[model]
    const bodyPermission = body.permission_uuid

    // Check Role id exist
    const resRoleId = await Role.findOne({ where: { name: req.body.name }, attributes: ['id'] })
    if (resRoleId) return res.status(422).json({ message: 'Role name sudah digunakan' })

    body.uuid = crypto.randomUUID()
    body.name = req.body.name.toUpperCase()
    body.created_by = user.id
    body.updated_by = user.id

    const data = await Model.create(req.body, { transaction: t })
    const resGetSaveRole = await getAndSaveRolePermission(data, bodyPermission, t)
    if (!resGetSaveRole) {
      await t.rollback()
      return res.status(404).json({ message: 'Permission tidak ditemukan' })
    }

    await t.commit()
    return res.status(200).json(data)
  } catch (err) {
    await t.rollback()
    return next(err)
  }
}

export async function detail(req, res, next) {
  try {
    const { model, params } = req
    const { uuid } = params
    const Model = models[model]

    const resRoleDetail = await Model.findOne({
      where: { uuid },
      attributes: ['id', ...Model.getBasicAttribute()],
    })
    if (!resRoleDetail) return res.status(404).json({ message: 'Role tidak ditemukan' })
    const resRolePermission = await RolePermission.findAll({
      include: { model: Permission, attributes: ['uuid', 'category'] },
      where: { role_id: resRoleDetail.id },
    })
    const responsePermissions = {}
    for (const item of resRolePermission) {
      if (!responsePermissions[item.Permission.category]) {
        responsePermissions[item.Permission.category] = []
      }
      responsePermissions[item.Permission.category].push(item.Permission.uuid)
    }
    resRoleDetail.dataValues.Permissions = responsePermissions
    delete resRoleDetail.dataValues.id

    return res.status(200).json(resRoleDetail)
  } catch (err) {
    return next(err)
  }
}

export async function update(req, res, next) {
  const t = await sequelize.transaction()
  try {
    const {
      model, user, body, params,
    } = req
    const { uuid } = params
    const Model = models[model]

    const bodyPermission = body.permission_uuid

    // check role name exists other role
    const resRole = await Model.findOne({
      where: { name: body.name.toUpperCase(), uuid: { [Op.ne]: uuid } },
      attributes: ['id'],
      transaction: t,
    })
    if (resRole) {
      return res.status(400).json({ message: 'Role name sudah digunakan' })
    }

    body.name = body.name.toUpperCase()
    body.updated_by = user.id

    // check Role exists
    const dataRole = await Model.findOne({ attributes: ['id'], where: { uuid }, transaction: t })
    if (!dataRole) {
      await t.rollback()
      return res.status(404).json({ message: 'Role tidak ditemukan' })
    }
    // check permission exists
    const dataPermission = await Permission.findAll({
      where: { uuid: bodyPermission },
      transaction: t,
    })
    if (dataPermission.length !== bodyPermission.length) {
      await t.rollback()
      return res.status(404).json({ message: 'Permission tidak ditemukan' })
    }
    // check user with update role
    const dataUser = await User.findAll({
      attributes: ['id'],
      where: { role_id: dataRole.id },
    })
    // update role dan delete permission before
    await Model.update(body, { where: { uuid }, transaction: t })
    await RolePermission.destroy({ where: { role_id: dataRole.id }, force: true, transaction: t })
    // logout all user wiith this role
    await Session.destroy({ where: { user_id: dataUser.map((item) => item.id) }, transaction: t })
    // find role and permision id
    await getAndSaveRolePermission(dataRole, bodyPermission, t)

    await t.commit()
    return res.status(200).json({ message: 'Update Success' })
  } catch (err) {
    await t.rollback()
    return next(err)
  }
}

export async function destroy(req, res, next) {
  const t = await sequelize.transaction()

  try {
    const { model, user, params } = req
    const { uuid } = params
    const Model = models[model]

    // check Role exists in user
    const resUser = await User.findOne({
      include: {
        model: Role,
        attributes: ['uuid', 'name'],
      },
      attributes: ['uuid'],
      where: {
        '$Role.uuid$': uuid,
      },
      transaction: t,
    })
    if (resUser) {
      t.rollback()
      return res.status(400).json({ message: 'Role tidak dapat di hapus karena sudah ada di user' })
    }
    // delete data
    const dataRole = await Model.findOne({ attributes: ['name'], where: { uuid }, transaction: t })
    if (!dataRole) {
      t.rollback()
      return res.status(404).json({ message: 'Role tidak ditemukan' })
    } await t.commit()
    return await deleteData({
      Model, res, user, uuid, additionalResponse: { role_name: dataRole.name },
    })
  } catch (err) {
    await t.rollback()
    return next(err)
  }
}

export async function testSetPermission(req, res, next) {
  const t = await sequelize.transaction()

  try {
    const { body } = req
    const data = await sequelize.query(
      'SELECT id AS permission_id, ? AS role_id FROM permissions',
      {
        replacements: [body.role_id],
        type: QueryTypes.SELECT,
        transaction: t,
      },
    )
    await RolePermission.bulkCreate(data, { transaction: t })
    await t.commit()
    return res.json(data)
  } catch (err) {
    await t.rollback()
    return next(err)
  }
}
