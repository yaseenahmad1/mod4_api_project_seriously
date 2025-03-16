# PHASE 5 ( VALIDATING THE REQUEST BODY )
--------------------------------------------------------------------------------------------------------

Phase 5 is going to revolve largely around the `express-validator` package that we are going to use to do a bunch of server side validation of user input for logging in and signing up a user. 

So first if you have not already you are going to have to install : 

>> npm install express-validator 

Next we are going to create a new `file` in our `utils` folder called `validation.js` so let's hop in there and create that file : 

```plaintext
.
|-- backend/
  |-- bin/
    |-- www
  |-- config/
    |-- database.js
    |-- index.js 
  |-- db/
    |-- migrations/
      |-- 20230316171729-create-user.js
    |-- models/
      |-- index.js
      |-- user.js
    |-- seeders/
      |-- 20230316171729-demo-user.js
  |-- node_modules/
  |-- routes/
    |-- index.js
  |-- utils/
    |-- auth.js
    |-- validation.js
  |-- .env
  |-- .sequelizerc
  |-- app.js
  |-- package-lock.json
  |-- package.json
  |-- psql-setup-script.js
|-- frontend/
|-- images/
|-- .gitignore
|-- README.md 
```

# VALIDATION MIDDLEWARE 
--------------------------------------------------------------------------------------------------------

The one thing that we are going to put into this file is : 

backend/utils/validation.js
```js
const { validationResult } = require('express-validator'); // importing that validationResult function from the 'express-validator' package

//middleware for formatting errors from express-validator middleware 
// (to customize, see express-validator's documentation)
const handleValidationErrors = (res, _res, next) => {
    const validationErrors = validationResult(req); // we are importing this validationResult function from our 'express-validator' package
    // And what this does is it will gather up any errors that were generated from the various checks that we can use this package to perform and save them as this array here.

    // Then we are going to check to see if that array is empty or populated with any 'error messages'
    if (!validationErrors.isEmpty()) { // If it is NOT empty (i.e. if we DO have errors that happened)
        const errors = {};             // We are going to essentially turn those errors into a nicely formatted object 
        validationErrors               
        .array()
        .forEach(error => errors(error.param) = error.msg);

    const err = Error("Bad request.");
    err.errors = errors; 
    err.status = 400; 
    err.title = "Bad request.";
    next(err);                        // And pass everything along to our error handling middleware
    }
    next();                           // Otherwise, if we don't have any errors, we will go ahead and invoke next 
};

module.exports = {
    handleValidationErrors
};
```

So... that is the purpose of this ^ middleware here. We will see how it works when we build up a set of checks shortly. We will definitely be coming back to that middleware in a little bit. 

# VALIDATING LOGIN REQUEST BODY 
--------------------------------------------------------------------------------------------------------

So, next we will hop back into our `session.js` file and import the `check` function from the `express-validator` package and our new `middleware`, the `handleValidationErrors`. 

backend/routes/apu/session.js
```js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();

// ...
```

^ The `check` function from `express-validator` will be used with the `handleValidationErrors` to validate the body of a request. 

The `POST /api/session` login route will expect the body of the request to have a key of `credential` with either the `username` or `email` of a user and a key of `password` with the password of the user. 

So, make a `middleware` valled `validateLogin` that will check these keys and validate them : 

backend/routes/api/session.js
```js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();

const validateLogin = [
    check('credentials')    // checking to make sure that we are actually given a credential property and not just an empty string
        .exists({ checkFalsy: true })   
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')       // checking that we are given a password string as well 
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors  // then we are implementing our handleValidationErrors. So, what this package is going to do is check the `credential` property and IF WE FAIL THIS CHECK, it is going to store an error message (.withMessage) and same with `password`. And at the end of this process, after it performs all of these checks, then with our handleValidationErrors middleware that we implemented previously. We are going to gather up `(validationRequest(req)` all of those error messages into this array `const validationErrors`, convert them into an object and send it along to our error messages so that is the purpose of that middleware. If you use the `express-validator` package, you are going to NEED to use the `handleValidationErrors` middleware as well otherwise the errors that are generated by these `checks` are just going to kind of live in the "void." In order to actually grab those and idenitfy that you have erros you will need to use that middleware! It is very easy to apply! All you have to do write out your checks (which might require a little bit of digging into documentation) but after that, you just add a comma and throw in `handleValidationErrors` and you are good to go! 
];

// ...
```

^ This will go right above our `Log In` route. And what we are doing is we are going to `check` a couple of properties on a `request body`. That is what this `check` function does. It takes in the name of a property of the `request body` and performs a series of checks on it. 

If you want to dig into some of the things that this package is capable of doing and the different ways that we can check or test the input, I would very strongly recommend just googling `express-validator npm`. You will find the node package and some pretty decent documentation. This package is pretty great! There are a fair number of pre-built functions that you can use, but you are also able to write `custom validators` using this package as well. 

So this is a VERY VERY USEFUL package for `Express` side input validation!

So now that we have added that code in, all that we need to do now is add the `validation login middleware` to our `login endpoint` : 

backend/routes/api/session.js
```js
// .... 

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];


// Log in
router.post(
    '/',
    validateLogin,   // adding this right between our path and the route handler function
    async (req, res, next) => {
      const { credential, password } = req.body;
  
      const user = await User.unscoped().findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
  
      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided credentials were invalid.' };
        return next(err);
      }
  
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );

  // ...
```

So we should be able to test a little bit of extra validation on our `Log In` route her which will be our next step...

# TEST THE LOGIN VALIDATION
--------------------------------------------------------------------------------------------------------

>> localhost:8000/api/csrf/restore

First and foremost, we are going to need a new `csrf-token` and then we are going to start doing some fetch requests : 

```js
fetch('/api/session', {
    method: 'POST', 
    headers: {
        "Content-Type": "application/json",
        "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
    },
    body: JSON.stringify({ credential: '', password: 'password' })
}).then(res => res.json()).then(data => console.log(data));
```

*Remember to replace the `<value of XSRF-TOKEN cookie>` with the value of the XSRFR-TOKEN cookie found in your browser's DevTools or by going to the `/api/csrf/restore` route to add the cookie back. 

So, we are going to start by sending a request with an empty string for credential and then we will test an empty string for password as well and then move on to our `Sign Up Validation`. 

So in the `console` paste the `fetch` request in there with the XSRF-TOKEN pasted in the placeholder and hit enter (send) so perfect, we are getting an `Error` that is saying `Please provide a valid email or username.` which is the message coming from `.withMessage('Please provide a valid email or username.')`

So let's also test if we have an empty password : 

```js
fetch('/api/session', {
    method: 'POST', 
    headers: {
        "Content-Type": "application/json",
        "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
    },
    body: JSON.stringify({ credential: 'Demo-lition', password: '' })
}).then(res => res.json()).then(data => console.log(data));
```


