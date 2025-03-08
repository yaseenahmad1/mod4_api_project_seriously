We are going to set up the authenticate me project skeleton for the MOD 4 project
Keep in mind this is only the backend half of the authenticate me code!

1. Set up your repository 

Structure of the repo 
- At the root of the project skeleton, we have a 
    1. backend folder
    2. frontend folder
    3. .gitignore
    4. README.md


This needs to be the initial structure for your repository. This stuff CANNOT be nested further into another folder. This is what your primary repository page should look like 

Keep in mind github does not track empty folders so in both of the backend and frontend folders, I have kept a .keep file for the sake of pushing but feel free to remove those files once those folders have been filled with content/files.

Let's take a look at our .gitignore file : 

```.gitignore
node_modules
.env
build
.DS_Store
*.db
```

Let's take a quick look at our .gitignore. Just some files we don't want to push up to our github repo. Like our .env file where we are storing some potentially sensitive information like SECRET KEYS, our node_modules and our local sqlite3 databse. 

Let's take a look our Phase 0: 

First and foremost, we are going to need to initialize node. 

- So let's cd into our backend folder and the run : 
        
    npm init -y

So this is a pretty lengthy list of npm packages 
Really most of what we will be using : 

- `cookie-parser` - parsing cookies from requests
^ Allowing us to parse and read and access cookies that are coming in as headers 
for the requests

Some security packages
- `cors` - CORS
- `csurf` - CSRF protection


- `dotenv` - load environment variables into Node.js from a `.env` file
^ Making sure we can read our environmnet variables 

Some Express stuff here 
- `express` - Express
- `express-async-errors` - handling `async` route handlers


- `helmet` - security middleware
^ Some extra layers of security 

- `jsonwebtoken` - JWT
^ This will let us create those JWTs that we will need down the line 

- `morgan` - logging information about server requests/responses
^ This package here just prints some stuff to our terminals so we can see some information 
about the requests that are coming in 


- `per-env` - use environment variables for starting app differently
^ A package we are going to use in the start script for our application. 
This package just helps us determine one environment we are running in when we do boot up our server and then allows us to run different start up scripts depending on the result of that check. 


- `sequelize@6` - Sequelize
- `sequelize-cli@6` - use `sequelize` in the command line


- `pg` - use Postgres as the production environment database
^ This is what is going to allow us to interact with Postgres
Postgres is the RDBMS that we are going to be using on the production side of our application 


Then we have a few packages that are going to be installed on the development side that are not going to be necessary in production: 

`npm install -D` the following packages as dev-dependencies:

- `sqlite3` - SQLite3

- `dotenv-cli` - use `dotenv` in the command line
^ Which can be particularly useful for a few individuals who happen to have issues with the dotenv package which is an issue a few people tend to run into. 

- `nodemon` - hot reload server `backend` files
^ And then of course the nodemon package which we will be using quite a bit of in the development of our application so that our server continually reboots when we make changes to our code. 

So that is all the packages we are going to need to install for the time being! 

So we go into our backend server folder and run the command : 

npm install cookie-parser cors csurf dotenv express express-async-errors etc(separated by spaces)

then run : 

npm install -D sqlite3 dotenv-cli nodemon 

# CONFIGURATION 

Let's take a look at configuration. So in the backend folder, by the way, there are a lot of files we are going to be creating and a lot of code we are going to be adding into this code base. So check to make sure that where you are putting this stuff is in the correct spot. We put things in the wrong place, things are going to break. So one thing we should be doing is frequently testing the code base whenever possible just to make sure that all of those steps that we are taking are working in sync. 

So let's start in the backend folder we are going to create a .dotenv file 

```plaintext
.
|-- backend/
  |-- node_modules/
  |-- .env
  |-- package-lock.json
  |-- package.json
|-- frontend/
|-- images/
|-- .gitignore
|-- README.md 

```

Let's get started by pasting the code provided in the authenticate me startup into our .env file : 

``` .dotenv file 
PORT=8000           // setting our port variable 
DB_FILE=db/dev.db   // path to our local database file
JWT_SECRET=<<generate_strong_secret_here>>      // we will need a secret value here
JWT_EXPIRES_IN=604800                           // the length of time it will take for a JWT to expire that we create 
SCHEMA=<<custom_schema_name_here>>              // Revisit this 
```

- Next, we will create a Javascript configuration file that will read the environment variables so this file is going to be meant for just extracting these environment variable values from our .dotenv file and exporting them for use throughout the rest of our application. So we are going to want a config folder in our backend folder and then an index.js file in that folder. 

