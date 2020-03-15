const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users");
const auth = require("../auth/check-auth");

// POST -- CREATE USER
router.post("/signup", UserController.user_create);

// POST -- LOGIN EXISTING USER
router.post("/login", UserController.user_login);

// DELETE -- REMOVE AN EXISTING USER
router.delete("/:userId", auth, UserController.user_delete);

module.exports = router;
