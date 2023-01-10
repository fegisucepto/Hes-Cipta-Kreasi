/* eslint-disable import/prefer-default-export */
export function getBodyArrayFormData(value) {
  return (typeof value === 'string') ? [value] : value
}
