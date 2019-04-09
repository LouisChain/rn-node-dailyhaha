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

const query = (page = 1, table = "picture", limit = defaultPagination,) => {
  return instance.post("/" + table + "/all", {
    page,
    limit
  });
};

const search = (page = 1, table = "picture", caption = null, tags = null, limit = defaultPagination * 3) => {
  return instance.post("/" + table + "/search", {
    page,
    limit,
    caption,
    tags
  })
}


export {fbLogin, query, search};
