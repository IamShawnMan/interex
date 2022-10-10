import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { useContext, useEffect } from "react";
import AppContext from "./context/AppContext";
import Users from "./pages/Users/users/Users";
import UserAddEdit from "./pages/Users/user-mutation/UserMutation";


function App() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const ctx = useContext(AppContext);
  const { isAuth } = useContext(AppContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    ctx.setAppData({
      user: JSON.parse(user),
      token,
      isAuth: token?.trim().length > 0,
    });
  }, [token]);
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        {isAuth && <Route path="/home" element={<Home />} />}
        {isAuth && <Route path="*" element={<Navigate to={"home"} />} />}
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserAddEdit />} />
        <Route path="*" element={<Navigate to={"/login"} />} />
      </Routes>
    </>
  );
}

export default App;
