import axios from "axios";

const defaultPagination = 50;
const instance = axios.create({
  baseURL: "http://192.168.3.159:3000",
  timeout: 30000
});

const fbLogin = (fbToken, anonymous) => {
  return instance.post("/user/fbLogin/", {
    fbToken,
    anonymous
  });
};

const getPictures = (page = 1, limit = defaultPagination) => {
  return instance.post("/picture/all", {
    page,
    limit
  });
};

const getGifs = (page = 1, limit = defaultPagination) => {
  return instance.post("/gif/all", {
    page,
    limit
  });
};

const getGames = (page = 1, limit = defaultPagination) => {
  return instance.post("/game/all", {
    page,
    limit
  });
};

const getVideos = (page = 1, limit = defaultPagination) => {
  return instance.post("/video/all", {
    page,
    limit
  });
};


export {fbLogin, getPictures, getGifs, getGames, getVideos};
