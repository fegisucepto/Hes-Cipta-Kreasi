module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'sales_office_id')
    await queryInterface.removeColumn('users', 'storage_location_id')
  },
  down: async () => {

  },
}
