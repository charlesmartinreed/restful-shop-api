const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// POST -- CREATE USER
router.post("/signup", (req, res, next) => {
  // check for existence of current email in DB
  User.find({ email: req.body.email }).then(user => {
    // no user returns an empty array, not null
    if (user.length >= 1) {
      // 409 Conflict - could not process request because of conflift in current state of resource
      return res
        .status(409)
        .json({ message: "User already exists with this email address" });
    } else {
      // IF NO CURRENT USER, CREATE NEW ONE
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
    }
  });
});

// POST -- LOGIN EXISTING USER
router.post("/login", (req, res, next) => {
  //  check for existence of user
  User.find({ email: req.body.email })
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Authentication failed"
        });
      }

      // if user found, check param passed password against stored password
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Authentication failed"
          });
        }
        if (result) {
          // if passwords match, create a JSON Token
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_SECRET,
            { expiresIn: "1hr" }
          );

          return res.status(200).json({
            message: "Authentication successful",
            token
          });
        }

        res.status(401).json({
          message: "Authentication failed"
        });
      });
    })
    .catch(error => {
      console.log(err);
      res.status(500).json({
        error
      });
    });
});

// DELETE -- REMOVE AN EXISTING USER
router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .then(result => {
      res.status(200).json({
        message: "User was successfully removed"
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

module.exports = router;
