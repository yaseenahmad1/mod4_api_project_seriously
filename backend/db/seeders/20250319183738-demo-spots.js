'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1, // Assuming ownerId corresponds to 'Demo-lition'
        address: '123 Sunny Beach St',
        city: 'Santa Monica',
        state: 'CA',
        country: 'USA',
        lat: 34.1234567,
        lng: 118.9876543,
        name: 'Beach House Resort',
        description: 'Enjoy amazing views of the ocean in this beautiful beach house.',
        price: 250.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 2, // Assuming ownerId corresponds to 'FakeUser1'
        address: '456 Mountain Blvd',
        city: 'Palm Springs',
        state: 'CA',
        country: 'USA',
        lat: 45.1234567,
        lng: 120.9876543,
        name: 'Desert Oasis',
        description: 'Front yard pool with amazing views of the mountains.',
        price: 350.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 3, // Assuming ownerId corresponds to 'FakeUser2'
        address: '789 Forest Ave',
        city: 'Sacramento',
        state: 'CA',
        country: 'USA',
        lat: 54.1234567,
        lng: 130.9876543,
        name: 'Cabin Home',
        description: 'Enjoy amazing views of the forest in this cabin style home.',
        price: 450.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Spots', null, {});
  }
};
