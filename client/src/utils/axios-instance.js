import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});
axiosInstance.interceptors.request.use((config) => {
  decodeURI(config.url)
  console.log(config.url);
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }
  return config;
});
export default axiosInstance;
