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

Some secur 
- `cors` - CORS
- `csurf` - CSRF protection
- `dotenv` - load environment variables into Node.js from a `.env` file
- `express` - Express
- `express-async-errors` - handling `async` route handlers
- `helmet` - security middleware
- `jsonwebtoken` - JWT
- `morgan` - logging information about server requests/responses
- `per-env` - use environment variables for starting app differently
- `sequelize@6` - Sequelize
- `sequelize-cli@6` - use `sequelize` in the command line
- `pg` - use Postgres as the production environment database

`npm install -D` the following packages as dev-dependencies:

- `sqlite3` - SQLite3
- `dotenv-cli` - use `dotenv` in the command line
- `nodemon` - hot reload server `backend` files

