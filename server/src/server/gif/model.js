const mongoose = require("mongoose");
const Collection = require("../constants/collection");

const gifScheme = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  url: {type: String, required: true, index: true},// image preview url, image gif will be replaced to .gif or .mp4
  caption: {type: String, required: false},
  gifUrl: {type: String, required: false},
  tags: {type: Array, required: false},
  user: {type: mongoose.Schema.Types.ObjectId, required: false},//belong to this user
  comment: {type: Array, required: false},// content of comments
  views: {type: Number, required: false},
  likes: {type: Number, required: false},
  haha: {type: Number, required: false},
  loves: {type: Number, required: false},
  surprise: {type: Number, required: false},
  angry: {type: Number, required: false},
  sad: {type: Number, required: false},
  comments: {type: Number, required: false},//Number of comments
  shared: {type: Number, required: false},
  createdAt: {type: Date, default: Date.now()}
})
const gifModel = mongoose.model(Collection.COLLECTION_GIF, gifScheme);

module.exports = gifModel;