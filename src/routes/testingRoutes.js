const express = require("express");

const { requestResetPassword } = require("../controllers/userControllers");

const router = express.Router();

router.get("/dummy", requestResetPassword);

module.exports = router;
