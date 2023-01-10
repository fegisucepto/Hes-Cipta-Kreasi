/* eslint-disable import/prefer-default-export */

const OPTION_STRING_MANDATORY = {
  type: String,
  required: true,
}

export const SCHEMA_IMPORT_REGION = {
  'ID Region': {
    prop: 'id_region',
    ...OPTION_STRING_MANDATORY,
  },
  'Region Code': {
    prop: 'code',
    ...OPTION_STRING_MANDATORY,
  },
  'Region Name': {
    prop: 'name',
    ...OPTION_STRING_MANDATORY,
  },
}

export const SCHEMA_IMPORT_SALES_OFFICE = {
  Code: {
    prop: 'code',
    ...OPTION_STRING_MANDATORY,
  },
  'Region ID': {
    prop: 'region_id',
    ...OPTION_STRING_MANDATORY,
  },
  Name: {
    prop: 'name',
    ...OPTION_STRING_MANDATORY,
  },
}

export const SCHEMA_IMPORT_STORAGE_LOCATION = {
  'Storage Location Code': {
    prop: 'code',
    ...OPTION_STRING_MANDATORY,
  },
  'Storage Location Name': {
    prop: 'name',
    ...OPTION_STRING_MANDATORY,
  },
}

export async function checkDataExcel(rows) {
  // check rows kosong atau tidak
  const errors = {}
  if (!rows.rows[0]) {
    return { message: 'Dokumen tidak sesuai template' }
  }
  if (rows.errors[0]) {
    await rows.errors.forEach((item) => {
      errors[item.column] = `${item.column} ${item.error}`
    })
    return { message: 'Dokumen tidak sesuai template', errors }
  }
  return true
}

export function getErrorReadExcel(err) {
  let message = ''
  if (err?.fields) {
    if (err?.fields[0]) message = `'${err?.fields[0]}' tidak ditemukan`
  }
  if (err?.errors !== undefined) message = `'${err.errors[0].path}' duplicate data`
  if (err?.original?.sqlMessage?.includes(' doesn\'t have a default value')) {
    message = `Data ${
      err?.original?.sqlMessage
        .replace('Field ', '')
        .replace(' doesn\'t have a default value', '')
    } tidak ditemukan di database`
  }
  if (err?.original?.sqlMessage?.includes(' cannot be null')) {
    message = `Data ${
      err?.original?.sqlMessage
        .replace('Column ', '')
        .replace(' cannot be null', '')
    } tidak ditemukan di database`
  }
  if (!message) message = 'Dokumen tidak sesuai template.'

  return { message }
}
