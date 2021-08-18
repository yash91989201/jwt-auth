const express = require("express");
const passport = require("passport");

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require("dotenv").config();
//  Storing port in a variable
const PORT = process.env.PORT;

// Create the Express application
var app = express();

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
require("./config/database/connection");

// Must first load the models
require("./models/user");

// Pass the global passport object into the configuration function
require("./config/passport/jwtStrategy");

// This will initialize the passport object on every request
app.use(passport.initialize());

// Instead of using body-parser middleware, use the new Express implementation of the same thing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(require("./routes"));

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(PORT, (err) => {
  console.log(`${err ? err : `Server started at port ${PORT}`}`);
});
