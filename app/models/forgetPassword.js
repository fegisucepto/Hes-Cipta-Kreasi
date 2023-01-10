import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  /** ForgetPassword */
  class ForgetPassword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     *
     * @static
     * @memberof ForgetPassword
     */
    static associate() {
      /** define association here */
      this.addHook('beforeFind', (options) => {
        if (!options.attributes) {
          // eslint-disable-next-line no-param-reassign
          options.attributes = this.getBasicAttribute()
        }
      })
    }
  }

  ForgetPassword.init({
    token: DataTypes.STRING,
    email: DataTypes.STRING,
    expired_at: DataTypes.DATE,
    created_by: DataTypes.BIGINT,
    deleted_by: DataTypes.BIGINT,
    updated_by: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'ForgetPassword',
    underscored: true,
    paranoid: true,
    tableName: 'forget_passwords',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
  })

  // eslint-disable-next-line func-names
  /**
   * get array of attribute that can be called multiple times
   * @memberof ForgetPassword
   * @function getBasicAttribute
   * @returns {Array} array of attributes
   */
  ForgetPassword.getBasicAttribute = () => [
    'token',
    'email',
    'expired_at',
  ]

  return ForgetPassword
}