```plaintext
.
|-- backend/
  |-- config/
    |-- index.js 
  |-- node_modules/
  |-- .env
  |-- package-lock.json
  |-- package.json
|-- frontend/
|-- images/
|-- .gitignore
|-- README.md 

```

So then inside our backend/config/index.js : 

```js

module.exports = {
    environment: process.env.NODE_ENV || 'developmnet',
    port: process.env.PORT || 8000,
    dbFile: process.env.DB_FILE, 
    jwtConfig: {
        secret: process.env.JWT_SECRET, 
        expiresIn: process.env.JWT_EXPIRES_IN
    }
}; 
```

So now all of those variables that we just set in our .env file, the exception of that schema property so far, is all being extracted here with that `process.env` and then export it, again, so we can use these variables as data elsewhere in our code! 

So the next step is going to be to set up `Sequelize` so we will want to `npx sequelize init` but before we do that we want to create our `.sequelizerc` file to tell `Sequelize` where all of the new files and folders should go, so we will want to create that file in our `backend` folder. 

```plaintext
.
|-- backend/
  |-- config/
    |-- index.js 
  |-- node_modules/
  |-- .env
  |-- .sequelizerc
  |-- package-lock.json
  |-- package.json
|-- frontend/
|-- images/
|-- .gitignore
|-- README.md 
```

```backend/.sequelizerc/

const path = require('path');

module.exports = {
    config: path.resolve('config', 'databse.js'), 
    'models-path': path.resolve('db', 'models'), 
    'seeders-path': path.resolve('db', 'seeders'), 
    'migrations-path': path.resolve('db', 'migrations')
};
```

You have seen this code before. This is just a set of instructions to tell `Sequelize` where to generate and where to find certain files and folders. So now that we have this set up we can now run our `npx sequelize init` command and it should create the correct file and folder structure for us. 

So make sure you are in the backend folder and run: 

npx sequelize init 

So we now have a db folder and migrations, models, seeders subfolders in that db folder and a database.js file was created in our config directory.

```plaintext
.
|-- backend/
  |-- config/
    |-- database.js
    |-- index.js 
  |-- db/
    |-- migrations/
    |-- models/
    |-- seeders/
  |-- node_modules/
  |-- .env
  |-- .sequelizerc
  |-- package-lock.json
  |-- package.json
|-- frontend/
|-- images/
|-- .gitignore
|-- README.md 
```

In that config/database.js file we are going to find a bunch of pre-generated json for us and we will take all of that and get rid of that because we are not going to use that anymore. Instead, we will replace that by inserting the provided json in the README : 

```config/database.js 

const config = require('./index');

module.exports = {
    development: {
        storage: config.dbFile, 
        dialect: "sqlite", 
        seederStorage: "sequelize", 
        logQueryParameters: true, 
        typeValidation: true
    }, 
    production: {
        use_env_variable: 'DATABSE_URL', 
        dialect: 'postgres',
        seederStorage: 'sequelize',
        dialectOptions: {
            ssl: {
                require: true, 
                rejectUnauthorized: false
            }
        }, 
        define: {
            schema: process.env.SCHEMA
        }
    }
}; 
```

So the `development object` we have seen before we have discussed this previously when we first set up Sequelize. 
This `production object` is one that we have not seen before so this `production object` is what is going to be used by Sequelize for our project minutes in production. So some of the configuration for our database, our connection to the database is going to change depending on the environment we are working in. For instance, we are going to be using `Postgres` in production rather than sqlite. So some of the other settings we don't need to worry about. We are going to be accessing the database through an environment variable which we are going to define on `Render` which is the service that we will eventually be hosting this codebase on so we will get there around the end of this series of videos. 

The `schema` environment variable we will leave this alone for now. We will dive into what this schema is doing for us and its purpose once we start creating some tables in our database. So we will get there soon! 

# CREATING A NEW FILE IN OUR BACKEND FOLDER CALLED `psql-set-script.js`

```plaintext
.
|-- backend/
  |-- config/
    |-- database.js
    |-- index.js 
  |-- db/
    |-- migrations/
    |-- models/
    |-- seeders/
  |-- node_modules/
  |-- .env
  |-- .sequelizerc
  |-- package-lock.json
  |-- package.json
  |-- psql-setup-script.js
|-- frontend/
|-- images/
|-- .gitignore
|-- README.md 
```

And now we will copy and paste the code from the README into that file. 

backend/psql-setup-script.js
```js
const { sequelize } = require('./db/models'); 

sequelize.showAllSchemas({ logging: false }).then(async (data) => {
  if (!data.includes(process.env.SCHEMA)) {
    await sequelize.createSchema(process.env.SCHEMA);
  }
}); 


