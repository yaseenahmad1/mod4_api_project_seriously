const express = require('express'); // This imports the express module, which is essential for creating the server and defining routes in an Express application (PROVIDES THE ROUTER CLASS TO CREATE ROUTE HANDLERS : like router.get(), router.post(), etc. Without this you would not be able to define your router in an organized and modular way)
const { Op } = require('sequelize'); // We will use the Operator package to utilize with our query filter 
const { Spot, User, SpotImage, Review, ReviewImage, sequelize } = require('../../db/models'); // This imports the Spot and User models from your Sequelize db/models directory. You need this to interact with the spots in the database (to find all spoits, create a new spot, etc) and in case you need to reference users in some of the routes you need access to this model as well
const { check } = require('express-validator'); // This imports the check method from the express-validator library. Middleware that sanitizes input data. You use this to validate the incoming request data, ensureing that it meets certain criteria
const { handleValidationErrors } = require('../../utils/validation');
const { restoreUser, requireAuth } = require('../../utils/auth'); // This imports the requireAuth middleware from your auth.js utility file. 
// Authentication: This middleware checks if the user is authenticated by verifying the presence of a valid JWT (usually stored in a cookie). If the user is not authenticated, it sends an error response (usually 401 Unauthorized).
// Authorization: You can apply requireAuth to routes where the user must be logged in before they can access the route. For example, when creating a new spot, you’ll want to ensure that only authenticated users can do so.
const user = require('../../db/models/user');
const router = express.Router(); 

