import React from "react";
import Sidebar from "../UI/Sidebar/Sidebar";
import Navbar from "../UI/Navbar/Navbar";

function Layout(props) {
  return (
    <div>
      <Navbar />
      <Sidebar />
      {props.children}
    </div>
  );
}

export default Layout;
