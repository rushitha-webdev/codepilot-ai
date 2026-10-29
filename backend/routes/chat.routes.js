const express = require("express");

const router = express.Router();

const {
    askProjectQuestion
} = require("../controllers/chat.controller");

const {
    authenticateToken
} = require("../middleware/auth.middleware");


// Ask a question about a project
router.post(
    "/:id/chat",
    authenticateToken,
    askProjectQuestion
);


module.exports = router;