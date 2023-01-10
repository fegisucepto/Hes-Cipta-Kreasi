import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  /** UserSalesOffice */
  class UserSalesOffice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     *
     * @static
     * @memberof UserSalesOffice
     */
    static associate(models) {
      this.belongsTo(models.SalesOffice, {
        foreignKey: 'sales_office_id',
      })

      this.belongsTo(models.User, {
        foreignKey: 'user_id',
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

  UserSalesOffice.init({
    user_id: DataTypes.BIGINT,
    sales_office_id: DataTypes.BIGINT,
    created_by: DataTypes.BIGINT,
    deleted_by: DataTypes.BIGINT,
    updated_by: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'UserSalesOffice',
    underscored: true,
    paranoid: true,
    tableName: 'user_sales_offices',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
  })

  // eslint-disable-next-line func-names
  /**
   * get array of attribute that can be called multiple times
   * @memberof UserSalesOffice
   * @function getBasicAttribute
   * @returns {Array} array of attributes
   */
  UserSalesOffice.getBasicAttribute = () => [
    'user_id',
    'sales_office_id',
  ]

  return UserSalesOffice
}
