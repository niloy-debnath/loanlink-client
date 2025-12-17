// AuthLayout.jsx
import React from "react";
import NavbarSimple from "../components/NavbarSimple";
import Footer from "../components/Footer";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <NavbarSimple></NavbarSimple>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
