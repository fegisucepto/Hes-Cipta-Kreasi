/* eslint-disable import/prefer-default-export */

export function convertToBoolean(value) {
  let response = false
  if (value === 1 || value === '1' || value === 'true' || value === true) {
    response = true
  }
  return response
}
