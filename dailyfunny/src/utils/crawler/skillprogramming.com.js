import * as Base from "./base";

const BASE_URL = "https://skillprogramming.com/";

const parseHomePage = async () => {
  let path = "";
  let imageUrl = "";
  try {
    let html = await Base.retrieveHtml(BASE_URL);
    let key = `class="post format-standard"`;
    let sub = html.substring(html.indexOf(key));

    // path
    let _path = sub.substring(sub.indexOf(`<a href="`));
    path = _path.substring(9, _path.indexOf(`">`));

    // url
    let sub2 = sub.substring(sub.indexOf(`<img src="`) + 10);
    imageUrl = sub2.substring(0, sub2.indexOf(`"`));
  } catch (error) {
    console.log(error);
  }
  return {path: path, url: BASE_URL + removeFirstSlash(imageUrl)};
};

const parseNextPage1 = async path => {
  let nextPath = "";
  let imageUrl = ""
  path = removeFirstSlash(path);
  if (path.indexOf("recent/") !== 0) {
    path = "recent/" + path
  }
  try {
    let html = await Base.retrieveHtml(BASE_URL + path); // remove first "/"
    let start = `aria-label="Previous"`;
    let end = `aria-label="Next"`;
    let sub = html.substring(html.indexOf(start), html.indexOf(end));

    // path
    let _path = sub.substring(sub.indexOf(`<a href="`));
    nextPath = _path.substring(9, _path.length - 2);

    // url
    let image = html.substring(html.indexOf(`class="post-img"`));
    image = image.substring(image.indexOf(`<img src="`) + 10);
    imageUrl = image.substring(0, image.indexOf(`"`));
  } catch (error) {
    console.log(error);
  }
  return {path: nextPath, url: BASE_URL + removeFirstSlash(imageUrl)};
};

const removeFirstSlash = path => {
  if (path.indexOf("/") === 0) {
    return path.substring(1);
  } else {
    return path;
  }
};

export {parseHomePage, parseNextPage1};
