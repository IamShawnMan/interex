import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";

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
