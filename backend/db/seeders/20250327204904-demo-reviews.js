'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews', [
      {
        spotId: 1,
        userId: 1, 
        review: "Amazing place! Loved the beach view.",
        stars: 5, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 1,
        userId: 2, 
        review: "Pretty good, but too crowded.",
        stars: 4, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 1,
        userId: 3, 
        review: "Not bad, but the weather was too hot.",
        stars: 3, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2,
        userId: 1, 
        review: "Breathtaking mountain views!",
        stars: 5, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2,
        userId: 2, 
        review: "Good hiking trails, but cold.",
        stars: 4, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2,
        userId: 3, 
        review: "I loved the quiet atmosphere.",
        stars: 5, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3,
        userId: 1, 
        review: "So peaceful! Would visit again.",
        stars: 5, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3,
        userId: 2, 
        review: "A bit too many bugs, but nice.",
        stars: 3, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3,
        userId: 3, 
        review: "Absolutely beautiful scenery!",
        stars: 5, 
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};
