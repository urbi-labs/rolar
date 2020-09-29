import axios from "axios";

import { baseURL, tokenKey } from "../config.json";

const { NODE_ENV, PUBLIC_URL } = process.env;

axios.defaults.baseURL =
  NODE_ENV === "production" ? baseURL : "http://localhost:3000";

if (PUBLIC_URL) axios.defaults.baseURL = PUBLIC_URL;

console.log("baseURL", axios.defaults.baseURL);

axios.defaults.headers.common["Cache-Control"] = "no-cache";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log("httpService unexpected -> ", error);
    return Promise.reject(error);
  }
  console.log("httpService ->", error.response);
  return Promise.reject(error);
});

function setJwt(jwt) {
  if (jwt) axios.defaults.headers.common[tokenKey] = jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};