const validateSpotCreation = [
    check('address')
    .exists({ checkFalsy: true })
    .withMessage('Address is required.'),
    check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required.'),
    check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required.'),
    check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required.'),
    check('lat')
    .optional({ nullable: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be within -90 and 90'),
    check('lng')
    .optional({ nullable: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be within -180 and 180'),
    check('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
    check('description')
    .exists({ checkFalsy: true })
    .isLength({ min: 30 })
    .withMessage('Description must be a minimum of 30 characters.'),
    check('price')
    .exists({ checkFalsy: true })
    .isFloat({ min: 1 })
    .withMessage('Price per day must be a positive number'), 
    handleValidationErrors
    // you need to add handleValidation 
];

const validReview = [
    check('review')
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
    check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"), 
    // PASS IN 
    handleValidationErrors
];

// // 1. GET /api/spots - Get all spots 
// router.get('/', async(req, res, next) => {
//     try {
//         const spots = await Spot.findAll(); // store this method inside spots variable. This retrieves all spots from the database

//         return res.status(200).json(spots); // send back all spots as a json response
//     } catch (error) {    // Parse any errors to the error-handling middleware
//         next(error);
//     }
// });

// The endpoint below is going to include my query filters and added fields to the response 
// 1. GET /api/spots - Get all spots 
router.get('/', async(req, res, next) => {
  
        let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query; // list all queries that would be requested 

        // Convert query params into the proper types (converting to numbers via parseInt)
        page = parseInt(page) || 1;  // Default to 1 if invalid or not provided
        size = parseInt(size) || 20;  // Default to 20 if invalid or not provided
        minLat = minLat !== undefined ? parseFloat(minLat) : undefined;
        maxLat = maxLat !== undefined ? parseFloat(maxLat) : undefined;
        minLng = minLng !== undefined ? parseFloat(minLng) : undefined;
        maxLng = maxLng !== undefined ? parseFloat(maxLng) : undefined;
        minPrice = minPrice !== undefined ? parseFloat(minPrice) : undefined;
        maxPrice = maxPrice !== undefined ? parseFloat(maxPrice) : undefined

        // Validation
        const errors = {};

        if (isNaN(page) || page < 1) errors.page = "Page must be greater than or equal to 1";
        if (isNaN(size) || size < 1 || size > 20) errors.size = "Size must be between 1 and 20";
        if (minLat !== undefined && (isNaN(minLat) || minLat < -90 || minLat > 90)) errors.minLat = "Minimum latitude is invalid";
        if (maxLat !== undefined && (isNaN(maxLat) || maxLat < -90 || maxLat > 90)) errors.maxLat = "Maximum latitude is invalid";
        if (minLng !== undefined && (isNaN(minLng) || minLng < -180 || minLng > 180)) errors.minLng = "Minimum longitude is invalid";
        if (maxLng !== undefined && (isNaN(maxLng) || maxLng < -180 || maxLng > 180)) errors.maxLng = "Maximum longitude is invalid";
        if (minPrice !== undefined && (isNaN(minPrice) || minPrice < 0)) errors.minPrice = "Minimum price must be greater than or equal to 0";
        if (maxPrice !== undefined && (isNaN(maxPrice) || maxPrice < 0)) errors.maxPrice = "Maximum price must be greater than or equal to 0";

    // If there are errors, respond with a 400 status (but this can also be done by adding a custom validator and linking this to the hnadlevalidationerror)
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors
        });
    }

        // Get all spots with the optional filters, include the images and reviews for avgRating and previewImage 
        const spots = await Spot.findAll({
            where: {
                lat: { [Op.between]: [minLat || -90, maxLat || 90] }, // filter latitude between minLat and maxLat 
                lng: { [Op.between]: [minLng || -180, maxLng || 180] }, // same for longitude 
                price: { [Op.between]: [minPrice || 0, maxPrice || Number.MAX_SAFE_INTEGER] } // same for price
            },
            // apply pagination: limtiing how many results per page 
            limit: size,
            offset: (page - 1) * size, // calculate offset based on the page number (standard equation)
            include: [ // include the required attributes from both models for the average star calculation and preview image 
                {
                    model: SpotImage,
                    attributes: ['url', 'preview']
                },
                {
                    model: Review,
                    attributes: ['stars'],
                    required: false
                }
            ]
        });
    
        let spotsList = spots.map(spot => spot.toJSON()); // sonvert the sequelize instances into json object format 
    
        // Process each spot to calculate avgRating and previewImage
        spotsList.forEach(spot => {
            // Calculate average rating
            let totalStars = 0; // start the star and review count at zero 
            let reviewCount = 0;
            spot.Reviews.forEach(review => { // then loop through each review and add the total stars 
                totalStars += review.stars;
                reviewCount++;
            });
    
            if (reviewCount > 0) {
                spot.avgRating = parseFloat((totalStars / reviewCount).toFixed(1)); // if there is a star for the review divide the star total over the review count and fix the decimal to 1 place
            } else {
                spot.avgRating = null; // otherwise return the value as null
            }
            delete spot.Reviews; // Remove Reviews after processing avgRating
    
            // Calculate preview image
            spot.SpotImages.forEach(image => {
                if (image.preview === true) {
                    spot.previewImage = image.url;
                }
            });
            if (!spot.previewImage) {
                spot.previewImage = 'No preview image available';
            }
            delete spot.SpotImages; // Remove SpotImages after processing previewImage
    
            return spot;
        });
    
        res.json({ Spots: spotsList, page, size });
    });

//         const spotsInfo = await Spot.findAll({
//             where : {
//                 lat: { [Op.between]: [minLat || -90, maxLat || 90] },
//                 lng: { [Op.between]: [minLng || -180, maxLng || 180] },
//                 price: { [Op.between]: [minPrice || 0, maxPrice || Number.MAX_SAFE_INTEGER] }
//             },
//             limit, // include the limit of spots on each page which is 20 
//             offset, // gives the desired batch of spots 
//             attributes : { 
//                 include : [
//                     [
//                         // we are going to extract the stars column from our Reviews table 
//                         sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col("Reviews.stars"), 1)),
//                         "avgRating" 
//                     ]
//                 ],
//             },
//             include : [ {
//                 model: Review, 
//                 attributes: [], // don't return any associated data from Reviews 
//                 required: false
//             },
//             {
//                 model: SpotImage,
//                 where: { preview: true },
//                 attributes: ['url'],
//                 required: false // will allow other spot ids to come up in search 
//               }
//         ], 
//             group: ['Spot.id'] // this makes the average per spot 
//         });  // need to somehow get the avg of all the numbers in the 'star' column in my Reviews table and restrict the average to each indivudal spotId 
//         //for example if in my reviews table i have three spotId 1's then i need the avg of those three id's and then insert it in the details of the spots under each spot 

//         const spotsWithFormattedData = spotsInfo.map(spot => {
//             const spotJson = spot.toJSON();
//             spotJson.previewImage = spotJson.SpotImages?.[0]?.url || null;
//             delete spotJson.SpotImages;
//             return spotJson;
//           });

//           //! we need query filter code here --- we can use .filter to assist in this 
       
//         return res.status(200).json(spotsWithFormattedData); // send back all spots and avgRating and preview image added to that object as a json response
//     } catch (error) {    // Parse any errors to the error-handling middleware
//         next(error);
//     }
// });

// 2. GET /api/spots/current - Get all spots owned by the current user 
router.get(
    '/current', 
    requireAuth, // This ensures that the user is logged in before proceeding to the route handler . Refer to line 639 in Phase 3 Notes and line 211 in Phase 5 notes 
    async (req, res, next) => {
    try { 
        const userId = req.user.id; // Get current user's ID - req.user is typically added by the requireAuth middleware after a user has logged in
        console.log('Current userId:', userId);
        const spots = await Spot.findAll({
            where: { ownerId: userId }, // this line filters by the current user 
            attributes : { 
                include : [
                    [
                        // we are going to extract the stars column from our Reviews table 
                        sequelize.literal('ROUND(AVG("Reviews"."stars"), 1)'),
                        "avgRating" 
                    ]
                ],
            },
            include : [ {
                model: Review, 
                attributes: [] // don't return any associated data from Reviews 
            },
            {
                model: SpotImage,
                where: { preview: true },
                attributes: ['url'],
                required: false // will allow other spot ids to come up in search 
              }
        ], 
            group: ['Spot.id', 'SpotImages.id'] // this makes the average per spot 
        });

        //! We need to implement the same code that gives us avgRating and previewImage 
        const spotsWithFormattedData = spots.map(spot => {
            const spotJson = spot.toJSON();
            spotJson.previewImage = spotJson.SpotImages?.[0]?.url || null;
            delete spotJson.SpotImages;
            return spotJson;
          });

        return res.status(200).json(spotsWithFormattedData); // Send back the spots owned by the current user. So this depends on how many ids are attached to the spot locations so Demo since he is 1 can have 3-4 spots? if we assign the spots that id? 
    } catch (error) {
        next(error);    // this is passing that error on to next middleware which eventually will go to our global middleware in app.js
    }
    });

// steps to confirm this 
// 1, Go to localhost:8000/api/csrf/restore to attain the "XSRF-TOKEN" 
// 2. Grab the fetch api to log in a user and paste that there 
//   fetch('/api/session', {
//     method: 'POST', 
//     headers: {
//         "Content-Type": "application/json",
//         "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
//     },
//     body: JSON.stringify({ credential: '', password: 'password' })
// }).then(res => res.json()).then(data => console.log(data));
// 3. Once that is done save this information into postman by adding the XSRF-TOKEN cookie used for logging in and the cookie from 'Application' that gives us the info for a logged in user
// 4. Once those are save, add the XSRF-TOKEN into the key column in Headers in the request and add the same value in the value column 

// 3. GET /api/spots/:id - Get details of a specific spot 
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id; // extract the id number from the endpoint that is put it (for example if endpoint is 1)
        const details = await Spot.findOne({
            where: { id },         // Pass an object with a 'where' clause to find the spot by id . This is how you query for a spot by its id. The where clause specifies the condition to match ths id. 
                attributes : { 
                    include : [
                        [
                            sequelize.fn('COUNT', sequelize.col('Reviews.id')),
                            "numReviews"
                        ], 
                        [
                            // we are going to extract the stars column from our Reviews table 
                            // sequelize.fn("AVG", sequelize.col("Reviews.stars")), 
                            sequelize.literal('ROUND(AVG("Reviews"."stars"), 1)'),
                            "avgStarRating" 
                        ]
                    ],
                },
                include : [ {
                    model: Review, 
                    attributes: [] // don't return any associated data from Reviews 
                },
                {
                    model: SpotImage,
                    attributes: ['id', 'url', 'preview'],
                    required: false // will allow other spot ids to come up in search 
                },
                {
                    model: User,
                    // where: { preview: true },
                    attributes: ['id', 'firstName', 'lastName'],
                    // required: false // will allow other spot ids to come up in search 
                    as: 'Owner' // error message said we need to provide the alias that ownerId was referencing 
                }
            ], 
                group: ['Spot.id', 'SpotImages.id', 'Owner.id'] // this makes the average per spot 
            });

        if (!details) {           // if the spot id does not exist return an error message 
            return res.status(404).json({ message: "Spot couldn't be found" }); 
        }

        //! We need to convert empty arrays of spotimages to null 

        return res.status(200).json(details);        // send back the details of the Spot id (our first spot which should be '123 Sunny Beach St' and all its info)
    } catch (error) {
        next(error);
    }
});

