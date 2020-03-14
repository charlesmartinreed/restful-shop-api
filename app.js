const express = require("express");
const app = express();
const logger = require("morgan");
const mongoose = require("mongoose");
const config = require("dotenv").config();

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
// console.log(process.env.DB_USER, process.env.DB_PASS);
// mongoose db connection
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@october-xuadd.mongodb.net/test?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

// MIDDLEWARE - incoming requests pass through here

app.use(logger("dev")); // running morgan logger in "dev" mode - logs in the console

// SUPPORTED ROUTES
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// publically exposes the uploads folder for any requests made to the uploads folder route
app.use("/uploads", express.static("uploads"));

// CORS FIX
app.use((req, res, next) => {
  // add the neccessary headers when a res is sent - * allows access to any client
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // sent by browser before POST or PUT request - used to check if operation is OK
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");

    // we don't need to go to our routes because the options request is just for discovering which operations are OK with our API server
    return res.status(200).json({});
  }

  // allows the other routes to take over when the above code is not applicable
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// NON-SUPPORTED ROUTES
app.use((req, res, next) => {
  // error obj derived from node.js
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// error handler; from failed routes, db operations, etc
app.use((error, req, res, next) => {
  // thrown errors caught here
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
