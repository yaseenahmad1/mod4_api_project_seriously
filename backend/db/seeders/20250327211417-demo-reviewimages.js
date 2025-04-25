'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ReviewImages', [
      {
        reviewId: 1, 
        url: 'https://example.com/review1-image.jpg',
        createdAt: new Date(), 
        updatedAt: new Date()
      }, 
      {
        reviewId: 2, 
        url: 'https://example.com/review2-image.jpg',
        createdAt: new Date(), 
        updatedAt: new Date()
      }, 
      {
        reviewId: 3, 
        url: 'https://example.com/review3-image.jpg',
        createdAt: new Date(), 
        updatedAt: new Date()
      }, 
      {
        reviewId: 4, 
        url: 'https://example.com/review4-image.jpg',
        createdAt: new Date(), 
        updatedAt: new Date()
      }, 
      {
        reviewId: 5, 
        url: 'https://example.com/review5-image.jpg',
        createdAt: new Date(), 
        updatedAt: new Date()
      }, 
      {
        reviewId: 6, 
        url: 'https://example.com/review6-image.jpg',
        createdAt: new Date(), 
        updatedAt: new Date()
      }, 
      {
        reviewId: 7, 
        url: 'https://example.com/review7-image.jpg',
        createdAt: new Date(), 
        updatedAt: new Date()
      }, 
      {
        reviewId: 8, 
        url: 'https://example.com/review8-image.jpg',
        createdAt: new Date(), 
        updatedAt: new Date()
      }, 
      {
        reviewId: 9, 
        url: 'https://example.com/review9-image.jpg',
        createdAt: new Date(), 
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ReviewImages', null, {});
  }
};