// 4. POST /api/spots - Create a new spot 
router.post('/',
    requireAuth,    // This ensures we have a logged in user 
    validateSpotCreation,  // This ensures that the user has put in valid inputs 
    async (req, res, next) => {
        try {
            const { address, city, state, country, lat, lng, name, description, price } = req.body; // destructuring our columns into an object to store into our request body
            const ownerId = req.user ? req.user.id : null;    // Authenticated user extracted from our current user logged in store in variable

            const newSpot = await Spot.create({ 
                ownerId, 
                address,
                city,
                state,
                country,
                lat,
                lng, // checking to see why my create spot won't work 
                name,
                description,
                price
             });  
            
            res.status(201).json(newSpot); // respond with a 201 success and the valid input
        } catch (error) {
            next(error);
        }
    });

// 5. POST /api/spots/:id/images - Add an image to a spot 
router.post(
    '/:id/images',
    requireAuth, // Ensure we have a logged in user that can make the edit to a spot 
    async (req, res, next) => {
        try { 
            const spotId = req.params.id; // Extract the spot id from the url endpoint (i.e /api/spots/1/images, req.params.id will give you 1)
            const userId = req.user.id    // Extracted the user's id from our restoreUser middleware 

            // Check if Spot exists
            const spot = await Spot.findByPk(spotId); // creating a variable that will hold the specific spot id we extracted in 'spot' to eventually associate it to user  
            if (!spot) {                  // If spot does not exist then throw an error to the client (null or undefined)
                return res.status(404).json({ message: "Spot couldn't be found" });
            }

            if (spot.ownerId !== userId) {  // chaining our foreign key to our Spot model and comparing it to the user id so if userId two is trying to add an image to a spot not associated with them, they cannot modify it 
                return res.status(403).json({ message: "You must be the owner of this spot to make changes." });
            }

            const { url, preview } = req.body;   // grab the url from the json request body that will be used to add the image

            const newImage = await SpotImage.create({
                spotId,  // foriegn key that associates this image with a specific spot. Ensures that the image is correctly associated with a spot in Spots table  
                url,      // and the url from our request body in order to add an image to a spot 
                preview   // preview has to be true somehow even though defaultValue is set to false
            });

            return res.status(201).json({
                id: newImage.id,    // refers to the primary key (id) of the newly created record in the SpotImages table
                url: newImage.url,  // refers to the url that will be newly added to the SpotImages table
                preview: newImage.preview   // refers to the 'preview' field (true/false) that will be set for the new image 
            });    // respond in the response body with a 201 succeess and a json format of the request back to user
        }
        catch(error) {                 // if any error occurs (wrong id or invalid input)
            next(error);               // then pass on to our global error handler middleware
        }
    });

