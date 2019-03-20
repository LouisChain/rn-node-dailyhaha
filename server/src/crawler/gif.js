const Crawler = require('crawler');
const cheerio = require("cheerio");
const axios = require("axios");
const mongoose = require('mongoose')
const Gif = require("../server/gif/model")

const crawler = new Crawler({
  rateLimit: 1000
});

const prefix = "http://dailyhaha.com";
const baseGifUrl = "http://www.dailyhaha.com/gifs/page_{{i}}.htm";

const getExists = (url) => {
  return new Promise((resolve, reject) => {
    Gif.findOne({url: url})
      .then(item => {
        resolve(item);
      })
      .catch(err => reject(err + ""))
  });
}

const crawlPage2 = async (url) => {
  let response = await axios.get(url);
  let $ = cheerio.load(response.data);
  let hasItem = false;

  // retrieve contents
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

  Promise.resolve(hasItem);
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
    // let success = await processItemPicture($, detailPage, image, viewCount)
    let success = await processItemPicture2($, detailPage, image, viewCount)
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
  if (!exits) {
    let info = {
      page: detailPage,
      url: processedPicture.url,
      caption: processedPicture.caption,
      views: viewCount,
    };
    let gif = {
      _id: new mongoose.Types.ObjectId(),
      url: info.url,
      caption: info.caption,
      views: info.views,
    };
    await new Gif(gif).save();
    console.log("Inserted >>> " + info.url)
    success = true;// in case item was not in the db but crawl false, so counter will be broken
  } else {
    console.log("Skip >>> " + processedPicture.url)
    success = false;
  }
  return success;
}

const processItemPicture2 = async ($, detailPage, image, viewCount) => {
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
    let gif = {
      _id: new mongoose.Types.ObjectId(),
      url: info.url,
      caption: info.caption,
      views: info.views,
    };
    success = await crawlDetail(gif);
  } else {
    console.log("Skip >>> " + processedPicture.url)
    success = false;
  }
  return success;
}

const crawlDetail = async (info) => {
  let page = info.url.substring(0, info.url.lastIndexOf(".")) + ".htm";
  let hasItem = false;
  try {
    let response = await axios.get(page);
    let $ = cheerio.load(response.data);
    let gifUrl = $(".gif-view").find("video").find("source").attr("src");
    let tagContainer = $(".media-info").find(".dfn").find(".category").find("a");
    if (gifUrl) {
      hasItem = true;
      gifUrl = prefix + gifUrl;
      let tags = [];
      if (tagContainer && tagContainer.length > 0) {
        for (let i = 0; i < tagContainer.length; i++) {
          tags.push($(tagContainer[i]).text());
        }
      }
      info.tags = tags;

      await new Gif(info).save();
      console.log("Inserted >>> " + info.url);
    }
  } catch (e) {
    console.error("Error >>> " + info.url);
  }

  return Promise.resolve(hasItem);
}

// const crawlDetailPage = (info) => {
//   return new Promise((resolve, reject) => {
//     new Crawler({
//       // rateLimit: 1000,
//     }).queue({
//       userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
//       uri: info.page,
//       callback: async function (err, res, done) {
//         let hasItem = false;
//         if (err) {
//           console.log(err)
//           reject(err + "");
//         } else {
//           console.log(`detail >>> ${info.page}`);
//
//           // retrieve contents
//           let $ = res.$;
//           let gifUrl = $(".gif-view").find("video").find("source").attr("src");
//           let tags = $(".media-info").find(".dfn").find(".category").find("a");
//
//           if (gifUrl) {
//             hasItem = true;
//             gifUrl = prefix + gifUrl;
//             let tagsArr = [];
//             if (tags && tags.length > 0) {
//               for (let i = 0; i < tags.length; i++) {
//                 tagsArr.push($(tags[i]).text());
//               }
//             }
//
//             let gif = {
//               _id: new mongoose.Types.ObjectId(),
//               url: info.url,
//               caption: info.caption,
//               views: info.views,
//               tags,
//               gifUrl
//             };
//             await new Gif(gif).save();
//           }
//         }
//         resolve(hasItem);
//         done();
//       }
//     })
//   })
// }

const updateTags = async () => {
  let gifs = await Gif.find({tags: {$eq: []}});
  if (gifs.length > 0) {
    let n = gifs.length;
    for (let i = 0; i < n; i++) {
      await crawlDetail(gifs[i]);
    }
  }
}

exports.execute = async () => {
  for (let i = 1; i < Infinity; i++) {
    let url = baseGifUrl.replace("{{i}}", i);
    let result = await crawlPage(url);
    console.log(i + " page(s) crawled");
    if (!result) {
      console.log("Stopped crawling because of detected duplication")
      break;
    }
  }

  await updateTags();
}

exports.latest = async () => {
  for (let i = 1; i < Infinity; i++) {
    let url = baseGifUrl.replace("{{i}}", i);
    let result = await crawlPage(url);
    console.log(i + " page(s) crawled");
    if (!result) {
      console.log("Stopped crawling because of detected duplication")
      break;
    }
  }
}
