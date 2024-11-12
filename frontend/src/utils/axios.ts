import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://157.245.212.110:8000/",
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

axiosClient.defaults.xsrfCookieName = "csrftoken";
axiosClient.defaults.xsrfHeaderName = "X-CSRFToken";

axiosClient.interceptors.response.use(
  function (response: any) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error.response.data);
  }
);

export { axiosClient };