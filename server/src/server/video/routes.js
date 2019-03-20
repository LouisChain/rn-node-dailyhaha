const express = require("express");
const router = express.Router();
const Controller = require("./controller");


router.post("/all", Controller.getAllVideos);

module.exports = router;