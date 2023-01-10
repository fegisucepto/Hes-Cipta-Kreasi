/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/**
 * @module controllers/permissionController
 *
*/

import { buildDataPermission } from '../helpers/buildResponse'
import models from '../models'

const { Permission } = models

export async function list(req, res, next) {
  try {
    const { model } = req
    const Model = models[model]
    const docs = await Model.findAll({ order: [['category_key', 'ASC']] })

    const response = {}
    for (const item of docs) {
      if (!response[item.category]) response[item.category] = []
      response[item.category].push({
        uuid: item.uuid,
        name: item.name,
        description: item.description,
      })
    }

    return res.status(200).json(buildDataPermission(response))
  } catch (err) {
    return next(err)
  }
}

export async function detailAccessUser(req, res, next) {
  try {
    const { model, user } = req
    const Model = models[model]

    const docs = await Model.findAll({
      include: {
        model: Permission,
        attributes: ['category_key', 'name_key'],
      },
      where: {
        role_id: user.role_id,
      },
      order: [[Permission, 'category_key', 'ASC']],
    })

    const response = {}
    for (const item of docs) {
      if (!response[item.Permission.category_key]) response[item.Permission.category_key] = []
      response[item.Permission.category_key].push(item.Permission.name_key)
    }

    return res.status(200).json(response)
  } catch (err) {
    return next(err)
  }
}
