module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales_offices', 'code', {
      after: 'uuid',
      allowNull: false,
      type: Sequelize.STRING,
    })
    await queryInterface.addColumn('sales_offices', 'region_id', {
      after: 'code',
      allowNull: false,
      type: Sequelize.BIGINT,
    })
  },
  down: async () => {

  },
}
