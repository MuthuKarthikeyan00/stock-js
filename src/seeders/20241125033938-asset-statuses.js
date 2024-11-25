'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('asset_statuses', [
      {
        name: 'idel',
        isDeleted: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'issued',
        isDeleted: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'returned',
        isDeleted: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'scrabed',
        isDeleted: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('asset_statuses', null, {});
  }
};
