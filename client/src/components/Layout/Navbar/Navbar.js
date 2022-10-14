import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      Navbar
      <Link to={"/home"}> Home Page</Link>
    </div>
  );
}

export default Navbar;
