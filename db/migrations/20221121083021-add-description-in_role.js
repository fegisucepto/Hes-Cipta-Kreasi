module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('roles', 'description',
      {
        type: Sequelize.STRING,
        allowNull: true,
      })
  },
  down: async () => {
  },
}
