import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { useContext, useEffect } from "react";
import AppContext from "./context/AppContext";
import Users from "./pages/Users/Users";
import UserMutation from "./pages/Users/UserMutation";
import Orders from "./pages/Orders/Orders/Orders";
import OrderMutation from "./pages/Orders/OrderMutation/OrderMutation";
import Packages from "./pages/Packages/Packages";
import Posts from "./pages/Posts/Posts";
import IncomingOrders from "./pages/IncomingOrders/IncomingOrders";
import PostInnerOrders from "./pages/Posts/PostInnerOrders/PostInnerOrders";
import PostMutation from "./pages/Posts/PostMutation";

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

        {isAuth && <Route path="/users" element={<Users />} />}
        {isAuth && <Route path="/users/:id" element={<UserMutation />} />}

        {isAuth && <Route path="/orders" element={<Orders />} />}
        {isAuth && <Route path="/orders/:id" element={<OrderMutation />} />}
        {isAuth && <Route path="/packages" element={<Packages />} />}
        {isAuth && <Route path="/posts" element={<Posts/>} />}
        {isAuth && <Route path="/posts/new" element={<PostMutation/>} />}
        {isAuth && <Route path="/posts/new/:id" element={<PostInnerOrders/>} />}
        {isAuth && <Route path="/packages/:id/orders" element={<IncomingOrders />} />}
        <Route path="*" element={<Navigate to={"/login"} />} />
      </Routes>
    </>
  );
}

export default App;
