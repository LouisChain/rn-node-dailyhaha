const Crawler = require('crawler');
const mongoose = require('mongoose')
const axios = require("axios");
const cheerio = require("cheerio");
const Game = require("../server/game/model")

const crawler = new Crawler({
  rateLimit: 1000
})

const tags = [
  "puzzle",
  "racing",
  "sports",
  "strategy",
  "zombie",
  "defense",
  "shooting",
  "war",
  "arcade",
  "http://www.dailyhaha.com/soundboards/page_{{i}}.htm",
];
let currentIndex = 0;
const prefix = "http://dailyhaha.com";
const baseTagUrl = "http://www.dailyhaha.com/games/{{tag}}";

const getExists = (url) => {
  return new Promise((resolve, reject) => {
    Game.findOne({url: url})
      .then(item => {
        resolve(item);
      })
      .catch(err => reject(err + ""))
  });
}

const crawlPage = (url) => {
  return new Promise((resolve, reject) => {
    crawler.queue({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
      uri: url,
      callback: async function (err, res, done) {
        let hasItem = false;
        if (err) {
          console.log(err)
          reject(err + "");
        } else {
          console.log(`Response >>> ${url}`);

          // retrieve contents
          let $ = res.$;
          let container = $(".content.container").find(".grid");
          if (container && container.length > 0) {
            container = $(container).find("a");
            let count = await processArrayPicture($, container);
            if (count >= container.length) {
              // hasItem = true;
            } else {
              // hasItem = false;
            }
          } else {
            hasItem = false;
          }
        }
        resolve(hasItem);
        done();
      }
    })
  })
}

const processArrayPicture = async ($, array) => {
  let count = 0;
  for (let i = 0; i < array.length; i++) {
    let image = $(array[i]).find("img");
    let views = $(array[i]).find(".views");
    let viewCount = parseInt(views.text());
    let detailPage = getHref($(array[i]).attr("href"));
    let success = await processItemPicture($, detailPage, image, viewCount)
    if (success) count++;
  }
  return count
}

const processItemPicture = async ($, detailPage, image, viewCount) => {
  let success = false;
  let processedPicture = processPicture($, image);
  let exits = await getExists(processedPicture.url);
  if (!exits) {
    let info = {
      page: detailPage,
      url: processedPicture.url,
      caption: processedPicture.caption,
      views: viewCount,
    };
    let game = {
      _id: new mongoose.Types.ObjectId(),
      url: info.url,
      caption: info.caption,
      views: info.views,
      tags: [tags[currentIndex]]
    };
    await new Game(game).save();
    console.log("Inserted >>> " + info.url)
    await crawlDetail(game, info.page);
    success = true;// in case item was not in the db but crawl false, so counter will be broken
  } else {
    console.log("Skip >>> " + processedPicture.url)
    success = false;
  }
  return success;
}

const processPicture = ($, image) => {
  let src = $(image).attr('src');
  let caption = $(image).attr('alt');
  return {url: prefix + src, caption};
}

const getHref = (href) => {
  if (href.indexOf("http") === 0) {
    return href;
  } else {
    return prefix + href;
  }
}

const crawlDetail = async (game, page) => {
  let hasItem = false;
  try {
    console.log("Detail >>> " + page);
    let reponse = await axios.get(page);
    let $ = cheerio.load(reponse.data);
    let gameUrl = page.replace(".htm", ".swf");
    let tags = $(".media-info").find(".dfn").find(".category").find("a");
    hasItem = true;
    let tagsArr = [];
    if (tags && tags.length > 0) {
      for (let i = 0; i < tags.length; i++) {
        tagsArr.push($(tags[i]).text());
      }
    }

    await Game.updateOne(game, {$set: {tags: tagsArr, gameUrl}})
    console.log("Updated >>> " + gameUrl);
  } catch (e) {
    console.error("Error >>> " + page);
  }

  Promise.resolve(hasItem);
}

exports.execute = async () => {
  let n = tags.length;
  for (let i = 0; i < n; i++) {
    currentIndex = i;
    let result = false;
    if (tags[i].indexOf("http") !== 0) {
      let url = baseTagUrl.replace("{{tag}}", tags[i]);
      result = await crawlPage(url);
      console.log(i + " page(s) crawled");
    } else {
      let page = 1;
      while (true) {
        let url = tags[i].replace("{{i}}", page);
        result = await crawlPage(url);
        console.log(i + " page(s) crawled");

        page++;
      }
    }
    if (!result) {
      break;
    }
  }
}

