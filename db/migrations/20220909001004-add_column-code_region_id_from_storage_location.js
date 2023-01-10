module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('storage_locations', 'code', {
      after: 'uuid',
      allowNull: false,
      type: Sequelize.STRING,
    })
  },
  down: async () => {

  },
}
