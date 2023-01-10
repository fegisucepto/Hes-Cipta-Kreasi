module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addConstraint('users', {
      fields: ['sales_office_id'],
      type: 'foreign key',
      name: 'fk_user_sales_office_association', // optional
      references: {
        table: 'sales_offices',
        field: 'id',
      },
    })

    await queryInterface.addConstraint('users', {
      fields: ['storage_location_id'],
      type: 'foreign key',
      name: 'fk_user_storage_location_association', // optional
      references: {
        table: 'storage_locations',
        field: 'id',
      },
    })

    await queryInterface.addConstraint('users', {
      fields: ['role_id'],
      type: 'foreign key',
      name: 'fk_user_role_association', // optional
      references: {
        table: 'roles',
        field: 'id',
      },
    })
  },
  down: async (queryInterface) => {
    await queryInterface.removeConstraint('users', 'fk_user_sales_office_association')
    await queryInterface.removeConstraint('users', 'fk_user_storage_location_association')
    await queryInterface.removeConstraint('users', 'fk_user_role_association')
  },
}
