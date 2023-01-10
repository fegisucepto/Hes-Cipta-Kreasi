/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/**
 * @module controllers/storageLocationController
 *
*/
import crypto from 'crypto'
import readCsvFile from 'csvdata'
import readXlsxFile from 'read-excel-file/node'
import { Sequelize, Op } from 'sequelize'
import models from '../models'
import listResponse from '../helpers/listResponse'
import { USER_ROLE } from '../helpers/constants'
import { checkDataExcel, getErrorReadExcel, SCHEMA_IMPORT_STORAGE_LOCATION } from '../sevices/readExcel'
import { getErrorReadCSV, OPTIONS_READ_CSV } from '../sevices/csv'
import { deleteData, importData } from './commonController'
import { checkDefaultSortVariable } from '../helpers/variable'

const {
  sequelize, StorageLocation, Invoice, UserStorageLocation, Driver,
} = models

const saveDataExcel = async ({ filePath, Model, t }) => {
  let message
  const data = []
  const schema = SCHEMA_IMPORT_STORAGE_LOCATION
  await readXlsxFile(filePath, { schema }).then(async (rows) => {
    // check rows kosong atau tidak
    const resCheckDataExcel = await checkDataExcel(rows)
    if (resCheckDataExcel !== true) {
      message = resCheckDataExcel
      return message
    }
    // re map data and find id from code storage location
    for (const item of rows.rows) {
      data.push({
        uuid: crypto.randomUUID(),
        ...item,
      })
    }
    // insert data
    await Model.bulkCreate(data, { transaction: t })
    message = true
    return message
  }).catch((err) => {
    message = getErrorReadExcel(err)
    return message
  })
  return message
}

const saveDataCsv = async ({ filePath, Model, t }) => {
  try {
    const data = []
    const options = OPTIONS_READ_CSV
    const dataCsv = await readCsvFile.load(filePath, options)
    if (!dataCsv[0]) {
      return { message: 'Dokumen tidak sesuai template' }
    }
    for (const item of dataCsv) {
      data.push({
        uuid: crypto.randomUUID(),
        code: item['Storage Location Code'],
        name: item['Storage Location Name'],
      })
    }
    await Model.bulkCreate(data, { transaction: t })
    return true
  } catch (err) {
    return getErrorReadCSV(err)
  }
}

export async function download(req, res, next) {
  try {
    const { type } = req.query
    let file = './public/TemplateStorageLocation.xlsx'
    if (type === 'csv') file = './public/TemplateStorageLocation.csv'
    return res.download(file) // Set disposition and send it.
  } catch (err) {
    return next(err)
  }
}

export async function importStorageLocation(req, res, next) {
  return importData({
    req, res, next, saveDataExcel, saveDataCsv,
  })
}

export async function list(req, res, next) {
  try {
    const { model, user, query } = req
    let { page, paginate } = query
    const { keyword = '' } = query
    const Model = models[model]

    const codeSort = query.code_sort
    const nameSort = query.name_sort
    // sort list
    const codeSortCondition = checkDefaultSortVariable(codeSort, 'code')
    const nameSortCondition = checkDefaultSortVariable(nameSort, 'name')

    // pagination condition
    let paginationCondition = {}
    if (page && paginate) {
      page = Number(page)
      paginate = Number(paginate)
      paginationCondition = {
        limit: paginate,
        offset: (page - 1) * paginate,
      }
    }

    // filter Sales Organization di user
    const StorageLocationMap = user.StorageLocations.map((item) => item.uuid)
    let storageLocationCondition = [{ uuid: StorageLocationMap }]
    if (user.role_id === USER_ROLE.ADMIN || user.role_id === USER_ROLE.SUPERADMIN) {
      storageLocationCondition = []
    }

    const options = {
      where: [
        {
          [Op.or]: [
            { code: { [Op.like]: `%${keyword.trim()}%` } },
            { name: { [Op.like]: `%${keyword.trim()}%` } },
          ],
        },
        ...storageLocationCondition,
      ],
      attributes: ['uuid', 'code', 'name'],
      order: [
        ...codeSortCondition,
        ...nameSortCondition,
      ],
      ...paginationCondition,
    }

    const docs = await Model.findAll(options)
    const total = await Model.count(options)

    return res.status(200).json(listResponse(total, page || 1, paginate || total, docs))
  } catch (err) {
    return next(err)
  }
}

export async function create(req, res, next) {
  const t = await sequelize.transaction()
  try {
    const { model, user, body } = req
    const Model = models[model]

    const resStorageLocation = await StorageLocation.findOne({ where: { code: req.body.code }, attributes: ['id'] })
    if (resStorageLocation) return res.status(400).json({ message: 'Code storage location sudah digunakan' })

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
    const resStorageLocation = await Model.findOne({
      where: {
        uuid: { [Op.ne]: uuid },
        code: body.code.toUpperCase(),
      },
      attributes: ['code'],
      transaction: t,
    })
    // check code exist
    if (resStorageLocation) {
      t.rollback()
      return res.status(400).json({ message: 'Code storage location sudah digunakan' })
    }

    body.code = body.code.toUpperCase()
    body.updated_by = user.id
    body.updated_at = new Date()

    data = await Model.update(body, { where: { uuid }, transaction: t })
    if (!data[0]) {
      t.rollback()
      return res.status(404).json({ message: 'Storage location tidak ditemukan' })
    }
    data = await Model.findOne({ where: { uuid }, transaction: t })

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
        model: StorageLocation,
        attributes: ['id'],
      },
      attributes: ['id'],
      where: {
        '$StorageLocation.uuid$': uuid,
      },
      transaction: t,
    }

    // check Storage Location exists
    const resInvoice = await Invoice.findOne(options)
    const resUserStorageLocation = await UserStorageLocation.findOne(options)
    const resDriver = await Driver.findOne(options)

    if (resInvoice || resUserStorageLocation || resDriver) {
      t.rollback()
      return res.status(400).json({ message: 'Storage tidak dapat di hapus karena sudah ada di data lain' })
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
