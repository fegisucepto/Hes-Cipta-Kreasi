module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('permissions', 'menu')
    await queryInterface.removeColumn('permissions', 'description')
    await queryInterface.addColumn('permissions', 'category_key', {
      after: 'category',
      allowNull: false,
      type: Sequelize.STRING,
    })
    await queryInterface.addColumn('permissions', 'name_key', {
      after: 'name',
      allowNull: false,
      type: Sequelize.STRING,
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('permissions', 'menu', {
      after: 'category',
      allowNull: false,
      type: Sequelize.STRING,
    })
    await queryInterface.addColumn('permissions', 'description', {
      after: 'category',
      allowNull: false,
      type: Sequelize.STRING,
    })
    await queryInterface.removeColumn('permissions', 'category_key')
    await queryInterface.removeColumn('permissions', 'name_key')
  },
}
