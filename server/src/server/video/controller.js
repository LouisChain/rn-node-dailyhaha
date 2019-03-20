const Video = require("./model")
const Exception = require("../utils/exception")

const getAllVideos = async (req, res, next) => {
  try {
    console.log(req.body)
    let {page = 1, limit} = req.body;
    let query = {}
    let stories = await Video.find(query).sort({"createdAt": -1}).limit(limit).skip((page - 1) * limit).lean().exec();
    let count = await Video.countDocuments().exec();
    return res.json({data: stories, limit, page, count})
  } catch (e) {
    console.log(e);
    res.status(500).json(Exception.unknown_error);
  }
}

module.exports = {
  getAllVideos
}