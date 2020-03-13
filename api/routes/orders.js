const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/orders");

// ORDERS - GET all
router.get("/", (req, res, next) => {
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
router.get("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: `GET request for order #${req.params.orderId} received on orders route`,
    id: req.params.orderId
  });
});

// ORDERS - POST new order
router.post("/", (req, res, next) => {
  const { productId, quantity } = req.body;

  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    quantity,
    product: productId
  });

  order
    .save()
    .then(result => {
      // contains order id AND product id
      console.log(result);
      res.status(201).json(result);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error
      });
    });

  // res.status(201).json({
  //   message: "New order was created!",
  //   order: { productId, quantity }
  // });
});

// DELETE - remove order by id
router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Order was deleted",
    id: req.params.orderId
  });
});
module.exports = router;
