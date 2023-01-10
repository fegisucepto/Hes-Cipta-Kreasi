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
    await queryInterface.bulkInsert('user_storage_locations', [
      {
        user_id: 1,
        storage_location_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 1,
        storage_location_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 1,
        storage_location_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        storage_location_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        storage_location_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        storage_location_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 3,
        storage_location_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 3,
        storage_location_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 3,
        storage_location_id: 3,
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
