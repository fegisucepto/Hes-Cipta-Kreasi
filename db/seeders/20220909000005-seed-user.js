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
    await queryInterface.bulkInsert('users', [
      {
        id: 5,
        uuid: '004e76f3-d0cb-47a5-8fd4-de263d3dcus0',
        firstname: 'Super',
        lastname: 'Admin',
        email: 'superadmin@example.com',
        password: '$2a$10$OXoAMXYJ1Sunebe9pD6EHuzGHxgk6JE0nbRWjFsSOWvu39eO4CeNy',
        mobile_phone: '08128808000',
        role_id: 0,
        is_active: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 1,
        uuid: '004e76f3-d0cb-47a5-8fd4-de263d3dcus1',
        firstname: 'admin',
        lastname: 'pertama',
        email: 'admin@example.com',
        password: '$2a$10$OXoAMXYJ1Sunebe9pD6EHuzGHxgk6JE0nbRWjFsSOWvu39eO4CeNy',
        mobile_phone: '08128808090',
        role_id: 1,
        is_active: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        uuid: '004e76f3-d0cb-47a5-8fd4-de263d3dcus2',
        firstname: 'scm',
        lastname: 'pertama',
        email: 'scm@example.com',
        password: '$2a$10$OXoAMXYJ1Sunebe9pD6EHuzGHxgk6JE0nbRWjFsSOWvu39eO4CeNy',
        mobile_phone: '08128808091',
        role_id: 2,
        is_active: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        uuid: '004e76f3-d0cb-47a5-8fd4-de263d3dcus3',
        firstname: 'finance',
        lastname: 'pertama',
        email: 'finance@example.com',
        password: '$2a$10$OXoAMXYJ1Sunebe9pD6EHuzGHxgk6JE0nbRWjFsSOWvu39eO4CeNy',
        mobile_phone: '08128808092',
        role_id: 3,
        is_active: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        uuid: '004e76f3-d0cb-47a5-8fd4-de263d3dcus4',
        firstname: 'reviewer',
        lastname: 'pertama',
        email: 'reviewer@example.com',
        password: '$2a$10$OXoAMXYJ1Sunebe9pD6EHuzGHxgk6JE0nbRWjFsSOWvu39eO4CeNy',
        mobile_phone: '08128808093',
        role_id: 4,
        is_active: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
    await queryInterface.sequelize.query('UPDATE users SET id = 0 WHERE id = 5;')
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
