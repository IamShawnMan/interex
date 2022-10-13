import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import http from "../../utils/axios-instance";
import UserContext from "../../context/AppContext";

const schema = yup.object().shape({
	username: yup
		.string()
		.trim()
		.required("Username bo'sh bo'lishi mumkin emas")
		.min(5, "Username xato kiritildi")
		.max(20, "Username xato kiritildi"),
	password: yup
		.string()
		.trim()
		.required("Parol bo'sh bo'lishi mumkin emas")
		.min(6, "Parol  xato kiritildi")
		.max(20, "Parol xato kiritildi"),
});

function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});
	const ctx = useContext(UserContext);
	const navigate = useNavigate();

	const login = async (data) => {
		try {
			const res = await http({
				url: "/auth/login",
				method: "POST",
				data,
			});
			console.log(res);
			localStorage.setItem("token", res.data.data.jwt);
			localStorage.setItem("user", JSON.stringify(res.data.data.user));
			ctx.setAppData({
				user: JSON.parse(localStorage.getItem("user")),
				token: localStorage.getItem("token"),
				isAuth: true,
			});
			toast.success(res.data.message);
			navigate("/home");
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit(login)}>
				<div>
					<label htmlFor="username">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						{...register("username")}
					/>
					{errors.username && <p>{errors.username.message}</p>}
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						id="password"
						{...register("password")}
					/>
					{errors.password && <p>{errors.password.message}</p>}
				</div>
				<div>
					<button>Sign In</button>
				</div>
			</form>
		</div>
	);
}

export default Login;
