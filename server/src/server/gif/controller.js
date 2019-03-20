const Picture = require("./model")
const Exception = require("../utils/exception")
const DateUtils = require("../utils/dateUtils")
const Const = require("../constants/index");

const getAllGifs = async (req, res, next) => {
  try {
    console.log(req.body)
    let {page = 1, limit} = req.body;
    let query = {};

    // get last record, if createdat < 8h ago then select random items based on top views
    let last = await Picture.find().limit(1).sort({"createdAt": -1});
    let hours = DateUtils.compareToCurrentToHours(last[0].createdAt);
    if (hours > Const.HOURS_OUT_DATE) {
      let stories = await Picture.find(query).sort({"views": -1}).limit(limit).skip((page - 1) * limit).lean().exec();
      let count = await Picture.countDocuments().exec();
      return res.json({data: stories, limit, page, count})
    } else {
      let stories = await Picture.find(query).sort({"createdAt": -1}).limit(limit).skip((page - 1) * limit).lean().exec();
      let count = await Picture.countDocuments().exec();
      return res.json({data: stories, limit, page, count})
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(Exception.unknown_error);
  }
}

module.exports = {
  getAllGifs
}