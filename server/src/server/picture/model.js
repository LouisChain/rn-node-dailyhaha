const mongoose = require("mongoose");
const Collection = require("../constants/collection");

const pictureSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  url: {type: String, index: true},
  caption: {type: String, required: false},
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
const pictureModel = mongoose.model(Collection.COLLECTION_PICTURE, pictureSchema);

module.exports = pictureModel;