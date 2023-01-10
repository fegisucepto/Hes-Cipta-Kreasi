import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  /** RolePermission */
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     * @static
     * @memberof RolePermission
     */
    static associate(models) {
      this.belongsTo(models.Role, {
        foreignKey: 'role_id',
      })

      this.belongsTo(models.Permission, {
        foreignKey: 'permission_id',
      })
      // define association here
      this.addHook('beforeFind', (options) => {
        if (!options.attributes) {
          // eslint-disable-next-line no-param-reassign
          options.attributes = this.getBasicAttribute()
        }
      })
    }
  }
  RolePermission.init({
    role_id: DataTypes.BIGINT,
    permission_id: DataTypes.BIGINT,
    created_by: DataTypes.BIGINT,
    updated_by: DataTypes.BIGINT,
    deleted_by: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'RolePermission',
    underscored: true,
    paranoid: true,
    tableName: 'role_permissions',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
  })

  // eslint-disable-next-line func-names
  /**
   * get array of attribute that can be called multiple times
   * @memberof RolePermission
   * @function getBasicAttribute
   * @returns {Array} array of attributes
   */
  RolePermission.getBasicAttribute = () => [
    'role_id',
    'permission_id',
  ]
  return RolePermission
}
