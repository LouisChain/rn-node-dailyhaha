const Picture = require("./model")
const Exception = require("../utils/exception")

const getAllGifs = async (req, res, next) => {
  try {
    console.log(req.body)
    let {page = 1, limit} = req.body;
    let query = {}
    let stories = await Picture.find(query).sort({"createdAt": -1}).limit(limit).skip((page - 1) * limit).lean().exec();
    let count = await Picture.countDocuments().exec();
    return res.json({data: stories, limit, page, count})
  } catch (e) {
    console.log(e);
    res.status(500).json(Exception.unknown_error);
  }
}

module.exports = {
  getAllGifs
}