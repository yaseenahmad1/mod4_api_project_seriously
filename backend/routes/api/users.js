const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');


const router = express.Router();

const validateSignup = [
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a first name.'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a last name.'),
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body; // destructured variable expected from our request body 

      // we need to verify that our user exists already 
      const existingEmail = await User.findOne({
        where: { email } // isolating the email 
      }); 

      // we need to verify if a user exists by its username 
      const existingUsername = await User.findOne({
        where: { username } // isolate our username 
      }); 

      // generate error message if either the email or the username already exists so 
      if (existingEmail || existingUsername) {
        const errorMsg = {
          message: "User already exists",
          errors: {} // create an empty object for errors to be placed into 
        }; 

      if (existingEmail) { // if we have an existing email then we need to respond to client with proper error message 
        errorMsg.errors.email = "User with that email already exists"; // its an objct that will contain our errors object which inside that will give us the key value pair of email = user with that exists
      }; 

      if (existingUsername) { // similarly we do the same with a username that exists already 
        errorMsg.errors.username = "User with that username already exists"; 
      }; 

      return res.status(500).json(errorMsg); // return a 500 if we get this existing email or username dilemma 
      }; 
      
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ firstName, lastName, email, username, hashedPassword });
  
      const safeUser = {
        id: user.id,
        firstname: user.firstName, 
        lastname: user.lastName,
        email: user.email,
        username: user.username
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.status(201).json({
        user: safeUser
      });
    }
  );



module.exports = router;