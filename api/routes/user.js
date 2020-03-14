const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

// CREATE A NEW USER
router.post("/signup", (req, res, next) => {
  // hashes are one way, can't be 'unhashed'
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err
      });
    } else {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash
      });

      //   save the newly created user to database
      user
        .save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: "New user created"
          });
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({ error });
        });
    }
  });
});

// LOGIN A CURRENT USER

module.exports = router;
