module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('storage_locations', 'province_id')
    await queryInterface.removeColumn('storage_locations', 'regency_id')
  },
  down: async () => {

  },
}
