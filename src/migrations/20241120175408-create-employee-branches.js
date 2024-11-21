'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('employee_branches', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, 
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('employee_branches');
  },
};
