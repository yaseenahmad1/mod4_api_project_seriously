'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName="ReviewImages"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, [
      // Spot 1 Reviews (reviewId 1 to 3)
  {
    reviewId: 1,
    url: 'https://images.pexels.com/photos/533923/pexels-photo-533923.jpeg', // beach view
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reviewId: 2,
    url: 'https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg', // beach crowded area
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reviewId: 3,
    url: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg', // hot sunny weather
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Spot 2 Reviews (reviewId 4 to 6)
  {
    reviewId: 4,
    url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', // pool in desert
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reviewId: 5,
    url: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg', // hot desert sun
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reviewId: 6,
    url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg', // desert nature
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Spot 3 Reviews (reviewId 7 to 9)
  {
    reviewId: 7,
    url: 'https://images.pexels.com/photos/2437296/pexels-photo-2437296.jpeg', // cabin fireplace
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reviewId: 8,
    url: 'https://images.pexels.com/photos/33109/fir-trees-evergreen-trees-green-33109.jpeg', // forest trees
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reviewId: 9,
    url: 'https://images.pexels.com/photos/315638/pexels-photo-315638.jpeg', // rustic cabin
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Spot 4 Reviews (reviewId 10 to 12)
  {
    reviewId: 10,
    url: 'https://images.pexels.com/photos/1643387/pexels-photo-1643387.jpeg', // luxury penthouse sunset
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reviewId: 11,
    url: 'https://images.pexels.com/photos/207413/pexels-photo-207413.jpeg', // city night view
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reviewId: 12,
    url: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg', // apartment building
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Spot 5 Reviews (reviewId 13 to 15)
  {
    reviewId: 13,
    url: 'https://images.pexels.com/photos/37347/office-building-glass-architecture-37347.jpeg', // modern loft
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reviewId: 14,
    url: 'https://images.pexels.com/photos/37350/office-building-glass-architecture-37350.jpeg', // street parking
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reviewId: 15,
    url: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg', // kitchen
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Spot 6 Reviews (reviewId 16 to 18)
  {
    reviewId: 16,
    url: 'https://images.pexels.com/photos/158607/cabin-in-the-forest-158607.jpeg', // lake view cabin
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reviewId: 17,
    url: 'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg', // peaceful lake view
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reviewId: 18,
    url: 'https://images.pexels.com/photos/175737/pexels-photo-175737.jpeg', // rustic cabin interior
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Spot 7 Reviews (reviewId 19 to 21)
  {
    reviewId: 19,
    url: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg', // city view from loft
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reviewId: 20,
    url: 'https://images.pexels.com/photos/3184335/pexels-photo-3184335.jpeg', // city nightlife
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reviewId: 21,
    url: 'https://images.pexels.com/photos/374710/pexels-photo-374710.jpeg', // check-in door
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Spot 8 Reviews (reviewId 22 to 24)
  {
    reviewId: 22,
    url: 'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg', // vineyard villa
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reviewId: 23,
    url: 'https://images.pexels.com/photos/1309643/pexels-photo-1309643.jpeg', // wine country patio
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    reviewId: 24,
    url: 'https://images.pexels.com/photos/2310649/pexels-photo-2310649.jpeg', // vineyard walk
    createdAt: new Date(),
    updatedAt: new Date()
  },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, null, {});
  }
};
