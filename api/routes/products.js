const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../auth/check-auth");

const ProductsController = require("../controllers/products");

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
router.get("/", ProductsController.get_all);

// PRODUCTS -- GET one, by id
router.get("/:prodId", ProductsController.get_by_id);

// PRODUCTS -- POST
router.post(
  "/",
  auth,
  upload.single("productImage"),
  ProductsController.post_new_product
);

// PRODUCTS -- PATCH
router.patch("/:prodId", auth, ProductsController.patch_product);

// PRODUCTS -- DELETE
router.delete("/:prodId", auth, ProductsController.delete_by_id);

module.exports = router;
