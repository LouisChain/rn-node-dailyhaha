const mongoose = require('mongoose')
const Picture = require("./picture")
const Gif = require("./gif");
const Game = require("./game");

mongoose.connect('mongodb://localhost/funny_db', {useNewUrlParser: true})
mongoose.set('useCreateIndex', true)

const dailyHaha = async () => {
  await Picture.execute();
  // await Video.execute();
  // await Gif.execute();
  // await Game.execute();

  process.exit()
}

dailyHaha()