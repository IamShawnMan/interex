import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { useSelector } from "react-redux";

function App() {
  const { isAuth } = useSelector((st) => st.app);
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        {isAuth && <Route path="/home" element={<Home />} />}
      </Routes>
    </>
  );
}

export default App;
