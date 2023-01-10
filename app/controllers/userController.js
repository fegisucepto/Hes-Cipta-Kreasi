/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
/**
 * @module controllers/userController
 *
*/
import crypto from 'crypto'
import { Sequelize, Op, QueryTypes } from 'sequelize'
import models from '../models'
import listResponse from '../helpers/listResponse'
import { USER_ROLE } from '../helpers/constants'
import { convertArrayToString, getDefaultQueryMulti } from '../helpers/string'
import { checkDefaultValueStringVariabel, checkViewAllFilter } from '../helpers/variable'

const {
  SalesOffice,
  Role,
  StorageLocation,
  UserSalesOffice,
  UserStorageLocation,
  UserSalesOrganization,
  SalesOrganization,
  History,
  Shipment,
} = models
const { sequelize } = models

const checkQueryWhere = (uuids) => (uuids[0] === '*' ? 'WHERE deleted_at IS NULL' : 'WHERE uuid IN (:uuid)')

const getAndSaveUserSalesStorage = async (
  dataUser,
  bodySalesOffice,
  bodyStorageLocation,
  bodySalesOrganization,
  t,
) => {
  // find data sales dan storage
  const querySalesOffice = `SELECT id AS sales_office_id, :user_id AS user_id FROM sales_offices ${checkQueryWhere(bodySalesOffice)}`
  const dataSalesOffice = await sequelize.query(querySalesOffice,
    {
      replacements: {
        user_id: dataUser.id,
        uuid: bodySalesOffice,
      },
      type: QueryTypes.SELECT,
      transaction: t,
    })
  if (dataSalesOffice.length !== bodySalesOffice.length && bodySalesOffice[0] !== '*') {
    return { status: false, message: 'Sales Office tidak ditemukan' }
  }
  const queryStorageLocation = `SELECT id AS storage_location_id, :user_id AS user_id FROM storage_locations ${checkQueryWhere(bodyStorageLocation)}`
  const dataStorageLocation = await sequelize.query(queryStorageLocation,
    {
      replacements: {
        user_id: dataUser.id,
        uuid: bodyStorageLocation,
      },
      type: QueryTypes.SELECT,
      transaction: t,
    })
  if (dataStorageLocation.length !== bodyStorageLocation.length && bodyStorageLocation[0] !== '*') {
    return { status: false, message: 'Storage location tidak ditemukan' }
  }
  const querySalesOrganization = `SELECT id AS sales_organization_id, :user_id AS user_id FROM sales_organizations ${checkQueryWhere(bodySalesOrganization)}`
  const dataSalesOrganization = await sequelize.query(querySalesOrganization,
    {
      replacements: {
        user_id: dataUser.id,
        uuid: bodySalesOrganization,
      },
      type: QueryTypes.SELECT,
      transaction: t,
    })
  if (dataSalesOrganization.length !== bodySalesOrganization.length && bodySalesOrganization[0] !== '*') {
    return { status: false, message: 'Sales Organization tidak ditemukan' }
  }
  // bulk insert in user_sales and user_storage
  await UserSalesOffice.bulkCreate(dataSalesOffice, { transaction: t })
  await UserStorageLocation.bulkCreate(dataStorageLocation, { transaction: t })
  await UserSalesOrganization.bulkCreate(dataSalesOrganization, {
    transaction: t,
  })
  return { status: true }
}

const runRawQuery = async (req, query) => {
  const { page = 1, paginate = 10, keyword = '' } = req.query
  return sequelize.query(query, {
    replacements: {
      keyword: `%${keyword.trim()}%`,
      role_superadmin: USER_ROLE.SUPERADMIN,
      is_active: getDefaultQueryMulti(req.query.is_active),
      role_uuid: getDefaultQueryMulti(req.query.role_uuid),
      sales_office_uuid: getDefaultQueryMulti(req.query.salesOfficeCondition),
      sales_organization_uuid: getDefaultQueryMulti(req.query.salesOrganizationCondition),
      storage_location_uuid: getDefaultQueryMulti(req.query.storageLocationCondition),
      limit: Number(paginate),
      offset: (page - 1) * Number(paginate),
    },
    type: QueryTypes.SELECT,
  })
}

