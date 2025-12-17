import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Logo from "../shared/Logo";
import { NavLink, Link } from "react-router";
import { auth } from "../firebase/firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FcRight } from "react-icons/fc";
import cat from "../assets/cat.png";

const Navbar = () => {
  // const [isScrolled, setIsScrolled] = useState(false);
  // const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  // Detect scroll
  // useEffect(() => {
  //   const handleScroll = () => setIsScrolled(window.scrollY > 20);
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setOpenDropdown(false);
    setUser(null);
  };

  // theme toggle
  // const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div className="relative w-full">
      {/* NAVBAR */}
      <div
        className={`fixed bg-[#D0E6FD] shadow-lg text-[#162660]
           top-0 left-0 w-full z-50 transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto px-10 flex justify-between items-center h-20">
          {/* Logo */}
          <Logo />

          {/* LINKS */}
          <ul className="flex gap-8 text-lg font-semibold items-center">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `transition px-2 py-1 rounded-md ${
                    isActive
                      ? "bg-[#162660] text-[#F1E4D1]"
                      : "text-[#162660] hover:text-[#F1E4D1]"
                  }`
                }
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/loans"
                className={({ isActive }) =>
                  `transition px-2 py-1 rounded-md ${
                    isActive
                      ? "bg-[#162660] text-[#F1E4D1]"
                      : "text-[#162660] hover:text-[#F1E4D1]"
                  }`
                }
              >
                All Loans
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `transition px-2 py-1 rounded-md ${
                    isActive
                      ? "bg-[#162660] text-[#F1E4D1]"
                      : "text-[#162660] hover:text-[#F1E4D1]"
                  }`
                }
              >
                Dashboard
              </NavLink>
            </li>

            {!user && (
              <>
                <NavLink to="/about">
                  <li className="hover:text-[#F1E4D1] transition">About</li>
                </NavLink>
                <NavLink to="/contact">
                  <li className="hover:text-[#F1E4D1] transition">Contact</li>
                </NavLink>

                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `transition px-2 py-1 rounded-md ${
                        isActive
                          ? "bg-[#162660] text-[#F1E4D1]"
                          : "text-[#162660] hover:bg-[#162660] hover:text-[#F1E4D1]"
                      }`
                    }
                  >
                    Login
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `transition px-2 py-1 rounded-md ${
                        isActive
                          ? "bg-[#162660] text-[#F1E4D1]"
                          : "text-[#162660] hover:bg-[#162660] hover:text-[#F1E4D1]"
                      }`
                    }
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}

            {user && (
              <li className="relative">
                <button
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="flex items-center gap-2 rounded-full border border-gray-300 p-1 hover:bg-[#162660] hover:text-[#F1E4D1] transition"
                >
                  {/* <img
                    src={user?.photoURL ? user.photoURL : cat}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  /> */}
                  <img
                    src={user?.photoURL || cat}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = cat;
                    }}
                  />

                  <span className="hidden md:block">
                    {user.displayName || "User"}
                  </span>
                </button>

                {/* Dropdown */}
                {openDropdown && (
                  <ul className="absolute right-0 mt-2 w-40 bg-white text-[#162660] rounded-md shadow-lg border border-gray-200 overflow-hidden z-50">
                    <li>
                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 hover:bg-[#D0E6FD] transition"
                        onClick={() => setOpenDropdown(false)}
                      >
                        Profile
                      </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-[#D0E6FD] transition"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="h-16 md:h-20" />
    </div>
  );
};

export default Navbar;
