'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName="Spots"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, [
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
      {
        ownerId: 1,
        address: '101 Ocean Drive',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        lat: 25.7617,
        lng: -80.1918,
        name: 'Oceanfront Penthouse',
        description: 'Luxury penthouse overlooking South Beach with stunning sunset views.',
        price: 600.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 2,
        address: '202 Maple Street',
        city: 'Portland',
        state: 'OR',
        country: 'USA',
        lat: 45.5051,
        lng: -122.6750,
        name: 'Urban Loft Retreat',
        description: 'Modern loft in the heart of downtown with nearby breweries and cafes.',
        price: 180.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 3,
        address: '303 Lakeview Blvd',
        city: 'Lake Tahoe',
        state: 'CA',
        country: 'USA',
        lat: 39.0968,
        lng: -120.0324,
        name: 'Lakeview Cabin',
        description: 'Cozy cabin with panoramic views of Lake Tahoe and private dock access.',
        price: 400.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 1,
        address: '404 City Lights Ave',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: 'Downtown Luxe Loft',
        description: 'High-rise loft with floor-to-ceiling windows and Hollywood skyline views.',
        price: 300.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 2,
        address: '505 Vineyard Lane',
        city: 'Napa Valley',
        state: 'CA',
        country: 'USA',
        lat: 38.5025,
        lng: -122.2654,
        name: 'Vineyard Villa',
        description: 'Elegant villa nestled in wine country with complimentary tastings.',
        price: 500.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, null, {});
  }
};
