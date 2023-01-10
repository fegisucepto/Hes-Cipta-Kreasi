/* eslint-disable import/prefer-default-export */
export const OPTIONS_READ_CSV = {
  delimiter: ',',
  encoding: 'utf8',
  log: true,
  parse: true,
  stream: false,
}

export function getErrorReadCSV(error) {
  if (error.fields) {
    return { message: `Column '${Object.keys(error.fields)}' duplicate data` }
  }
  return { message: 'Dokumen tidak sesuai template' }
}
