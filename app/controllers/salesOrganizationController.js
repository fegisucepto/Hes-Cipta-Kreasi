/* eslint-disable import/prefer-default-export */
/**
 * @module controllers/salesOrganizationController
 *
*/
import crypto from 'crypto'
import { Sequelize, Op } from 'sequelize'
import models from '../models'
import listResponse from '../helpers/listResponse'
import { USER_ROLE } from '../helpers/constants'
import { checkDefaultSortVariable } from '../helpers/variable'
import { deleteData } from './commonController'

const {
  sequelize, SalesOrganization, Invoice, SalesDistributionFaktur, UserSalesOrganization,
} = models

export async function list(req, res, next) {
  try {
    const { model, user, query } = req
    const { page = 1, paginate = 10, keyword = '' } = query
    const Model = models[model]

    const codeSort = query.code_sort
    const descriptionSort = query.description_sort
    const codeSortCondition = checkDefaultSortVariable(codeSort, 'code')
    const descriptionSortCondition = checkDefaultSortVariable(descriptionSort, 'description')

    // filter Sales Organization di user
    const salesOrganizationMap = user.SalesOrganizations.map((item) => item.uuid)
    let salesOrganizationUuidCondition = [{ uuid: salesOrganizationMap }]
    if (user.role_id === USER_ROLE.ADMIN || user.role_id === USER_ROLE.SUPERADMIN) {
      salesOrganizationUuidCondition = []
    }

    const options = {
      limit: Number(paginate),
      offset: (page - 1) * Number(paginate),
      attributes: [
        'id',
        'uuid',
        'code',
        'description',
      ],
      where: [
        {
          [Op.or]: [
            { code: { [Op.like]: `%${keyword.trim()}%` } },
            { description: { [Op.like]: `%${keyword.trim()}%` } },
          ],
        },
        ...salesOrganizationUuidCondition,
      ],
      order: [
        ...codeSortCondition,
        ...descriptionSortCondition,
      ],
    }

    const docs = await Model.findAll(options)
    const total = await Model.count(options)

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

    const resSalesOrganization = await SalesOrganization.findOne({ where: { code: body.code }, attributes: ['id'] })
    if (resSalesOrganization) return res.status(400).json({ message: 'Code sales organization sudah digunakan' })

    body.uuid = crypto.randomUUID()
    body.created_by = user.id
    body.created_at = new Date()

    const data = await Model.create(body, { transaction: t })

    await t.commit()

    return res.status(200).json(data)
  } catch (err) {
    await t.rollback()
    return next(err)
  }
}

export async function update(req, res, next) {
  const t = await sequelize.transaction()
  try {
    const {
      model, user, params, body,
    } = req
    const { uuid } = params
    const Model = models[model]

    let data = {}
    const resSalesOrganization = await Model.findOne({
      where: {
        uuid: { [Op.ne]: uuid },
        code: body.code.toUpperCase(),
      },
      attributes: ['code'],
      transaction: t,
    })
    // check code exist
    if (resSalesOrganization) {
      t.rollback()
      return res.status(400).json({ message: 'Code sales organization sudah digunakan' })
    }

    body.code = body.code.toUpperCase()
    body.description = body.description.toUpperCase()
    body.updated_by = user.id
    body.updated_at = new Date()

    data = await Model.update(body, { where: { uuid } }, { transaction: t })
    if (!data[0]) return res.status(404).json({ message: 'Sales organization tidak ditemukan' })
    data = await Model.findOne({ where: { uuid }, attributes: ['id', 'uuid', 'code', 'description'] }, { transaction: t })

    await t.commit()
    return res.status(200).json(data)
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

    const options = {
      include: {
        model: SalesOrganization,
        attributes: ['id'],
      },
      attributes: ['id'],
      where: {
        '$SalesOrganization.uuid$': uuid,
      },
      transaction: t,
    }

    // check Sales Organization exists
    const resInvoiceCheck = await Invoice.findOne(options)
    const resFaktur = await SalesDistributionFaktur.findOne(options)
    const resUserSalesOrganization = await UserSalesOrganization.findOne(options)

    if (resInvoiceCheck || resFaktur || resUserSalesOrganization) {
      t.rollback()
      return res.status(400).json({ message: 'Sales organization tidak dapat di hapus karena sudah ada di data lain' })
    }

    const dataUpdate = {
      code: Sequelize.fn('CONCAT', Sequelize.col('code'), `-${uuid}`),
    }

    // delete data
    await t.commit()
    return await deleteData({
      Model, res, user, uuid, dataUpdate,
    })
  } catch (err) {
    await t.rollback()
    return next(err)
  }
}
