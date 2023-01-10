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
    await queryInterface.bulkInsert('roles', [
      {
        id: 5,
        uuid: '004e76f3-d0cb-47a5-8fd4-de263d3dc3c0',
        name: 'SUPERADMIN',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 1,
        uuid: '004e76f3-d0cb-47a5-8fd4-de263d3dc3c5',
        name: 'ADMIN',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        uuid: '004e76f3-d0cb-47a5-8fd4-de263d3dc3c4',
        name: 'SCM',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        uuid: '004e76f3-d0cb-47a5-8fd4-de263d3dc3c2',
        name: 'FINANCE',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        uuid: '004e76f3-d0cb-47a5-8fd4-de263d3dc3c3',
        name: 'REVIEWER',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
    await queryInterface.sequelize.query('UPDATE roles SET id = 0 WHERE id = 5;')
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
