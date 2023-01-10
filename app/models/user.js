import { Model } from 'sequelize'
import { getHash } from '../helpers/password'

export default (sequelize, DataTypes) => {
  /** User */
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     *
     * @static
     * @memberof User
     */
    static associate(models) {
      this.belongsTo(models.Role, {
        foreignKey: 'role_id',
      })

      this.belongsTo(models.User, {
        foreignKey: 'deleted_by',
        as: 'UserDelete',
      })

      this.belongsToMany(models.SalesOrganization, {
        through: 'user_sales_organizations',
      })

      this.belongsToMany(models.SalesOffice, {
        through: 'user_sales_offices',
      })

      this.belongsToMany(models.StorageLocation, {
        through: 'user_storage_locations',
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

  User.init({
    uuid: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue('password', getHash(value))
      },
    },
    mobile_phone: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN,
    last_login: DataTypes.DATE,
    created_by: DataTypes.BIGINT,
    deleted_by: DataTypes.BIGINT,
    updated_by: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'User',
    underscored: true,
    paranoid: true,
    tableName: 'users',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
  })

  // eslint-disable-next-line func-names
  /**
   * get array of attribute that can be called multiple times
   * @memberof User
   * @function getBasicAttribute
   * @returns {Array} array of attributes
   */
  User.getBasicAttribute = () => [
    'id',
    'uuid',
    'firstname',
    'lastname',
    'email',
    'mobile_phone',
    'is_active',
    'last_login',
  ]

  return User
}
