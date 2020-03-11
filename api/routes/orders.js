const express = require("express");
const router = express.Router();

// ORDERS - GET all
router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "GET request for orders route received"
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
  res.status(201).json({
    message: "New order was created!"
  });
});

// DELETE - remove order by id
router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Order was deleted",
    id: req.params.orderId
  });
});
module.exports = router;
