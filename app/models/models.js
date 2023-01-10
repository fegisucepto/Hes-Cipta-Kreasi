/**
 * @module models/model
 *
 * List of model that will use in sequelize
* */

import Role from './role'
import User from './user'
import SalesOffice from './salesOffice'
import StorageLocation from './storageLocation'
import Session from './session'
import ForgetPassword from './forgetPassword'
import UserSalesOffice from './userSalesOffice'
import UserStorageLocation from './userStorageLocation'
import Region from './region'
import SalesOrganization from './salesOrganization'
import UserSalesOrganization from './userSalesOrganization'
import Permission from './permission'
import RolePermission from './rolePermission'

export default {
  Role,
  User,
  SalesOffice,
  Session,
  StorageLocation,
  ForgetPassword,
  UserSalesOffice,
  UserStorageLocation,
  Region,
  SalesOrganization,
  UserSalesOrganization,
  Permission,
  RolePermission,
}
