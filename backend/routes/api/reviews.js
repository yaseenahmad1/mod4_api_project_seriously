const express = require('express'); // Importing the Express module to create a router for handling review-related API endpoints (GET, POST, PUT, DELETE).
const { User, Spot, SpotImage, Review, ReviewImage } = require('../../db/models'); // Importing all database models to interact with the database and establish relationships between data.
const { check } = require('express-validator'); // Importing express-validator, which allows us to define validation rules for incoming request data.
const { restoreUser, requireAuth } = require('../../utils/auth'); // Importing authentication middleware: 
// - restoreUser: Restores the session user from a valid token.
// - requireAuth: Ensures a user is authenticated before accessing protected routes.
const { handleVadilationErrors, handleValidationErrors } = require('../../utils/validation'); // Importing global error handler middleware to catch and format validation errors.
const review = require('../../db/models/review');
const router = express.Router(); // Creating an Express router to define review-related API routes, which will be mounted in routes/api/index.js.

const validReview = [
    check('review')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Review text is required"),
    check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
]

// 8. GET /api/reviews/current - Get all reviews of the current user
// API DOCS REQUIRE - Ensure a 200 success status , (throw an error message if a user does not exist or there is an invalid user id) 

// Set up our method and endpoint 
router.get('/current', requireAuth, async (req, res, next) => {
    try { 
    // extract our current user and store them in a variable 
    const currentUser = req.user.id; // identifying our current user by our requireAuth middleware
    // create a method to retrieve all the reviews by that user 
    const reviews = await Review.findAll( // returns a promise and must be awaited 
        { where: { userId: currentUser }} // here we are essentially saying we want to find all the reviews of the currentUser's id (userId foreign key). 
    ); 

    res.status(200).json(reviews); // Once we grab all our reviews we will provide it back to our client with a 200 success status and json format of reviews 
} catch (error) { 
    next(error); // Hnadle errors properly 
}
}); 
// should give us back ids 1, 4, 7, from our Review database table from 'Demo-lition' who is our User 1 

// 11. POST /api/reviews/:reviewId/images - Add an image to a review 
// We must grab our reviewId and store it in a variable and then use our reviewimage model to incorporate an image to that particular review
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    try { 
    const reviewId = req.params.reviewId; // extracting the id number from our endpoint

    // Review must belong to the current (logged in) user 
    const userId = req.user.id; // extracting our logged in user from our requireAuth middelware 

    const review = await Review.findByPk(reviewId); // because reviewId references the primary key 'id' in Reviews so storing that in a variable 

    if (!review) {
        return res.status(404).json({ message: " Review couldn't be found"}); // if review id does not exist send a 404
    }

    if (review.userId !== userId ) { // if the userId foreign key in our Reviews table DOES NOT matche our logged in user 
        return res.status(403).json({ message: "Error: You are not the owner of this review"})
    }
    
    // otherwise proceed with the rest of the api doc 
    const imageCount = await ReviewImage.count({ where: { reviewId }}); // .count is used to count the number of records that match a given condition 

    if (imageCount >= 10) {
        return res.status(403).json({ message: " Maximum number of images for this resource was reached"}) // return 403

    }

    const { url } = req.body;   // this will extract the post made in the request body 

    const newImage = await ReviewImage.create({ // create an image url 
        reviewId,
        url
    }); 

    return res.status(201).json({
        id: newImage.reviewId,
        url: newImage.url
    }); // user should get back the id number of the review and the url image link 

    } catch (error) {
        next(error);
    }
});

// 12. PUT /api/reviews/:reviewId - Edit a review 
router.put(         // this is a put request
    '/:reviewId',
    requireAuth,    // Make sure we have a valid logged in user
    validReview, // ensure that whatever edit is made has passed our custom validationSpotCreation middleware that checks each field
    async (req, res, next) => {
    try {
        const reviewId = req.params.reviewId; // extract our id from our endpoint and store it as spotId
        const userId = req.user.id;   // ensure we have a valid user signed in to make the edits 

        const review = await Review.findByPk(reviewId); // pull out our actual review by finding the review's primary key id 

        if (!review) { 
            return res.status(404).json({ message: "Review couldn't be found"});
        }; 

        if (review.userId !== userId) { // Essentially saying that if our foreign key in review is not the same as the user id who is logged in 
            return res.status(403).json({ message: "You must be the owner to edit this review"}); // they cannot make changes to this review 
        }

        // perform the update :
        const editedReview = await review.update(req.body); // use the update method on our review instance with whatever changes have been made in our request body and store them in editedReview

        return res.status(200).json(editedReview); // returning a 200 status for a success and returning the editedSpot with changed and unchanged fields back to user

    } catch(error) {            // catch any errors that occur and pass them on to our global middleware 
        next(error);
    }
    }); 


// 13. DELETE / api/reviews/:reviewId - Delete a review 
// We need to delete a review by targeting the specific reviewId 
router.delete('/:reviewId', requireAuth, async (req, res, next) => { // delete method with endpoints of review's id targeted. User must be logged in to submit this request
    // grab and store our reviewId
    try { 
    const reviewId = req.params.reviewId; 
    const userId = req.user.id; // grab and store our logged in user from our requireAuth middleware 
    
    const review = await Review.findOne({ where: { id: reviewId }}); // using the findOne method to pinpoint our id of interest and storing it inside a variable 

    if (!review) { // if the review id that is given is not valid
        return res.status(404).json({ message: "Review couldn't be found"}); // return a 404 with custom message 
    }

    await review.destroy(); // otherwise that specific review is removed. 

    return res.status(200).json({ message: "Successfully deleted"}); 
} catch (error) {
    next(error);
}
}); 

// DELETE - Delete an existing image for a review
// implement our path and proper validations to pass through 
router.delete('/:reviewId/images', requireAuth, async (req, res, next) => {
    try {
        // let's extract our review id from our endpoint 
        const reviewId = req.params.reviewId; 
        // let's store our logged in user for verification later on
        const userId = req.user.id; 
        // extract review's userId to compare it to our logged in user 
        const reviewUser = await ReviewImage.findByPk({userId}); 

        if (!reviewUser) { // if the reviewUser is not the logged in user
            return res.json({ message: "Review must belong to the current user"}) // notify with message 
        }

        const reviewImage = await ReviewImage.findOne({ where: { id: reviewId }}); // this won't work because i have many reviewIds with the number one maybe need Pk instead 

    } catch (error) {
        next(error); // handle all other misc errors in global error handler
    }
});
module.exports = router; 