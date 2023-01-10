module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sales_offices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      uuid: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      province_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: 'provinces',
          key: 'id',
        },
      },
      regency_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: 'regencies',
          key: 'id',
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
      created_by: {
        type: Sequelize.BIGINT,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      updated_by: {
        type: Sequelize.BIGINT,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      deleted_by: {
        type: Sequelize.BIGINT,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('sales_offices')
  },
}
