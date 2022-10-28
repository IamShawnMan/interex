import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://192.168.60.112:8080/api/v1",
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }
  return config;
});
export default axiosInstance;
