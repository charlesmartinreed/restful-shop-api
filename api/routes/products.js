const express = require("express");
const router = express.Router();

// PRODUCTS -- GET all
router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "GET request to /products received"
  });
});

// PRODUCTS -- GET one, by id
router.get("/:prodId", (req, res, next) => {
  const id = req.params.prodId;

  if (id === "special") {
    res.status(200).json({
      message: "Looks like you know the secret password!",
      id
    });
  } else {
    res.status(200).json({
      message: `Get request for product id: ${id} at /products received`,
      id
    });
  }
});

// PRODUCTS -- POST
router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "POST request to /products received"
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
