/* eslint-disable import/prefer-default-export */

export function getDefaultQueryMulti(text) {
  return text ? text.split(',') : ''
}

export function getDefaultVariableText(text, defaultText = '') {
  return text || defaultText
}

export function convertArrayToString(dataArray, separator = ',') {
  if (typeof dataArray[0] === 'object') {
    return (dataArray.map((item) => item.uuid)).join(separator)
  }
  return dataArray ? dataArray.join(separator) : ''
}
