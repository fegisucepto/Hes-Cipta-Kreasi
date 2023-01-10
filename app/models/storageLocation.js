import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  /** StorageLocation */
  class StorageLocation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     *
     * @static
     * @memberof StorageLocation
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'deleted_by',
        as: 'UserDelete',
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

  StorageLocation.init({
    uuid: DataTypes.STRING,
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    created_by: DataTypes.BIGINT,
    deleted_by: DataTypes.BIGINT,
    updated_by: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'StorageLocation',
    underscored: true,
    paranoid: true,
    tableName: 'storage_locations',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
  })

  // eslint-disable-next-line func-names
  /**
   * get array of attribute that can be called multiple times
   * @memberof StorageLocation
   * @function getBasicAttribute
   * @returns {Array} array of attributes
   */
  StorageLocation.getBasicAttribute = () => [
    'uuid',
    'code',
    'name',
  ]

  return StorageLocation
}
