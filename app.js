const express = require("express");
const app = express();

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

// MIDDLEWARE - incoming requests pass through here
// app.use((req, res, next) => {
//   res.status(200).json({
//     message: "Working just fine."
//   });
// });
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

module.exports = app;
