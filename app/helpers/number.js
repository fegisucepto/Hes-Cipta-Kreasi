/* eslint-disable import/prefer-default-export */

const removeDotInValueType = (value, defaultValue = 0) => (
  value ? Number(`${value}`.replace(/[.,\s]/g, '')) : defaultValue
)

// Enumerate number abbreviations
export function abbreviationNumber(value) {
  const valueNumber = Number(value)
  const suffixes = ['', 'K', 'M', 'B', 'T']
  const suffixNum = Math.floor((`${valueNumber}`).length / 3)
  let shortValue = parseFloat(
    // eslint-disable-next-line no-restricted-properties
    (suffixNum !== 0 ? (valueNumber / Math.pow(1000, suffixNum)) : valueNumber).toPrecision(2),
  )
  if (shortValue % 1 !== 0) {
    shortValue = shortValue.toFixed(1)
  }
  return shortValue + suffixes[suffixNum]
}

// get random int
export function getRandomNumber() {
  return new Date().getTime()
}

export function getDefaultValueNumber(value, defaultValue = 0) {
  return removeDotInValueType(value, defaultValue)
}

export function getDefaultVariableInType(arrayType, type, value) {
  return arrayType.includes(type) ? removeDotInValueType(value) : 0
}

export const numberToCurrency = (number, currency, backComma) => {
  if (Number.isNaN(number) || !number) return ''

  const numberstring = number.toString()
  const sisa = numberstring.length % 3
  let total = numberstring.substr(0, sisa)
  const ribuan = numberstring.substr(sisa).match(/\d{3}/g)

  if (ribuan) {
    const separator = sisa ? '.' : ''
    total += separator + ribuan.join('.')
  }

  return `${currency || ''}${total}${backComma || ''}`
}
