module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('sales_organizations', [
      {
        id: 1,
        uuid: '004e76f3-d0cb-47a5-8fd4-de263d3id01',
        code: 'ID01',
        description: 'WOI-ID-CG',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        uuid: '004e76f3-d0cb-47a5-8fd4-de263d3id51',
        code: 'ID51',
        description: 'WOI-ID-HEC',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },
  down: async () => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
}
