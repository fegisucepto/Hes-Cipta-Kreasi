/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/**
 * @module controllers/regionController
 *
*/
import crypto from 'crypto'
import readCsvFile from 'csvdata'
import readXlsxFile from 'read-excel-file/node'
import { Sequelize, Op } from 'sequelize'
import models from '../models'
import listResponse from '../helpers/listResponse'
import { checkDataExcel, getErrorReadExcel, SCHEMA_IMPORT_REGION } from '../sevices/readExcel'
import { getErrorReadCSV, OPTIONS_READ_CSV } from '../sevices/csv'
import { deleteData, importData } from './commonController'
import { checkDefaultSortVariable } from '../helpers/variable'

const {
  sequelize, Region, SalesOffice,
} = models

const saveDataExcel = async ({ filePath, Model, t }) => {
  let message = true
  const data = []
  const schema = SCHEMA_IMPORT_REGION
  await readXlsxFile(filePath, { schema }).then(async (rows) => {
    // check rows kosong atau tidak
    const resCheckDataExcel = await checkDataExcel(rows)
    if (resCheckDataExcel !== true) {
      message = resCheckDataExcel
      return message
    }
    // re map data and find id from code region
    for (const item of rows.rows) {
      data.push({
        uuid: crypto.randomUUID(),
        ...item,
      })
    }

    const resRegion = await Model.findAll({
      where: {
        [Op.or]: [
          { id_region: data.map((item) => item.id_region) },
          { code: data.map((item) => item.code) },
        ],
      },
      attributes: ['id_region', 'code'],
      transaction: t,
    })

    if (resRegion.length > 0) {
      message = {
        message: 'Terdapat duplikat data',
        data: resRegion,
      }
      return message
    }
    await Model.bulkCreate(data, { transaction: t })
    return message
  // eslint-disable-next-line no-undef
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
        id_region: item['ID Region'],
        code: item['Region Code'],
        name: item['Region Name'],
      })
    }

    const resRegionCsv = await Model.findAll({
      where: {
        [Op.or]: [
          { id_region: data.map((item) => item.id_region) },
          { code: data.map((item) => item.code) },
        ],
      },
      attributes: ['id_region', 'code'],
      transaction: t,
    })

    if (resRegionCsv.length > 0) {
      return {
        message: 'Terdapat duplikat data',
        data: resRegionCsv,
      }
    }
    await Model.bulkCreate(data, { transaction: t })
    return true
  } catch (error) {
    return getErrorReadCSV(error)
  }
}

export async function download(req, res, next) {
  try {
    const { type } = req.query
    let file = './public/templateRegion.xlsx'
    if (type === 'csv') file = './public/templateRegion.csv'
    return res.download(file) // Set disposition and send it.
  } catch (err) {
    return next(err)
  }
}

export async function importRegion(req, res, next) {
  return importData({
    req, res, next, saveDataExcel, saveDataCsv,
  })
}

export async function list(req, res, next) {
  try {
    const { model, query } = req
    const { page = 1, paginate = 10, keyword = '' } = query

    const idRegion = req.query.id_region_sort
    const codeSort = req.query.code_sort
    const nameSort = req.query.name_sort

    const idRegiontCondition = checkDefaultSortVariable(idRegion, 'id_region')
    const codeSortCondition = checkDefaultSortVariable(codeSort, 'code')
    const nameSortCondition = checkDefaultSortVariable(nameSort, 'name')
    let sortCondition = [
      ...idRegiontCondition,
      ...codeSortCondition,
      ...nameSortCondition,
    ]
    if (!sortCondition[0]) {
      sortCondition = [['name', 'ASC']]
    }

    const options = {
      where: [
        {
          [Op.or]: [
            { id_region: { [Op.like]: `%${keyword.trim()}%` } },
            { code: { [Op.like]: `%${keyword.trim()}%` } },
            { name: { [Op.like]: `%${keyword.trim()}%` } },
          ],
        },
      ],
      attributes: [
        'id_region',
        'uuid',
        'code',
        'name',
      ],
      order: sortCondition,
      limit: Number(paginate),
      offset: (page - 1) * Number(paginate),
    }

    const Model = models[model]
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

    // Check Region id exist
    const resRegionId = await Region.findOne({ where: { id_region: body.id_region }, attributes: ['id'] })
    if (resRegionId) return res.status(400).json({ message: 'Id region sudah digunakan' })

    // Check Region code exist
    const resRegionCode = await Region.findOne({ where: { code: body.code }, attributes: ['id'] })
    if (resRegionCode) return res.status(400).json({ message: 'Code region sudah digunakan' })

    body.uuid = crypto.randomUUID()
    body.created_by = user.id
    body.updated_by = user.id

    const data = await Model.create(body, { transaction: t })

    await t.commit()
    return res.status(201).json(data)
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
    const resRegion = await Region.findOne({ where: { uuid }, attributes: ['id_region', 'code'] })

    // check region code equal with region code request
    if (resRegion.code.toUpperCase() !== body.code.toUpperCase()) {
      // check region code exist
      const resRegionCode = await Region.findOne({ where: { code: body.code }, attributes: ['id'] })
      if (resRegionCode) return res.status(400).json({ message: 'Code region sudah digunakan' })
    }

    // check region id_region equal with id region request
    if (resRegion.id_region.toUpperCase() !== body.id_region.toUpperCase()) {
      // check id region exist
      const resRegionId = await Region.findOne({ where: { id_region: body.id_region }, attributes: ['id'] })
      if (resRegionId) return res.status(400).json({ message: 'Id region region sudah digunakan' })
    }

    body.code = body.code.toUpperCase()
    body.id_region = body.id_region.toUpperCase()
    body.updated_by = user.id

    data = await Model.update(body, { where: { uuid }, transaction: t })
    if (!data[0]) return res.status(404).json({ message: 'Region tidak ditemukan' })
    data = await Model.findOne({ where: { uuid }, attributes: ['uuid', 'id_region', 'code', 'name'], transaction: t })

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

    // check region exists in user sales office
    const resSalesOffice = await SalesOffice.findOne({
      include: {
        model: Region,
        attributes: ['uuid'],
      },
      attributes: ['id'],
      where: {
        '$Region.uuid$': uuid,
      },
      transaction: t,
    })
    if (resSalesOffice) {
      t.rollback()
      return res.status(400).json({ message: 'Region tidak dapat di hapus karena sudah ada di User Sales Office' })
    }

    const dataUpdate = {
      id_region: Sequelize.fn('CONCAT', Sequelize.col('id_region'), `-${uuid}`),
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
