import { Model } from 'sequelize'

module.exports = (sequelize, DataTypes) => {
  /** Permission */
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here

      this.addHook('beforeFind', (options) => {
        if (!options.attributes) {
          // eslint-disable-next-line no-param-reassign
          options.attributes = this.getBasicAttribute()
        }
      })
    }
  }
  Permission.init({
    uuid: DataTypes.STRING,
    category: DataTypes.STRING,
    category_key: DataTypes.STRING,
    name: DataTypes.STRING,
    name_key: DataTypes.STRING,
    description: DataTypes.STRING,
    created_by: DataTypes.BIGINT,
    updated_by: DataTypes.BIGINT,
    deleted_by: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'Permission',
    underscored: true,
    paranoid: true,
    tableName: 'permissions',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
  })

  // eslint-disable-next-line func-names
  /**
   * get array of attribute that can be called multiple times
   * @memberof Permission
   * @function getBasicAttribute
   * @returns {Array} array of attributes
   */
  Permission.getBasicAttribute = () => [
    'uuid',
    'category',
    'category_key',
    'name',
    'name_key',
    'description',
  ]
  return Permission
}
