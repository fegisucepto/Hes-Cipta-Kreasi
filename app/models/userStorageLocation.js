import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  /** UserStorageLocation */
  class UserStorageLocation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     *
     * @static
     * @memberof UserStorageLocation
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
      })

      this.belongsTo(models.StorageLocation, {
        foreignKey: 'storage_location_id',
      })

      /** define association here */
      this.addHook('beforeFind', (options) => {
        if (!options.attributes) {
          // eslint-disable-next-line no-param-reassign
          options.attributes = this.getBasicAttribute()
        }
      })
    }
  }

  UserStorageLocation.init({
    user_id: DataTypes.BIGINT,
    storage_location_id: DataTypes.BIGINT,
    created_by: DataTypes.BIGINT,
    deleted_by: DataTypes.BIGINT,
    updated_by: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'UserStorageLocation',
    underscored: true,
    paranoid: true,
    tableName: 'user_storage_locations',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
  })

  // eslint-disable-next-line func-names
  /**
   * get array of attribute that can be called multiple times
   * @memberof UserStorageLocation
   * @function getBasicAttribute
   * @returns {Array} array of attributes
   */
  UserStorageLocation.getBasicAttribute = () => [
    'user_id',
    'storage_location_id',
  ]

  return UserStorageLocation
}
