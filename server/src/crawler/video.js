const Crawler = require('crawler');
const mongoose = require('mongoose')
const Video = require("../server/video/model")

const crawler = new Crawler({
  rateLimit: 1000
})

const prefix = "http://dailyhaha.com";
const baseVideoUrl = "http://www.dailyhaha.com/videos/page_{{i}}.htm";

const getExists = (url) => {
  return new Promise((resolve, reject) => {
    Video.findOne({url: url})
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
          console.log(`response >>> ${url}`);

          // retrieve contents
          let $ = res.$;
          let container = $(".content.container").find(".grid");
          if (container && container.length > 0) {
            container = $(container).find("a");

            let count = await processArrayPicture($, container);
            if (count === container.length - 1) {
              hasItem = true;
            } else {
              hasItem = false;
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
    let detailPage = prefix + $(array[i]).attr("href");
    let success = await processItemPicture($, detailPage, image, viewCount)
    if (success) count++;
  }
  return count;
}

const processPicture = ($, image) => {
  let src = $(image).attr('src');
  let caption = $(image).attr('alt');
  return {url: prefix + src, caption};
}

const processItemPicture = async ($, detailPage, image, viewCount) => {
  let success = false;
  let processedPicture = processPicture($, image);
  let exits = await getExists(processedPicture.url);
  if (!exits || exits.length === 0) {
    let info = {
      page: detailPage,
      url: processedPicture.url,
      caption: processedPicture.caption,
      views: viewCount,
    }
    let detailCrawler = new Crawler({
      rateLimit: 1000
    })
    await crawlDetailPage(info, detailCrawler)
    success = true;// in case item was not in the db but crawl false, so counter will be broken
  } else {
    console.log("Skip >>> " + info.url)
    success = false;
  }
  return success;
}

const crawlDetailPage = (info, detailCrawler) => {
  return new Promise((resolve, reject) => {
    detailCrawler.queue({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
      uri: info.page,
      callback: async function (err, res, done) {
        let hasItem = false;
        if (err) {
          console.log(err)
          reject(err + "");
        } else {
          console.log(`detail >>> ${info.url}`);

          // retrieve contents
          let $ = res.$;
          console.log($("body").contents())
          let container = $("#my-video_Youtube_api");
          let video = container.getElementsByTagName("video");
          if (video && video.length > 0) {
            console.log("video found")
            hasItem = true;
            let src = video[0].src;
            // get tags
            let tagsContainer = $(".media-info").find(".category").find("a");
            let tags = [];
            if (tagsContainer && tagsContainer.length > 0) {
              for (let i = 0; i < tagsContainer.length; i++) {
                tags.push($(tagsContainer[i]).text());
              }
            }
            // save to db
            let videoObject = new Video({
              _id: new mongoose.Types.ObjectId(),
              url: info.url,
              caption: info.caption,
              blobUrl: src,
              views: info.views,
              tags: tags
            });
            await videoObject.save();
            console.log("inserted => " + src)
          }
        }
        resolve(hasItem);
        done();
      }
    })
  })
}

exports.execute = async () => {
  for (let i = 1; i < Infinity; i++) {
    let url = baseVideoUrl.replace("{{i}}", i);
    let result = await crawlPage(url);
    console.log("Crawl page: " + url);
    if (!result) {
      break;
    }
  }
}

