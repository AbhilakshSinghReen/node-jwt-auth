const express = require("express");

const { requireSuperAdmin } = require("../middlewares/authMiddleware");
const { createNewUser } = require("../controllers/userControllers");

const router = express.Router();

/*
Add authorized email. (Add user with dummy password)
Restrict authorized email. (Mark user as restricted)
Unrestrict authorized email (mark user as unrestricted)

*/

router.post("/create-new-user", requireSuperAdmin, createNewUser);

module.exports = router;