export async function create(req, res, next) {
  const t = await sequelize.transaction()
  try {
    const { model, user, body } = req
    const Model = models[model]

    const bodySalesOffice = body.sales_office_uuid
    const bodySalesOrganization = body.sales_organization_uuid
    const bodyStorageLocation = body.storage_location_uuid
    const bodyRole = body.role_uuid

    let dataUser = {}
    let resSaveSalesStorage = {}

    // get id role
    const resRole = await Role.findOne({
      where: { uuid: body.role_uuid },
      attributes: ['id'],
      transaction: t,
    })

    if (user.role_id !== USER_ROLE.SUPERADMIN && resRole.id === USER_ROLE.SUPERADMIN) {
      await t.rollback()
      return res.status(403).json({ message: 'No access for the selected role' })
    }

    // tambah data user
    req.body.role_id = resRole.id
    req.body.uuid = crypto.randomUUID()
    req.body.created_by = user.id
    req.body.created_at = new Date()
    req.body.updated_by = user.id
    req.body.updated_at = new Date()

    // create data user
    dataUser = await Model.create(req.body, { transaction: t })
    resSaveSalesStorage = await getAndSaveUserSalesStorage(
      dataUser,
      bodySalesOffice,
      bodyStorageLocation,
      bodySalesOrganization,
      t,
    )
    if (!resSaveSalesStorage.status) {
      await t.rollback()
      delete resSaveSalesStorage.status
      return res.status(400).json(resSaveSalesStorage)
    }

    const dataRole = await Role.findOne({
      attributes: [
        'uuid',
        'name',
      ],
      where: { uuid: bodyRole },
    })

    const dataSalesOffice = await SalesOffice.findOne({
      attributes: [
        'uuid',
        'code',
        'name',
      ],
      where: { uuid: bodySalesOffice },
    })

    const dataSalesOrganization = await SalesOrganization.findOne({
      attributes: [
        'uuid',
        'code',
        'description',
      ],
      where: { uuid: bodySalesOrganization },
    })

    const dataStorageLocation = await StorageLocation.findOne({
      attributes: [
        'uuid',
        'code',
        'name',
      ],
      where: { uuid: bodyStorageLocation },
    })

    await t.commit()
    // delete beberapa data response
    delete dataUser.dataValues.id
    delete dataUser.dataValues.password
    delete dataUser.dataValues.role_id
    delete dataUser.dataValues.created_by
    delete dataUser.dataValues.updated_by

    const ResdataUser = {
      ...dataUser.dataValues,
      Role: [dataRole.dataValues],
      SalesOffices: [dataSalesOffice.dataValues],
      StorageLocation: [dataStorageLocation.dataValues],
      SalesOrganization: [dataSalesOrganization.dataValues],
    }

    return res.status(200).json(ResdataUser)
  } catch (err) {
    await t.rollback()
    return next(err)
  }
}

