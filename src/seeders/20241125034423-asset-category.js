'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('asset_categories', [
      {
        name: 'labtop',
        isDeleted: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'phone',
        isDeleted: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'uncategorized',
        isDeleted: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('asset_categories', null, {});
  }
};
