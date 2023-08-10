
const express = require("express");
const { registerUser, loginRoute } = require("../controllers/authController");


const router = express.Router();



router.post("/register", registerUser);
router.post("/login", loginRoute);

module.exports = router;
