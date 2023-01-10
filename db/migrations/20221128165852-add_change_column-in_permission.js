module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('permissions', 'description', {
      after: 'name_key',
      allowNull: true,
      type: Sequelize.STRING,
    })
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('permissions', 'description')
  },
}
