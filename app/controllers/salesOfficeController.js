/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/**
 * @module controllers/roleController
 *
*/
import crypto from 'crypto'
import readCsvFile from 'csvdata'
import readXlsxFile from 'read-excel-file/node'
import { Sequelize, Op } from 'sequelize'
import models from '../models'
import listResponse from '../helpers/listResponse'
import { USER_ROLE } from '../helpers/constants'
import { checkDataExcel, getErrorReadExcel, SCHEMA_IMPORT_SALES_OFFICE } from '../sevices/readExcel'
import { getErrorReadCSV, OPTIONS_READ_CSV } from '../sevices/csv'
import { deleteData, importData } from './commonController'
import { checkDefaultQueryVariabel, checkDefaultSortVariable, checkDefaultValueVariabel } from '../helpers/variable'

const {
  sequelize, Region, SalesOffice,
} = models

const getRegion = async (idRegion) => {
  const result = await Region.findAll({ where: { id_region: idRegion }, attributes: ['id', 'id_region'] })
  const map = new Map()
  for (const item of result) {
    map.set(item.id_region, item.id)
  }

  return map
}

const saveDataExcel = async ({ filePath, Model, t }) => {
  let message
  const data = []
  const schema = SCHEMA_IMPORT_SALES_OFFICE
  await readXlsxFile(filePath, { schema }).then(async (rows) => {
    // check rows kosong atau tidak
    const resCheckDataExcel = await checkDataExcel(rows)
    if (resCheckDataExcel !== true) {
      message = resCheckDataExcel
      return message
    }
    const RegionMap = await getRegion(
      rows.rows.map((item) => item.region_id),
    )
    // re map data and find id from id region
    for (const item of rows.rows) {
      data.push({
        uuid: crypto.randomUUID(),
        ...item,
        region_id: RegionMap.get(item.region_id),
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

    const RegionMap = await getRegion(
      dataCsv.map((item) => item['Region ID']),
    )

    for (const item of dataCsv) {
      data.push({
        uuid: crypto.randomUUID(),
        code: item.Code,
        region_id: RegionMap.get(item['Region ID']),
        name: item.Name,
      })
    }
    await Model.bulkCreate(data, { transaction: t })
    return true
  } catch (err) {
    return getErrorReadCSV(err)
  }
}

export async function downloadExample(req, res, next) {
  try {
    const { type } = req.query
    let file = './public/TemplateSalesOffice.xlsx'
    if (type === 'csv') file = './public/TemplateSalesOffice.csv'
    return res.download(file) // Set disposition and send it.
  } catch (err) {
    return next(err)
  }
}

export async function importSalesOffice(req, res, next) {
  return importData({
    req, res, next, saveDataExcel, saveDataCsv,
  })
}

export async function list(req, res, next) {
  try {
    const { user, query, model } = req
    let { page, paginate } = query
    const { keyword = '' } = query
    const Model = models[model]

    const codeSort = query.code_sort
    const nameSort = query.name_sort
    const idRegionSort = query.idregion_sort
    const regionCodeSort = query.regioncode_sort
    const regionNameSort = query.regionname_sort
    const regionUuid = checkDefaultValueVariabel(query.region_uuid)

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

    // filter list
    const codeSortCondition = checkDefaultSortVariable(codeSort, 'code')
    const nameSortCondition = checkDefaultSortVariable(nameSort, 'name')
    const regionUuidCondition = checkDefaultQueryVariabel(regionUuid, '$Region.uuid$')
    const idRegionCondition = checkDefaultSortVariable(idRegionSort, 'id_region', [Region])
    const regionCodeCondition = checkDefaultSortVariable(regionCodeSort, 'code', [Region])
    const regionNameCondition = checkDefaultSortVariable(regionNameSort, 'name', [Region])

    // filter Sales office di user
    const salesOfficeMap = user.SalesOffices.map((item) => item.uuid)
    let salesOfficeUuidCondition = [{ uuid: salesOfficeMap }]
    if (user.role_id === USER_ROLE.ADMIN || user.role_id === USER_ROLE.SUPERADMIN) {
      salesOfficeUuidCondition = []
    }

    const options = {
      include: [{
        model: Region,
        attributes: ['id_region', 'uuid', 'code', 'name'],
        required: true,
      },
      ],
      where: [
        {
          [Op.or]: [
            { code: { [Op.like]: `%${keyword.trim()}%` } },
            { name: { [Op.like]: `%${keyword.trim()}%` } },
            { '$Region.id_region$': { [Op.like]: `%${keyword.trim()}%` } },
            { '$Region.code$': { [Op.like]: `%${keyword.trim()}%` } },
            { '$Region.name$': { [Op.like]: `%${keyword.trim()}%` } },
          ],
        },
        ...regionUuidCondition,
        ...salesOfficeUuidCondition,
      ],
      order: [
        ...codeSortCondition,
        ...nameSortCondition,
        ...idRegionCondition,
        ...regionCodeCondition,
        ...regionNameCondition,
      ],
      attributes: [
        'uuid',
        'code',
        'name',
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
    let data = {}

    // Check sales office code exist
    const resSalesOffice = await SalesOffice.findOne({ where: { code: body.code }, attributes: ['id'] })
    if (resSalesOffice) {
      await t.rollback()
      return res.status(400).json({ message: 'Code sales office sudah digunakan' })
    }

    // Get region data by uuid
    const resRegion = await Region.findOne({ where: { uuid: body.region_uuid }, attributes: ['id'] })
    if (!resRegion) {
      await t.rollback()
      return res.status(404).json({ message: 'Region tidak ditemukan' })
    }

    body.uuid = crypto.randomUUID()
    body.created_by = user.id
    body.updated_by = user.id
    body.region_id = resRegion.id

    data = await Model.create(body, { transaction: t })

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

    const options = {
      include: {
        model: Region,
        attributes: ['id_region', 'uuid', 'code', 'name'],
      },
      where: { uuid },
      attributes: ['uuid', 'code', 'name'],
    }

    const data = await Model.findOne(options)
    if (!data) return res.status(404).json({ message: 'Sales Office tidak ditemukan' })

    return res.status(200).json(data)
  } catch (err) {
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
    const resSalesOffice = await Model.findOne({
      where: {
        uuid: { [Op.ne]: uuid },
        code: body.code.toUpperCase(),
      },
      attributes: ['code'],
      transaction: t,
    })
    // check code exist
    if (resSalesOffice) {
      t.rollback()
      return res.status(400).json({ message: 'Code sales office sudah digunakan' })
    }

    // get region id
    const resRegion = await Region.findOne({ where: { uuid: body.region_uuid }, attributes: ['id'] })
    if (!resRegion) return res.status(404).json({ message: 'Region tidak ditemukan' })

    body.code = body.code.toUpperCase()
    body.region_id = resRegion.id
    body.updated_by = user.id

    data = await Model.update(body, { where: { uuid }, transaction: t })
    if (!data[0]) return res.status(404).json({ message: 'Sales Office tidak ditemukan' })
    data = await Model.findOne(
      {
        include: {
          model: Region,
          attributes: ['uuid', 'code', 'name'],
        },
        where: { uuid },
        attributes: ['uuid', 'code', 'name'],
        transaction: t,
      },
    )

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
