import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  /** Role */
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     *
     * @static
     * @memberof Role
     */
    static associate(models) {
      /** define association here */
      this.belongsTo(models.User, {
        foreignKey: 'deleted_by',
        as: 'UserDelete',
      })

      this.belongsToMany(models.Permission, {
        through: 'role_permissions',
      })
      this.addHook('beforeFind', (options) => {
        if (!options.attributes) {
          // eslint-disable-next-line no-param-reassign
          options.attributes = this.getBasicAttribute()
        }
      })
    }
  }

  Role.init({
    uuid: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    created_by: DataTypes.BIGINT,
    deleted_by: DataTypes.BIGINT,
    updated_by: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'Role',
    underscored: true,
    paranoid: true,
    tableName: 'roles',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
  })

  // eslint-disable-next-line func-names
  /**
   * get array of attribute that can be called multiple times
   * @memberof Role
   * @function getBasicAttribute
   * @returns {Array} array of attributes
   */
  Role.getBasicAttribute = () => [
    'uuid',
    'name',
    'description',
  ]

  return Role
}
