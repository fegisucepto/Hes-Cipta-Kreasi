module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('sales_offices', 'province_id')
    await queryInterface.removeColumn('sales_offices', 'regency_id')
  },
  down: async () => {

  },
}
