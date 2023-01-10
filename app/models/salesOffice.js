import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  /** SalesOffice */
  class SalesOffice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     *
     * @static
     * @memberof SalesOffice
     */
    static associate(models) {
      this.belongsTo(models.Region, {
        foreignKey: 'region_id',
      })

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

  SalesOffice.init({
    uuid: DataTypes.STRING,
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    region_id: DataTypes.BIGINT,
    created_by: DataTypes.BIGINT,
    deleted_by: DataTypes.BIGINT,
    updated_by: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'SalesOffice',
    underscored: true,
    paranoid: true,
    tableName: 'sales_offices',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
  })

  // eslint-disable-next-line func-names
  /**
   * get array of attribute that can be called multiple times
   * @memberof SalesOffice
   * @function getBasicAttribute
   * @returns {Array} array of attributes
   */
  SalesOffice.getBasicAttribute = () => [
    'uuid',
    'code',
    'name',
    'region_id',
  ]

  return SalesOffice
}
