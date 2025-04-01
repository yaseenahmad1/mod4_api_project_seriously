const express = require('express'); // Importing the Express module to create a router for handling review-related API endpoints (GET, POST, PUT, DELETE).
const { User, Spot, SpotImage } = require('../../db/models'); // Importing all database models to interact with the database and establish relationships between data.
const { check } = require('express-validator'); // Importing express-validator, which allows us to define validation rules for incoming request data.
const { restoreUser, requireAuth } = require('../../utils/auth'); // Importing authentication middleware: 
// - restoreUser: Restores the session user from a valid token.
// - requireAuth: Ensures a user is authenticated before accessing protected routes.
const { handleVadilationErrors } = require('../../utils/validation'); // Importing global error handler middleware to catch and format validation errors.
const router = express.Router(); // Creating an Express router to define review-related API routes, which will be mounted in routes/api/index.js.

// DELETE - Delete an existing image for a Spot 
router.delete('/:id', requireAuth, async (req, res, next) => { // requireAuth is the first validation to ensure this user can perform this action
    try{
    // grab our spot id of interest and store it in a variable
    const imageId = req.params.id; 
    // grab our user id from our authentication middleware 
    const userId = req.user.id; 

    const spotImage = await SpotImage.findOne({  // using the findOne method on the SpotImage model because we are wanting to delete the image not the spot itself 
        where : { id: imageId }      // to extract the foreign key spotId which references the Spot's id from our endpoint 
    }); 

    if (!spotImage) {       // if the spotImage does not exist based on the id that was inserted in our endpoint 
        return res.status(404).json({ message: "Spot Image couldn't be found"}); // then return the error message 
    }

    // Find the spot associated with this image 
    const spot = await Spot.findByPk(spotImage.spotId) // find the id associated with the image by the foreign key spotId

    if (!spot || spot.ownerId !== userId) { // if the spot's owner id does not equal the id of the logged in user 
        return res.status(403).json({ message: "Spot must belong to the current user"});
    }

    await spotImage.destroy(); // if all the previous checks pass then go ahead and remove the image of that spot based on its id 

    return res.status(200).json({ message: "Successfully deleted"})
} catch (error) {
    next(error); // pass all other misc errors to global error handler 
}
}); 

module.exports = router; 