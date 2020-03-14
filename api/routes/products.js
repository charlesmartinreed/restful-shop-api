const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

// MULTER CONFIG
const storage = multer.diskStorage({
  // where to save incoming file
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  // how the incoming file is named
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

// FILE TYPE RESTRICTIONS
const fileFilter = (req, file, cb) => {
  const validTypes = ["image/jpeg", "image/png"];
  if (validTypes.indexOf(file.mimetype) != -1) {
    cb(null, true);
  } else {
    // reject the file, no error
    cb(null, false);
  }
};
// init multer with config, passing along the upload destination for parsed form data - path here is relative
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
});

// import our Product model
const Product = require("../models/product");

// PRODUCTS -- GET all
// is a middleware/handler used to capture the uploaded image
router.get("/", (req, res, next) => {
  // where, limit, etc are valid params here
  Product.find()
    .select("name price _id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              url: `http://localhost:${process.env.PORT}/products/${doc._id}`
            }
          };
        })
      };
      res.status(200).json(response);
      // if (docs.length > 0) {
      //   res.status(200).json(docs);
      // } else {
      //   // optional
      //   res.status(404).json({
      //     message: "No entries found"
      //   })
      // }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

// PRODUCTS -- GET one, by id
router.get("/:prodId", (req, res, next) => {
  const id = req.params.prodId;
  Product.findById(id)
    .select("name price _id")
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
});

// PRODUCTS -- POST
router.post("/", upload.single("productImage"), (req, res, next) => {
  // req.file made avaiable by our upload.single call
  console.log(req.file);

  const { name, price } = req.body;
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name,
    price
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
});

// PRODUCTS -- PATCH
router.patch("/:prodId", (req, res, next) => {
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
});

router.delete("/:prodId", (req, res, next) => {
  const id = req.params.prodId;

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
  // res.status(200).json({
  //   message: "Deleted product",
  //   id: req.params.prodId
  // });
});

// PRODUCTS -- DELETE

module.exports = router;
