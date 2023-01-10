/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/**
 * @module controllers/fileController
 *
*/
import fs from 'fs/promises'
import { Sequelize } from 'sequelize'
import { FLAG_NUMBER_KEY } from '../helpers/constants'
import models from '../models'

const { Invoice, CollectionPaymentManifest, PaymentGiroFile } = models

const PATH_FILE = './uploads/'

const reponseNotFound = (res, message = 'File tidak ditemukan') => res.status(404).json({ message })
const reponseSuccess = (res, filePath, originalFilename) => (
  res.status(200).download(filePath, originalFilename)
)

export async function getFile(req, res, next) {
  try {
    const { model, params } = req
    const { uuid } = params
    const Model = models[model]
    let responseFlag = true

    const resFile = await Model.findOne({ where: { uuid } })
    if (!resFile) return reponseNotFound(res)

    const filePath = `./uploads/${resFile.filename}`
    await fs.access(filePath).catch(() => { responseFlag = false })
    if (!responseFlag) return reponseNotFound(res)

    return reponseSuccess(res, filePath, resFile.original_filename)
  } catch (err) {
    return next(err)
  }
}

export async function getFileCollectionPaymentZip(req, res, next) {
  try {
    const { model, query } = req
    const { invoice_uuid, collection_payment_uuid } = query
    const Model = models[model]
    const files = []

    const resFile = await Model.findAll({
      include: [
        { model: Invoice, attributes: [] },
        { model: CollectionPaymentManifest, attributes: [] },
      ],
      attributes: [
        'uuid', 'filename', 'original_filename',
        [Sequelize.col('Invoice.invoice_number'), 'invoiceNumber'],
        [Sequelize.col('CollectionPaymentManifest.collection_number'), 'collectionNumber']],
      where: {
        '$Invoice.uuid$': invoice_uuid,
        '$CollectionPaymentManifest.uuid$': collection_payment_uuid,
      },
    })
    if (!resFile[0]) return reponseNotFound(res)

    const { invoiceNumber, collectionNumber } = resFile[0].dataValues
    for (const item of resFile) {
      files.push({ path: PATH_FILE + item.filename, name: item.original_filename })
    }
    return res.zip({
      files,
      filename: `Document ${collectionNumber} Invoice ${invoiceNumber}.zip`,
    })
  } catch (err) {
    return next(err)
  }
}

export async function getFileInvoiceZip(req, res, next) {
  try {
    const { model, query } = req
    const { invoice_uuid, type } = query
    const Model = models[model]
    const files = []

    const resFile = await Model.findAll({
      include: { model: Invoice, attributes: [] },
      attributes: [
        'uuid', 'type', 'filename', 'original_filename',
        [Sequelize.col('Invoice.invoice_number'), 'invoiceNumber']],
      where: { '$Invoice.uuid$': invoice_uuid, type },
    })
    if (!resFile[0]) return reponseNotFound(res)

    const { invoiceNumber } = resFile[0].dataValues
    for (const item of resFile) {
      files.push({ path: PATH_FILE + item.filename, name: item.original_filename })
    }
    return res.zip({
      files,
      filename: `Document ${invoiceNumber} ${FLAG_NUMBER_KEY[type].replace(/_/g, ' ')}.zip`,
    })
  } catch (err) {
    return next(err)
  }
}

export async function getFilePaymentGiroZip(req, res, next) {
  try {
    const { model, query } = req
    const { payment_uuid } = query
    const Model = models[model]
    const files = []

    const resPayment = await Model.findOne({
      include: { model: Invoice },
      attributes: ['id', [Sequelize.col('Invoice.invoice_number'), 'invoiceNumber']],
      where: { uuid: payment_uuid },
    })
    if (!resPayment) return reponseNotFound(res, 'Giro tidak ditemukan')

    const resFile = await PaymentGiroFile.findAll({
      attributes: ['uuid', 'filename', 'original_filename'],
      where: { payment_id: resPayment.id },
    })
    if (!resFile[0]) return reponseNotFound(res)

    const { invoiceNumber } = resPayment.dataValues
    for (const item of resFile) {
      files.push({ path: PATH_FILE + item.filename, name: item.original_filename })
    }
    return res.zip({
      files,
      filename: `Document Giro ${invoiceNumber}.zip`,
    })
  } catch (err) {
    return next(err)
  }
}

export async function getFileListInvoiceError(req, res, next) {
  try {
    const { uuid } = req.params

    let responseFlag = true
    const filePath = `./uploads/${uuid}.xlsx`
    await fs.access(filePath).catch(() => { responseFlag = false })
    if (!responseFlag) return reponseNotFound(res)

    return reponseSuccess(res, filePath, 'List Invoice Error.xlsx')
  } catch (err) {
    return next(err)
  }
}

export async function getFilePayment(req, res, next) {
  try {
    const { model, params } = req
    const { uuid } = params

    const Model = models[model]

    const resFile = await Model.findOne({
      attributes: [
        'transfer_original_file',
        'transfer_file',
        'discount_original_file',
        'discount_file',
      ],
      where: { uuid },
    })
    if (!resFile) return reponseNotFound(res)

    const fileName = resFile.transfer_original_file || resFile.discount_original_file
    const fileNameOriginal = resFile.transfer_file || resFile.discount_file
    const filePath = `./uploads/${fileName}`
    return reponseSuccess(res, filePath, fileNameOriginal)
  } catch (err) {
    return next(err)
  }
}
