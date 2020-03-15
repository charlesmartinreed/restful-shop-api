const Product = require("../models/product");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

exports.get_all = (req, res, next) => {
  // where, limit, etc are valid params here
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: "GET",
              url: `http://localhost:${process.env.PORT}/products/${doc._id}`
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.get_by_id = (req, res, next) => {
  const id = req.params.prodId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then(doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "Get all products with url",
            url: `http://localhost:${process.env.PORT}/products/`
          }
        });
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
};

exports.post_new_product = (req, res, next) => {
  const { name, price } = req.body;
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name,
    price,
    productImage: req.file.path
  });

  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: `http://localhost:${process.env.PORT}/products/${result._id}`
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.patch_product = (req, res, next) => {
  const id = req.params.productId;

  // creating a dynamic object that captures the altered values from the request params
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.findByIdAndUpdate(
    { _id: req.params.prodId },
    { $set: updateOps },
    { useFindAndModify: false }
  )
    .exec()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Producted updated",
        request: {
          type: "GET",
          url: `http://localhost:${process.env.PORT}/products/${result._id}`
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  // res.status(200).json({
  //   message: "Updated product",
  //   id: req.params.prodId
  // });
};

exports.delete_by_id = (req, res, next) => {
  const id = req.params.prodId;

  // FIND THE LOCALLY STORED IMAGE, REMOVE IT FROM FOLDER
  Product.find({ _id: id })
    .then(doc => {
      fs.unlinkSync(doc[0].productImage);
    })
    .catch(err => {
      console.log(err);
    });

  Product.findByIdAndDelete({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: `http://localhost:${process.env.PORT}/products`,
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
