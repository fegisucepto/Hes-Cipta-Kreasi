/* eslint-disable import/prefer-default-export */
import fs from 'fs/promises'
import models from '../models'

const { sequelize } = models

const attributesDefault = ['uuid', 'code']
const attributesDefaultDescription = [...attributesDefault, 'description']
const attributesModelDetail = {
  Region: [...attributesDefault, 'id_region', 'name'],
  SalesOrganization: attributesDefaultDescription,
  StorageLocation: [...attributesDefault, 'name'],
  DistributionChannel: attributesDefaultDescription,
}

export async function importData({
  req, res, next, saveDataExcel, saveDataCsv,
}) {
  const t = await sequelize.transaction()
  let filePath = ''
  try {
    const { model, file, user } = req
    const { filename } = file
    const Model = models[model]

    let resSaveData
    filePath = `./uploads/${filename}`

    if (filename.includes('xlsx')) {
      resSaveData = await saveDataExcel({
        filePath, Model, t, user,
      })
    } else if (filename.includes('csv')) {
      resSaveData = await saveDataCsv({
        filePath, Model, t, user,
      })
    } else {
      await t.rollback()
      return res.status(422).json({ message: 'format file harus xlsx atau csv' })
    }
    // delete temporary file from multer
    fs.unlink(filePath)
    if (resSaveData !== true) {
      await t.rollback()
      return res.status(422).json(resSaveData)
    }
    await t.commit()
    return res.status(200).json({ message: 'Import data berhasil' })
  } catch (err) {
    fs.unlink(filePath)
    await t.rollback()
    return next(err)
  }
}

export async function deleteData({
  Model, res, user, uuid, dataUpdate = {}, additionalResponse = {},
}) {
  const t = await sequelize.transaction()
  try {
    const body = {
      ...dataUpdate,
      deleted_by: user.id,
    }

    await Model.update(body, { where: { uuid }, transaction: t })
    const data = await Model.destroy({ where: { uuid }, transaction: t })
    if (!data) {
      t.rollback()
      return res.status(404).json({ message: 'Data tidak ditemukan' })
    }
    await t.commit()
    return res.status(200).json({ message: 'Success delete data', ...additionalResponse })
  } catch (error) {
    await t.rollback()
    return error
  }
}

export async function detail(req, res, next) {
  try {
    const { model, params } = req
    const { uuid } = params
    const Model = models[model]

    const options = {
      where: { uuid },
      attributes: attributesModelDetail[model],
    }

    const data = await Model.findOne(options)
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' })

    return res.status(200).json(data)
  } catch (err) {
    return next(err)
  }
}
