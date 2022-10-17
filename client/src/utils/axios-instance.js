import axios from "axios";
const token = localStorage.getItem("token");

export default axios.create({
  baseURL: "http://192.168.60.112/api/v1/",
  headers: {
    authorization: `Bearer ${token}`,
  },
});
