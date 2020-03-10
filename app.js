const express = require("express");
const app = express();

// MIDDLEWARE - incoming requests pass through here
app.use((req, res, next) => {
  res.status(200).json({
    message: "Working just fine."
  });
});

module.exports = app;