// 6. PUT /api/spots/:id - Edit a spot 
// Goal is to be able to edit any spot's field ( address, city, state, country, etc) (if you are the owner) 
router.put(         // this is a put request
    '/:id',
    requireAuth,    // Make sure we have a valid logged in user
    validateSpotCreation, // ensure that whatever edit is made has passed our custom validationSpotCreation middleware that checks each field
    async (req, res, next) => {
    try {
        const spotId = req.params.id; // extract our id from our endpoint and store it as spotId
        const userId = req.user.id;   // ensure we have a valid user signed in to make the edits 

        const spot = await Spot.findByPk(spotId); // pull out our actual spot by finding the spot's primary key id 

        if (!spot) { 
            return res.status(404).json({ message: "Spot couldn't be found"});
        }; // If the id we provide in 'findByPk' is not valid. What happens if the spotId does not exist? How does this line work?

        if (spot.ownerId !== userId) { // Essentially saying that if our foreign key in spots is not the same as the user id who is logged in 
            return res.status(403).json({ message: "You must be the owner to edit this spot"}); // they cannot make changes to this spot 
        }

        // perform the update :
        const updatedSpot = await spot.update(req.body); // update and store the updated spot by using the update method on the spot instance with whatever edit has been made in our request body
        
        // return res.status(400).json("if it doesnt pass our validation")

        return res.status(200).json(updatedSpot); // returning a 200 status for a success and returning the editedSpot with changed and unchanged fields back to user

    } catch(error) {            // catch any errors that occur and pass them on to our global middleware 
        next(error);
    }
    }); 

