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
    const SUPERADMIN_DEFAULT = [
      // {
      //   role_id: 0,
      //   permission_id: 1,
      //   created_at: new Date(),
      //   updated_at: new Date(),
      // },
      // action biasa
      {
        role_id: 0,
        permission_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 28,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 29,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 30,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 31,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 36,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 37,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 38,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 39,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 40,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 41,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 42,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 43,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 44,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 45,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 46,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 0,
        permission_id: 47,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]
    const ADMIN_DEFAULT = [
      // {
      //   role_id: 1,
      //   permission_id: 1,
      //   created_at: new Date(),
      //   updated_at: new Date(),
      // },
      {
        role_id: 1,
        permission_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 28,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 29,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 30,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 31,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 36,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 37,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 38,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 39,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 40,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 41,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 42,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 43,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 44,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 45,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 46,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 1,
        permission_id: 47,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]
    const SCM_DEFAULT = [
      {
        role_id: 2,
        permission_id: 28,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 2,
        permission_id: 36,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 2,
        permission_id: 40,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 2,
        permission_id: 44,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]
    const FINANCE_DEFAULT = [
      {
        role_id: 3,
        permission_id: 28,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        permission_id: 36,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        permission_id: 40,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        permission_id: 44,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]
    await queryInterface.bulkInsert('role_permissions', [
      ...SUPERADMIN_DEFAULT, ...ADMIN_DEFAULT, ...SCM_DEFAULT, ...FINANCE_DEFAULT,
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
