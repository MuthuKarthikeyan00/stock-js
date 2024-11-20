module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('assets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      assetTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'asset_types',
          key: 'id',
        },
      },
      assetStatusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'asset_statuses',
          key: 'id',
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, 
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      purchaseDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
      },
      isDeleted: {
        type: Sequelize.SMALLINT,
        allowNull: true,
        defaultValue: 0,
      },
    });

    await queryInterface.addIndex('assets', ['assetTypeId']);
    await queryInterface.addIndex('assets', ['name']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('assets');
  },
};
