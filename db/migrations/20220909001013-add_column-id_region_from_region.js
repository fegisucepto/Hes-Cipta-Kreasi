module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('regions', 'id_region', {
      after: 'id',
      allowNull: false,
      type: Sequelize.STRING,
    })
  },
  down: async () => {

  },
}
