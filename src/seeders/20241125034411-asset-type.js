'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('asset_types', [
      {
        name: 'hardware',
        isDeleted: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'others',
        isDeleted: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('asset_types', null, {});
  }
};
