import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { useContext, useEffect } from "react";
import UserContext from "./context/UserContext";

function App() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const ctx = useContext(UserContext);
  const { isAuth } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    ctx.setUser({
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
      </Routes>
    </>
  );
}

export default App;
