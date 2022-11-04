import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UpdatePassword from "../../components/UpdatePassword/UpdatePassword";
import Layout from "../../components/Layout/Layout";
import AppContext from "../../context/AppContext";
import http from "../../utils/axios-instance";
import styles from "./Home.module.css";
import Button from "../../components/Form/FormComponents/Button/Button";
import Select from "../../components/Form/FormComponents/Select/Select";
import Input from "../../components/Form/FormComponents/Input/Input";
import { useForm } from "react-hook-form";

function Home() {
	const [updatePassword, setUpdatePassword] = useState(false);
	const { register, handleSubmit } = useForm();
	const ctx = useContext(AppContext);
	const { user } = useContext(AppContext);
	const navigate = useNavigate();

	const updateSelfPassword = () => {
		setUpdatePassword(!updatePassword);
	};

	return (
		<Layout pageName={"Bosh Sahifa"}>
			<div>
				<p
					onClick={updateSelfPassword}
					style={{
						cursor: "pointer",
					}}
				>
					{!updatePassword ? "UpdatePassword" : "Paroldan chiqish"}
				</p>
				{updatePassword && <UpdatePassword id={user.id} />}
			</div>
		</Layout>
	);
}

export default Home;
