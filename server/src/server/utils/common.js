const Crawler = require("../../crawler");
const Exception = require("../utils/exception");
const DateUtils = require("../utils/dateUtils")
const Const = require("../constants/index");
const Picture = require("../picture/model")
const Gif = require("../gif/model")
const Video = require("../video/model");
const Game = require("../game/model");
const pagination = 50;

const query = async (req, res, next) => {
  try {
    console.log("query", req.body)
    let {page = 1, limit = pagination} = req.body;
    let tableObject = factoryTable(req);
    let query = {};

    // get last record, if createdat < 8h ago then select random items based on top views
    let last = await tableObject.find().limit(1).sort({$natural: -1});
    let hours = DateUtils.compareToCurrentToHours(last[0].createdAt);
    if (hours > Const.HOURS_OUT_DATE) {
      Crawler.latest();
      let stories = await tableObject.find(query).sort({$natural: -1}).limit(limit).skip((page - 1) * limit).lean().exec();
      let count = await tableObject.countDocuments().exec();
      return res.json({data: stories, limit, page, count})
    } else {
      let stories = await tableObject.find(query).sort({$natural: -1}).limit(limit).skip((page - 1) * limit).lean().exec();
      let count = await tableObject.countDocuments().exec();
      return res.json({data: stories, limit, page, count})
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(Exception.unknown_error);
  }
}

const search = async (req, res, next) => {
  try {
    console.log("search", req.body)
    let {page = 1, limit=pagination, caption = null, tags = null} = req.body;
    let tableObject = factoryTable(req)
    let query = {};
    if (caption) {
      query.caption = {$regex: caption, $options: 'si'};
    }
    if (tags && tags.length > 0) {
      let _tags = [];
      for(let i = 0; i < tags.length; i++) {
        _tags.push(new RegExp(tags[i], "i"));
      }
      query.tags = {$in: _tags};
    }
    let stories = await tableObject.find(query).limit(limit).skip((page - 1) * limit).lean().exec();
    return res.json({data: stories, limit, page, count: stories.length})
  } catch (e) {
    res.status(500).json(Exception.unknown_error);
  }
}

const factoryTable = (req) => {
  let table = req.baseUrl.replace("/", "").toLowerCase();
  let tableObject;
  if (table.includes("picture")) {
    tableObject = Picture;
  } else if (table.includes("gif")) {
    tableObject = Gif;
  } else if (table.includes("video")){
    tableObject = Video;
  } else {
    tableObject = Game;
  }
  return tableObject;
}

const log = (req) => {
  console.log("search", req.body)
  console.log("params", req.params)
  console.log("path", req.path)
  console.log("url", req.originalUrl)
}

module.exports = {
  search, query
}