module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('user_sales_offices', 'uuid')
    await queryInterface.removeColumn('user_storage_locations', 'uuid')
  },
  down: async () => {

  },
}
