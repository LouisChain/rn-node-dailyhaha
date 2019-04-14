const mongoose = require('mongoose')
const Picture = require("./picture")
const Gif = require("./gif");
const Game = require("./game");
const Video = require("./video");
const schedule = require('node-schedule');

mongoose.connect('mongodb://localhost/funny_db', {useNewUrlParser: true})
mongoose.set('useCreateIndex', true)

const dailyHaha = async () => {
  // await Picture.execute();
  // await Video.execute();
  // await Gif.execute();
  // await Game.execute();

  process.exit()
}

exports.latest = async () => {
  console.log("Updating Pictures");
  await Picture.latest();
  console.log("Updating Gifs");
  await Gif.latest();
  console.log("Updating Videos");
  await Video.latest();

  // process.exit()
}


// const job = schedule.scheduleJob('* */4 * * *', function(){// Every 4 hour when minute = 0;
//   latest();
// });

// latest();

console.log("Updating Pictures");
 Picture.latest();
console.log("Updating Gifs");
 Gif.latest();
console.log("Updating Videos");
 Video.latest();