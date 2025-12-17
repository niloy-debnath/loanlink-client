import React from "react";
import logo from "../assets/loan-link-logo - Copy.png";
import { Link } from "react-router";

const Logo = () => {
  return (
    <div className=" ">
      <Link className="flex items-center" to="/">
        <img className=" h-24" src={logo} alt="" />
        <h1 className="-ms-5 text-3xl font-bold ">LoanLink</h1>
      </Link>
    </div>
  );
};

export default Logo;
