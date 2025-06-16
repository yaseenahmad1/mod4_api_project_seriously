'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName="Reviews"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, [
  // Spot 1: Beach House Resort
  {
    spotId: 1,
    userId: 2,
    review: "The beach access was great, but the area was more crowded than expected. Still a solid place to stay for a short getaway.",
    stars: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    spotId: 1,
    userId: 3,
    review: "Decent stay overall. The views were incredible, but the house could use a bit of updating and the heat was tough to handle.",
    stars: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Spot 2: Desert Oasis
  {
    spotId: 2,
    userId: 3,
    review: "Decent experience, although there were a few maintenance issues. The location is peaceful though.",
    stars: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Spot 3: Cabin Home
  {
    spotId: 3,
    userId: 1,
    review: "A peaceful retreat surrounded by nature. The fireplace and woodsy charm made it super cozy.",
    stars: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    spotId: 3,
    userId: 2,
    review: "The location is serene and beautiful. Would have loved better internet access though.",
    stars: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Spot 4: Oceanfront Penthouse
  {
    spotId: 4,
    userId: 2,
    review: "Great amenities and location. Some noise from the street, but not a dealbreaker.",
    stars: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    spotId: 4,
    userId: 3,
    review: "The penthouse is nice, but I expected a bit more privacy for the price. Still enjoyed the stay.",
    stars: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Spot 5: Urban Loft Retreat
  {
    spotId: 5,
    userId: 1,
    review: "Super modern and perfectly located near the best food and breweries. Loved every minute.",
    stars: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    spotId: 5,
    userId: 3,
    review: "Nice decor and clean space. Could use a few more kitchen supplies though.",
    stars: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Spot 6: Lakeview Cabin
  {
    spotId: 6,
    userId: 1,
    review: "Spectacular views of the lake and mountains. The private dock was a highlight!",
    stars: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    spotId: 6,
    userId: 2,
    review: "Peaceful and remote. It’s great if you want to disconnect from everything.",
    stars: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Spot 7: Downtown Luxe Loft
  {
    spotId: 7,
    userId: 2,
    review: "Great views of the city at night. A bit loud on weekends, but that’s downtown living.",
    stars: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    spotId: 7,
    userId: 3,
    review: "Nice place, just wish the check-in instructions were more clear. Overall a good stay.",
    stars: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Spot 8: Vineyard Villa
  {
    spotId: 8,
    userId: 1,
    review: "Absolutely gorgeous villa surrounded by vineyards. The complimentary tastings were a bonus.",
    stars: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    spotId: 8,
    userId: 3,
    review: "Elegant place but far from most restaurants. Bring groceries if you plan to stay in.",
    stars: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options, null, {});
  }
};
