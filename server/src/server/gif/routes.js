const express = require("express");
const router = express.Router();
const Controller = require("./controller");
const Common = require("../utils/common")


router.post("/all", Common.query);
router.post("/search", Common.search)

module.exports = router;