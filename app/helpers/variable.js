import { USER_ROLE } from './constants'

export function checkDefaultSortVariable(variableSort, column, Model = [], defaultValue = []) {
  return variableSort ? [[...Model, column, variableSort.toUpperCase()]] : defaultValue
}

export function checkDefaultValueVariabel(valueVariabel, defaultValue = []) {
  return valueVariabel ? valueVariabel.replace(/ /g, '').split(',') : defaultValue
}

export function checkDefaultValueStringVariabel(valueVariabel, defaultValue = null) {
  return valueVariabel ? valueVariabel.replace(/ /g, '') : defaultValue
}

export function checkDefaultQueryVariabel(queryVariabel, queryField, defaultValue = []) {
  return queryVariabel[0] ? [{ [queryField]: queryVariabel }] : defaultValue
}

export function checkDefaultWhereQueryVariabel(queryVariabel, queryField, defaultValue = {}) {
  return queryVariabel[0] ? { where: { [queryField]: queryVariabel } } : defaultValue
}

export function checkDefaultCollectionPayment(queryVariabel, queryField) {
  return queryVariabel ? [{ [queryField]: Boolean(Number(queryVariabel)) }] : []
}

export function checkEveryInclude(dataArrayUuid, dataMap, user) {
  return !dataArrayUuid.every((r) => dataMap.includes(r))
  && user.role_id !== USER_ROLE.ADMIN && user.role_id !== USER_ROLE.SUPERADMIN
}

export function checkEveryIncludeViewAll(dataArrayUuid, dataMap, user) {
  return !dataArrayUuid.every((r) => dataMap.includes(r))
  && !user.view_all_data
}

export function checkUserAdminFilter(user, condition, filter = [], defaultValue = []) {
  if ((user.role_id === USER_ROLE.ADMIN || user.view_all_data) && !filter[0]) {
    return defaultValue
  }
  if ((user.role_id !== USER_ROLE.ADMIN || !user.view_all_data) && !filter[0]) {
    return condition
  }
  return condition
}

export function checkViewAllFilter(user, conditionRequest, conditionUser, defaultValue = null) {
  if (user.view_all_data && !conditionRequest) {
    return defaultValue
  }
  if (!user.view_all_data && !conditionRequest) {
    return conditionUser
  }
  return conditionRequest
}
