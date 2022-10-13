import axios from "axios";
const token = localStorage.getItem("token");

export default axios.create({
	baseURL: "/api/v1/",
	headers: {
		authorization: `Bearer ${token}`,
	},
});
