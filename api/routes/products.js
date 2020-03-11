const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// import our Product model
const Product = require("../models/product");

// PRODUCTS -- GET all
router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "GET request to /products received"
  });
});

// PRODUCTS -- GET one, by id
router.get("/:prodId", (req, res, next) => {
  const id = req.params.prodId;
  Product.findById(id)
    .exec()
    .then(doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid product found with that product ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// PRODUCTS -- POST
router.post("/", (req, res, next) => {
  const { name, price } = req.body;
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name,
    price
  });

  // try {
  //   const result = await product.save();
  //   console.log(result);

  //   return res.status(201).json({
  //     message: "POST request to /products handled",
  //     createdProduct: product
  //   });
  // } catch (err) {
  //   console.log(err);
  // }

  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST request to /products",
        createdProduct: product
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// PRODUCTS -- PATCH
router.patch("/:prodId", (req, res, next) => {
  res.status(200).json({
    message: "Updated product",
    id: req.params.prodId
  });
});

router.delete("/:prodId", (req, res, next) => {
  res.status(200).json({
    message: "Deleted product",
    id: req.params.prodId
  });
});

// PRODUCTS -- DELETE

module.exports = router;
