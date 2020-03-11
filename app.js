const express = require("express");
const app = express();
const logger = require("morgan");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

// MIDDLEWARE - incoming requests pass through here

app.use(logger("dev")); // running morgan logger in "dev" mode - logs in the console

// SUPPORTED ROUTES
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
