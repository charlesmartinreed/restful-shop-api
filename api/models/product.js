const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    required: true,
    type: String
  },
  price: {
    required: true,
    type: Number
  },
  productImage: {
    required: true,
    type: String
  }
});

module.exports = mongoose.model("Product", ProductSchema);
