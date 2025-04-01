// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js'); // added this spotsRouter. This way, whenever you hit the /api/spots endpoints, it will route to the spotsRouter, and the logic defined in routes/api/spots.js (which you will create for the spots routes) will be executed
const reviewsRouter = require('./reviews.js'); 
const spotImagesRouter = require('./spot-images.js');
const reviewImagesRouter = require('./review-images.js');
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter); // add this line to mount the spots router 

router.use('/reviews', reviewsRouter); // add this line to mount the reviews router (VERY IMPORT TO ADD module.exports = router at the end of each file - learned the hard way)

router.use('/spot-images', spotImagesRouter); // add this line to mount the spotsImagesRouter

router.use('/review-images', reviewImagesRouter); 

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;