// 7. DELETE /api/spots/:id - Delete an existing spot 
// The goal is to delete an existing spot by using the spotId
router.delete(
    '/:id', // the endpoint will be specified by the specific spot we want to delete
    requireAuth, // Ensure we have a valid user who has the authorization to delete the spot 
    async (req, res, next) => {
       try { 
        // grab our spotId 
        const spotId = req.params.id; 
        const userId = req.user.id;   // pulled from our middleware in app.js

        const spot = await Spot.findOne({ where: { id: spotId }}); // set the spot id to its related spot 

        if (!spot) {    // if the spotId does not exist aka if the spot does not exist
            return res.status(404).json({ message: "Spot couldn't be found."}); 
        }

        if (spot.ownerId !== userId) {  // if the spot foreign key does not match the user id primary key 
            return res.status(403).json({ message: "You must be the owner of this spot to delete it."}); // send an error message 
        } 

        await spot.destroy(); // if the previous two checks pass then delete spot not Spot! (we do not want to destroy the model rather the spot id chained to the model stored in our spot variable) 

        res.status(200).json({ message: "Successfully deleted"}); // Send a success response back stating that spot has been deleted. 
        }
        catch (error) { // if any errors persist...
            next(error); // pass them onto to error handler middleware
        }
});

// 9. GET /api/spots/:spotId/reviews - Get all reviews by a spot's id
// API DOCS REQUIREMENT - 200 success, 404 with messsage "spot couldn't be found"

// Set up our method and endpoint
router.get('/:spotId/reviews', async (req, res, next) => { // if we are just wanting to see reviews of a spot we may not need a requireAuth or a logged in user (a guest on the website should be able to view this)
    try {
    // extract our spotId
    const spotId = req.params.spotId; // this is specifically grabbing our spotId from our endpoint
    const spot = await Spot.findByPk(spotId); // associate a spot with its spotId

    if (!spot) { // if our spot does not exist 
        return res.status(404).json({ message: "Spot couldn't be found"}); // return a 404 with message 
    }

    const reviews = await Review.findAll(
        { where : { spotId },       // grab all reviews from that spotId
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage, 
                attributes: ['id', 'url']
            }
        ],
        order: [['createdAt', 'DESC']] // adding ordering here to get newest reviews first
    }); 

    //format our response 
    const formattedReviews = reviews.map(review => review.toJSON()); 

    return res.status(200).json({Reviews: formattedReviews}); // otherwise return all the reviews of that spotId with a 200 status
    } catch (error) {
        next(error); // throw any misc errors into our global error handler middleware
    }
}); 

// 10. POST /api/spots/:spotId/reviews - Create a review for a spot based on the spot's id
// For this one, you must be a user to write a review and so let's implement this code accordingly
router.post('/:spotId/reviews', requireAuth, validReview, async (req, res, next) => {
    try { 
    // extract the spot Id and store it in a variable
    const spotId = req.params.spotId; 
    const userId = req.user.id; // grabbing this from our requireAuth middelware

    // Checking if the spot exists
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found"})
    }

    const { review, stars } = req.body; // extract the typed review from the request body

    // Check if a review from this user already exists for this spot 
    const existingReview = await Review.findOne({
        where: { userId, spotId }
    });

    if (existingReview) { // if the review from the current user already exitst for the spot 
        return res.status(500).json({ message: "User already has a review for this spot"});
    }

    const newReview = await Review.create({ 
        userId,
        spotId,
        review,
        stars
    });

    const fullReview = await Review.findByPk(newReview.id, {
        include: {
        model: User,
        attributes: ['firstName'] // Only include firstName 
        }
    }); 

    return res.status(201).json(newReview);     // Return the newly created review 
   

    } catch (error) {
        next(error);
    }
});






module.exports = router; // This makes the spots router available to index.js