export async function list(req, res, next) {
  try {
    const { page = 1, paginate = 10 } = req.query
    // filter
    const storageLocationMap = convertArrayToString(req.user.StorageLocations)
    const salesOfficeMap = convertArrayToString(req.user.SalesOffices)
    const salesOrganizationeMap = convertArrayToString(req.user.SalesOrganizations)

    let salesOfficeCondition = checkDefaultValueStringVariabel(req.query.sales_office_uuid)
    let salesOrganizationCondition = checkDefaultValueStringVariabel(req.query.sales_organization_uuid)
    let storageLocationCondition = checkDefaultValueStringVariabel(req.query.storage_location_uuid)

    salesOfficeCondition = checkViewAllFilter(req.user, salesOfficeCondition, salesOfficeMap)
    salesOrganizationCondition = checkViewAllFilter(req.user, salesOrganizationCondition, salesOrganizationeMap)
    storageLocationCondition = checkViewAllFilter(req.user, storageLocationCondition, storageLocationMap)
    // insert data ke req.query
    req.query.salesOfficeCondition = salesOfficeCondition
    req.query.salesOrganizationCondition = salesOrganizationCondition
    req.query.storageLocationCondition = storageLocationCondition

    const column = `
        DISTINCT
        users.uuid, 
        users.firstname, 
        users.lastname, 
        users.email, 
        users.mobile_phone, 
        ( 
            SELECT GROUP_CONCAT(so.name SEPARATOR ', ' limit 3) 
            FROM user_sales_offices 
            JOIN sales_offices so ON so.id = user_sales_offices.sales_office_id
            WHERE user_sales_offices.user_id = users.id
            GROUP BY user_id
        ) as sales_offices,
        ( 
          SELECT GROUP_CONCAT(so.description SEPARATOR ', ' limit 3) 
          FROM user_sales_organizations 
          JOIN sales_organizations so ON so.id = user_sales_organizations.sales_organization_id
          WHERE user_sales_organizations.user_id = users.id
          GROUP BY user_id
        ) as sales_organizations,
        ( 
          SELECT GROUP_CONCAT(so.name SEPARATOR ', ' limit 3) 
          FROM user_storage_locations 
          JOIN storage_locations so ON so.id = user_storage_locations.storage_location_id
          WHERE user_storage_locations.user_id = users.id
          GROUP BY user_id
        ) as storage_locations,
        roles.uuid AS role_uuid,
        roles.name AS role_name,
        users.is_active,
        users.created_at
      `
    let query = `
      SELECT
        ${column}
      FROM users 
      JOIN roles ON users.role_id = roles.id
      `
    // where condition
    let filterQuery = `
        WHERE users.deleted_at is null AND (
          users.firstname LIKE :keyword OR 
          users.lastname LIKE :keyword OR 
          users.email LIKE :keyword OR 
          users.mobile_phone LIKE :keyword
        )
      `
    if (req.user.role_id !== USER_ROLE.SUPERADMIN) filterQuery += ' AND users.role_id != :role_superadmin '
    if (req.query.is_active) filterQuery += ' AND users.is_active IN (:is_active) '
    if (req.query.role_uuid) filterQuery += ' AND roles.uuid IN (:role_uuid) '
    if (salesOfficeCondition) {
      query += `
        JOIN user_sales_offices ON users.id = user_sales_offices.user_id 
        JOIN sales_offices ON user_sales_offices.sales_office_id = sales_offices.id 
      `
      filterQuery += ' AND sales_offices.uuid IN (:sales_office_uuid) '
    }
    if (salesOrganizationCondition) {
      query += `
        JOIN user_sales_organizations ON users.id = user_sales_organizations.user_id 
        JOIN sales_organizations ON user_sales_organizations.sales_organization_id = sales_organizations.id
      `
      filterQuery += ' AND sales_organizations.uuid IN (:sales_organization_uuid) '
    }
    if (storageLocationCondition) {
      query += `
        JOIN user_storage_locations ON users.id = user_storage_locations.user_id 
        JOIN storage_locations ON user_storage_locations.storage_location_id = storage_locations.id
      `
      filterQuery += ' AND storage_locations.uuid IN (:storage_location_uuid) '
    }

    query += filterQuery
    const docs = await runRawQuery(req, `${query} ORDER BY users.created_at DESC limit :limit offset :offset`)
    query = query.replace(column, ' COUNT(DISTINCT users.uuid) AS count ')
    const total = await runRawQuery(req, query)

    return res.status(200).json(listResponse(total[0].count, +page, +paginate, docs))
  } catch (error) {
    return next(error)
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

    const bodySalesOffice = body.sales_office_uuid
    const bodySalesOrganization = body.sales_organization_uuid
    const bodyStorageLocation = body.storage_location_uuid
    const bodyRole = body.role_uuid

    let dataUser = {}
    let resSaveSalesStorage = {}

    const resRole = await Role.findOne({
      where: { uuid: body.role_uuid },
      attributes: ['id'],
    })

    if (user.role_id !== USER_ROLE.SUPERADMIN && resRole.id === USER_ROLE.SUPERADMIN) {
      await t.rollback()
      return res.status(403).json({ message: 'No access for the selected role' })
    }

    body.role_id = resRole.id
    body.updated_by = user.id
    body.updated_at = new Date()

    // jika tidak ada body password
    if (!body.password) delete body.password

    // update data user
    dataUser = await Model.update(body, { where: { uuid }, transaction: t })
    if (!dataUser) { return res.status(404).json({ message: 'User tidak ditemukan' }) }
    // find data user
    dataUser = await Model.findOne({ where: { uuid }, transaction: t })
    // delete user data sales, organization dan storage sebelumya
    await UserSalesOffice.destroy({ where: { user_id: dataUser.id }, force: true, transaction: t })
    await UserStorageLocation.destroy({ where: { user_id: dataUser.id }, force: true, transaction: t })
    await UserSalesOrganization.destroy({ where: { user_id: dataUser.id }, force: true, transaction: t })
    // find and save sales, organization and storage id
    resSaveSalesStorage = await getAndSaveUserSalesStorage(
      dataUser,
      bodySalesOffice,
      bodyStorageLocation,
      bodySalesOrganization,
      t,
    )
    if (!resSaveSalesStorage.status) {
      await t.rollback()
      delete resSaveSalesStorage.status
      return res.status(400).json(resSaveSalesStorage)
    }

    const resDataRole = await Role.findOne({
      attributes: [
        'uuid',
        'name',
      ],
      where: { uuid: bodyRole },
    })

    const resDataSalesOffice = await SalesOffice.findOne({
      attributes: [
        'uuid',
        'code',
        'name',
      ],
      where: { uuid: bodySalesOffice },
    })

    const resDataSalesOrganization = await SalesOrganization.findOne({
      attributes: [
        'uuid',
        'code',
        'description',
      ],
      where: { uuid: bodySalesOrganization },
    })

    const resDataStorageLocation = await StorageLocation.findOne({
      attributes: [
        'uuid',
        'code',
        'name',
      ],
      where: { uuid: bodyStorageLocation },
    })

    await t.commit()

    delete dataUser.dataValues.password
    delete dataUser.dataValues.role_id
    delete dataUser.dataValues.id

    const ResdataUser = {
      ...dataUser.dataValues,
      Role: [resDataRole.dataValues],
      SalesOffices: [resDataSalesOffice.dataValues],
      StorageLocation: [resDataStorageLocation.dataValues],
      SalesOrganization: [resDataSalesOrganization.dataValues],
    }

    return res.status(200).json(ResdataUser)
  } catch (err) {
    await t.rollback()
    return next(err)
  }
}

