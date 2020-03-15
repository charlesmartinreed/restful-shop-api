const express = require("express");
const router = express.Router();
const auth = require("../auth/check-auth");
const OrdersController = require('../controllers/orders');

// ORDERS - GET all
router.get("/", auth, OrdersController.orders_get_all);

// ORDERS - GET by id
router.get("/:orderId", auth, OrdersController.get_by_id);

// ORDERS - POST new order
router.post("/", auth, OrdersController.create_new_order);

// DELETE - remove order by id
router.delete("/:orderId", auth, OrdersController.delete_by_id);

module.exports = router;
