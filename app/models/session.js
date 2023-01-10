import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  /** Session */
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     *
     * @static
     * @memberof Session
     */
    static associate(models) {
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

  Session.init({
    uuid: DataTypes.STRING,
    user_id: DataTypes.STRING,
    created_by: DataTypes.BIGINT,
    deleted_by: DataTypes.BIGINT,
    updated_by: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'Session',
    underscored: true,
    paranoid: true,
    tableName: 'sessions',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
  })

  // eslint-disable-next-line func-names
  /**
   * get array of attribute that can be called multiple times
   * @memberof Session
   * @function getBasicAttribute
   * @returns {Array} array of attributes
   */
  Session.getBasicAttribute = () => [
    'id',
    'uuid',
  ]

  return Session
}