export async function updateStatus(req, res, next) {
  const t = await sequelize.transaction()
  try {
    const {
      model, user, params, body,
    } = req
    const { uuid } = params
    const Model = models[model]

    body.updated_by = user.id

    const resUser = await Model.findOne({ where: { uuid }, attributes: ['id'], transaction: t })
    let data = await Model.findByPk(resUser.id)
    data = await data.update(body, { transaction: t })
    if (!data) return res.json(404, { message: t('404') })

    if (data.dataValues.password) delete data.dataValues.password

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
      include: [
        {
          model: Role,
          attributes: ['uuid', 'name'],
        },
        {
          model: SalesOffice,
          attributes: ['uuid', 'code', 'name'],
          through: { attributes: [] },
        },
        {
          model: SalesOrganization,
          attributes: ['uuid', 'code', 'description'],
          through: { attributes: [] },
        },
        {
          model: StorageLocation,
          attributes: ['uuid', 'code', 'name'],
          through: { attributes: [] },
        },
      ],
      attributes: [
        'uuid',
        'firstname',
        'lastname',
        'email',
        'mobile_phone',
        'is_active',
        'last_login',
        'created_at',
      ],
    }

    const resUser = await Model.findOne({ where: { uuid }, attributes: ['id'] })
    if (!resUser) return res.status(404).json({ message: 'User tidak ditemukan' })
    const data = await Model.findByPk(resUser.id, options)

    return res.status(200).json(data)
  } catch (err) {
    return next(err)
  }
}

export async function destroy(req, res, next) {
  const t = await sequelize.transaction()

  try {
    const { model, user, params } = req
    const { uuid } = params
    const Model = models[model]

    let data = {}
    let resUser = {}
    let resHistory = {}
    let resShipment = {}
    const body = {}

    body.email = Sequelize.fn('CONCAT', Sequelize.col('email'), `-${uuid}`)
    body.deleted_by = user.id

    resUser = await Model.findOne({ where: { uuid }, attributes: ['id'] })
    resHistory = await History.findOne({
      where: { user_id: resUser.id },
      attributes: ['id'],
    })
    resShipment = await Shipment.findOne({
      where: [
        {
          [Op.or]: [{ created_by: resUser.id }, { updated_by: resUser.id }],
        },
      ],
      attributes: ['id'],
    })
    if (resShipment || resHistory) {
      t.rollback()
      return res.status(400).json({
        message: 'User tidak dapat di hapus karena sudah ada di invoice',
      })
    }

    data = await Model.findByPk(resUser.id || null)
    if (!data) return res.status(404).json({ message: 'User tidak ditemukan' })

    await data.update(body, { transaction: t })
    await data.destroy({ transaction: t })
    await t.commit()

    return res.status(200).json({ message: 'Success delete data' })
  } catch (err) {
    await t.rollback()
    return next(err)
  }
}
