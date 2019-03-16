const Crawler = require('crawler');
const mongoose = require('mongoose')
const Picture = require("../server/picture/model")

const crawler = new Crawler({
  rateLimit: 1000
})

const tags = [
  "animals",
  "fail",
  "weird",
  "celebrity",
  "cool",
  "gross",
  "cartoons",
  "signs",
  "costumes",
  "illusions",
  "cant_park_there"
];
let currentIndex = 0;
const prefix = "http://dailyhaha.com";
const baseTagUrl = "http://www.dailyhaha.com/pictures/{{tag}}/page_{{i}}.htm";

const getExists = (url) => {
  return new Promise((resolve, reject) => {
    Picture.findOne({url: url})
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
            hasItem = true;
            let count = await processArrayPicture($, container);
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
    let success = await processItemPicture($, image, viewCount)
    if (success) count++;
  }
  return count;
}

const processPicture = ($, image) => {
  let src = $(image).attr('src');
  let caption = $(image).attr('alt');
  return {url: prefix + src, caption};
}

const processItemPicture = async ($, image, viewCount) => {
  let success = false;
  let processedPicture = processPicture($, image);

  // check if exits, add more tag by this tag then update
  let exists = await getExists(processedPicture.url);
  if (exists) {
    let oldTags = exists.tags;
    let newTags = oldTags.length > 0 ? oldTags.push(tags[currentIndex]) : [tags[currentIndex]]
    await Picture.updateOne(exists, {$set: {tags: newTags}});
    console.log("Updated >>> " + processedPicture.url)
  } else {
    // if not just save it.
    let picture = new Picture({
      _id: new mongoose.Types.ObjectId(),
      url: processedPicture.url,
      caption: processedPicture.caption,
      views: viewCount,
      tags: [tags[currentIndex]]
    });
    await picture.save();
    console.log("Inserted >>> " + processedPicture.url)
    success = true;
  }

  return success;
}

exports.execute = async () => {
  let n = tags.length;
  for (let i = 0; i < n; i++) {
    currentIndex = i;
    let page = 1;
    while (true) {
      let url = baseTagUrl.replace("{{tag}}", tags[i]);
      url = url.replace("{{i}}", page);
      let result = await crawlPage(url);
      console.log(page + " set of page crawled");
      if (!result) {
        break;
      }
      page++;
    }
  }
}

