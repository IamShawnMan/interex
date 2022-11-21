import React, { useContext, useState } from "react";
import UpdatePassword from "../../components/UpdatePassword/UpdatePassword";
import Layout from "../../components/Layout/Layout";
import AppContext from "../../context/AppContext";

function Home() {
	const [updatePassword, setUpdatePassword] = useState(false);
	const { user } = useContext(AppContext);

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
					{!updatePassword ? "Parolni o'zgartirish" : "Paroldan chiqish"}
				</p>
				{updatePassword && <UpdatePassword id={user.id} />}
			</div>
		</Layout>
	);
}

export default Home;
