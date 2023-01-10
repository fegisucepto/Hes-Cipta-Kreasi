module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addConstraint('sales_offices', {
      fields: ['region_id'],
      type: 'foreign key',
      name: 'fk_sales_region_association', // optional
      references: {
        table: 'regions',
        field: 'id',
      },
    })
  },
  down: async (queryInterface) => {
    await queryInterface.removeConstraint('sales_offices', 'fk_sales_region_association')
  },
}
