module.exports = {
  up: async (queryInterface) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('regions', [
      {
        uuid: '004e76f3-d0cb-47a5-8rn4-de263d3reg1',
        name: 'Jakarta',
        id_region: 'ID/W01',
        code: 'ACL',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: '004e76f3-d0cb-47a5-8rn4-de263d3reg2',
        name: 'Bandung',
        id_region: 'ID/W02',
        code: 'BDG',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: '004e76f3-d0cb-47a5-8rn4-de263d3reg3',
        name: 'Surabaya',
        id_region: 'ID/W03',
        code: 'SBY',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: '004e76f3-d0cb-47a5-8rn4-de263d3reg4',
        name: 'Semarang',
        id_region: 'ID/W04',
        code: 'SMR',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: '004e76f3-d0cb-47a5-8rn4-de263d3reg5',
        name: 'Medan',
        id_region: 'ID/W05',
        code: 'MDN',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: '004e76f3-d0cb-47a5-8rn4-de263d3reg6',
        name: 'Palembang',
        id_region: 'ID/W06',
        code: 'PLB',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: '004e76f3-d0cb-47a5-8rn4-de263d3reg7',
        name: 'Makassar',
        id_region: 'ID/W07',
        code: 'MKS',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: '004e76f3-d0cb-47a5-8rn4-de263d3reg8',
        name: 'Pekanbaru',
        id_region: 'ID/W08',
        code: 'PKU',
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
