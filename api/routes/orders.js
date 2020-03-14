const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../auth/check-auth");

const Order = require("../models/orders");
const Product = require("../models/product");

// ORDERS - GET all
router.get("/", auth, (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .then(docs => {
      console.log(docs);
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc._productId,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: `http://localhost:${process.env.PORT}/orders/${doc._id}`
            }
          };
        })
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
});

// ORDERS - GET by id
router.get("/:orderId", auth, (req, res, next) => {
  Order.findById(req.params.orderId)
    .select("quantity _id product")
    .then(order => {
      if (!order) {
        return res.status(404).json({ message: "No order found for that ID" });
      }
      res.status(200).json({
        order,
        request: {
          type: "GET",
          url: `http://localhost:${process.env.PORT}/orders`
        }
      });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

// ORDERS - POST new order
router.post("/", auth, (req, res, next) => {
  const { productId, quantity } = req.body;

  // first, check if we have a product for a given id
  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "No product found with that ID"
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity,
        product: productId
      });

      return order.save();
    })
    .then(result => {
      // contains order id AND product id
      console.log(result);
      res
        .status(201)
        .json({
          message: "Order stored",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity
          },
          request: {
            type: "GET",
            url: `http://localhost:${process.env.PORT}/orders/${result._id}`
          }
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            error
          });
        });
    });
});
// DELETE - remove order by id
router.delete("/:orderId", auth, (req, res, next) => {
  Order.findByIdAndDelete({ _id: req.params.orderId })
    .then(result => {
      res.status(200).json({
        message: "Order was successfully deleted",
        request: {
          type: "POST",
          url: `http://localhost:${process.env.PORT}/orders`,
          body: { productId: "ID", quantity: "Number" }
        }
      });
    })
    .catch(error => res.status(500).json({ error }));
});
module.exports = router;
