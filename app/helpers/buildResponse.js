/* eslint-disable space-before-blocks */
/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */
import { getDefaultValueNumber } from './number'
import { getDefferentDate } from './time'

const addIsConfirmLashClearing = (returnItem) => (
  returnItem?.dataValues?.CollectionPaymentInvoices
    ? returnItem?.dataValues?.CollectionPaymentInvoices[0].is_confirm_lash_clearing : '')

const sortDescriptionPermission = (dataPermission) => (
  dataPermission.sort((a, b) => (a.description === null) - (b.description === null))
)

export function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
}

export function lastTypeSubmitPayment(historyPayment) {
  const response = []
  const tempType = []
  for (const item of historyPayment) {
    if (!tempType.includes(item.type)) {
      tempType.push(item.type)
      response.push(removeEmpty(item.dataValues))
    }
    if (tempType.length >= 3) break
  }
  return response
}

export async function buildDataCollection(resCollectionManifest, dataInvoice) {
  const response = resCollectionManifest
  const responseInvoice = dataInvoice
  let overallOutstandingValue = 0
  let overallReturnValue = 0

  await responseInvoice.map((item) => {
    const returnItem = item
    const dateNow = new Date()
    const dateData = returnItem.dataValues.last_update_status
      ? returnItem.dataValues.last_update_status : returnItem.dataValues.created_at
    const aging = getDefferentDate(dateNow, dateData)
    const outstandingValue = getDefaultValueNumber(item.outstanding_value)
    const returnValueCurr = getDefaultValueNumber(item.return_value)
    const returnValuePrev = getDefaultValueNumber(item.return_value_previous_invoice)
    returnItem.dataValues.is_confirm_lash_clearing = addIsConfirmLashClearing(returnItem)
    returnItem.dataValues.aging = aging
    returnItem.dataValues.last_payment = lastTypeSubmitPayment(returnItem.dataValues.Payments)
    overallOutstandingValue += outstandingValue
    overallReturnValue += (returnValueCurr + returnValuePrev)
    delete returnItem.dataValues.CollectionPaymentInvoices
    delete returnItem.dataValues.Payments
    delete returnItem.dataValues.id
    return returnItem
  })
  // menambah data response
  response.dataValues.overall_outstanding_value = overallOutstandingValue.toString()
  response.dataValues.overall_return_value = overallReturnValue.toString()
  response.dataValues.Invoice = responseInvoice
  response.dataValues.printed_at = new Date()
  delete response.dataValues.id

  return response
}

export function buildDataInvoiceFiles(invoiceFiles) {
  const response = []
  let type = 0
  for (const item of invoiceFiles) {
    const index = response.length - 1
    if (item.type !== type) {
      type = item.type
      response.push({
        type: item.type,
        files: [
          {
            uuid: item.uuid,
            filename: item.filename,
            original_filename: item.original_filename,
            size: item.size,
          },
        ],
      })
    } else {
      response[index].files.push({
        uuid: item.uuid,
        filename: item.filename,
        original_filename: item.original_filename,
        size: item.size,
      })
    }
  }
  return response
}

export function buildDataPermission(dataPermission) {
  return {
    Invoice: dataPermission.Invoice,
    'Shipment Manifest': sortDescriptionPermission(dataPermission['Shipment Manifest']),
    'Collection Manifest': sortDescriptionPermission(dataPermission['Collection Manifest']),
    'Collection Manifest Payment': sortDescriptionPermission(dataPermission['Collection Manifest Payment']),
    'User Management': dataPermission['User Management'],
    'Driver Master': dataPermission['Driver Master'],
    'Collector Master': dataPermission['Collector Master'],
    'Sales Organization (SO)': dataPermission['Sales Organization (SO)'],
    'Distribution Channel (DC)': dataPermission['Distribution Channel (DC)'],
    'Storage Location': dataPermission['Storage Location'],
    'Sales Office': dataPermission['Sales Office'],
    Region: dataPermission.Region,
    Client: dataPermission.Client,
    Customer: dataPermission.Customer,
    'Mapping SO & DC': dataPermission['Mapping SO & DC'],
    'Report Notification': dataPermission['Report Notification'],
    'Deletion History': dataPermission['Deletion History'],
    'Pending Delivery': dataPermission['Pending Delivery'],
    'Pending POD': dataPermission['Pending POD'],
    'Pending Faktur Pajak': dataPermission['Pending Faktur Pajak'],
    'Pending Tukar Faktur': dataPermission['Pending Tukar Faktur'],
    'Pending Payment Processing': dataPermission['Pending Payment Processing'],
    'Pending Clearing SAP': dataPermission['Pending Clearing SAP'],
    Report: dataPermission.Report,
    'Document Audit': dataPermission['Document Audit'],
  }
}
