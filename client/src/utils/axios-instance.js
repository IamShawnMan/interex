import axios from "axios";
const token = localStorage.getItem("token");

export default axios.create({
<<<<<<< HEAD
	baseURL: "http://localhost:8080/api/v1/",
	headers: {
		authorization: `Bearer ${token}`,
	},
=======
  baseURL: "http://localhost:8080/api/v1/",
  headers: {
    authorization: `Bearer ${token}`,
  },
>>>>>>> f1c9a207a1ca31243b8cafe012f90fe0a529161c
});
