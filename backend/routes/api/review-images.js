const express = require('express'); // Importing the Express module to create a router for handling review-related API endpoints (GET, POST, PUT, DELETE).
const { User, Spot, SpotImage, Review, ReviewImage } = require('../../db/models'); // Importing all database models to interact with the database and establish relationships between data.
const { check } = require('express-validator'); // Importing express-validator, which allows us to define validation rules for incoming request data.
const { restoreUser, requireAuth } = require('../../utils/auth'); // Importing authentication middleware: 
// - restoreUser: Restores the session user from a valid token.
// - requireAuth: Ensures a user is authenticated before accessing protected routes.
const { handleVadilationErrors } = require('../../utils/validation'); // Importing global error handler middleware to catch and format validation errors.
const router = express.Router(); // Creating an Express router to define review-related API routes, which will be mounted in routes/api/index.js.

// DELETE - Delete an existing image for a Review 
router.delete('/:id', requireAuth, async (req, res, next) => { // requireAuth is the first validation to ensure this user can perform this action
    try{
    // grab our review id of interest and store it in a variable
    const reviewImageId = req.params.id; 
    // grab our user id from our authentication middleware 
    const userId = req.user.id; 

    const reviewImage = await ReviewImage.findOne({  // using the findOne method on the ReviewImage model because we are wanting to delete the image not the Review itself 
        where : { id: reviewImageId }     
    }); 

    if (!reviewImage) {       // if the reviewImage does not exist based on the id that was inserted in our endpoint 
        return res.status(404).json({ message: "Review Image couldn't be found"}); // then return the error message 
    }

    // Find the review associated with this image 
    const review = await Review.findByPk(reviewImage.reviewId) 

    if (!review || review.userId !== userId) { // if the review does not belong to user 
        return res.status(403).json({ message: "Review must belong to the current user"});
    }

    await reviewImage.destroy(); // if all the previous checks pass then go ahead and remove the image of that review based on its id 

    return res.status(200).json({ message: "Successfully deleted"})
} catch (error) {
    next(error); // pass all other misc errors to global error handler 
}
}); 

module.exports = router; 