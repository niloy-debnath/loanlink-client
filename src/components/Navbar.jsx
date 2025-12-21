import React, { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { auth } from "../firebase/firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { TbSun, TbMoon } from "react-icons/tb";
import cat from "../assets/cat.png";
import Logo from "../shared/Logo";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  /* ================= AUTH + USER SYNC ================= */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${currentUser.email}`
        );
        const dbUser = await res.json();

        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: dbUser.name || currentUser.displayName,
          photoURL: dbUser.photoURL || null, // ✅ ONLY MongoDB
          role: dbUser.role || null,
        });
      } catch (err) {
        console.error("User sync failed:", err);
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: null,
          role: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setOpenDropdown(false);
  };

  /* ================= THEME ================= */
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const navItemClass = ({ isActive }) =>
    `px-2 py-0.5 rounded-md text-sm font-semibold transition ${
      isActive
        ? "bg-[#162660] text-[#F1E4D1]"
        : "text-[#162660] hover:bg-[#162660] hover:text-[#F1E4D1]"
    }`;

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-[#D0E6FD] text-[#162660]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-5">
          <NavLink to="/" className={navItemClass}>
            Home
          </NavLink>
          <NavLink to="/loans" className={navItemClass}>
            All Loans
          </NavLink>

          {!user && (
            <>
              <NavLink to="/about" className={navItemClass}>
                About
              </NavLink>
              <NavLink to="/contact" className={navItemClass}>
                Contact
              </NavLink>
              <NavLink to="/login" className={navItemClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navItemClass}>
                Register
              </NavLink>
            </>
          )}

          {user && (
            <>
              <NavLink to="/dashboard" className={navItemClass}>
                Dashboard
              </NavLink>

              <li className="relative flex items-center gap-2">
                <button
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="flex items-center gap-1.5 border rounded-full px-1.5 py-0.5 hover:bg-[#162660] hover:text-[#F1E4D1] transition"
                >
                  <img
                    src={user.photoURL || cat}
                    alt="User Avatar"
                    className="w-7 h-7 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = cat;
                    }}
                  />
                  <span className="hidden md:block text-sm font-medium">
                    {user.displayName || "User"}
                  </span>
                </button>

                {/* Role Badge */}
                {user.role && (
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-600 text-white">
                    {user.role.toUpperCase()}
                  </span>
                )}

                {/* Dropdown */}
                {openDropdown && (
                  <ul className="absolute right-0 mt-2 w-40 bg-white text-[#162660] rounded-md shadow-lg border overflow-hidden z-50">
                    <li>
                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 hover:bg-[#D0E6FD]"
                        onClick={() => setOpenDropdown(false)}
                      >
                        Profile
                      </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-[#D0E6FD]"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </>
          )}

          {/* Theme */}
          <li>
            <button
              onClick={toggleTheme}
              className="px-2 py-1 rounded-md hover:bg-gray-300 transition"
            >
              {theme === "light" ? <TbMoon /> : <TbSun />}
            </button>
          </li>
        </ul>

        {/* Mobile Toggle */}
        <button
          className="md:hidden px-2 py-1 border rounded"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <ul className="md:hidden bg-[#D0E6FD] text-[#162660] flex flex-col gap-2 px-6 pb-4">
          <NavLink to="/" className={navItemClass}>
            Home
          </NavLink>
          <NavLink to="dashboard" className={navItemClass}>
            Dashboard
          </NavLink>
          <NavLink to="/loans" className={navItemClass}>
            All Loans
          </NavLink>
          <NavLink to="/contact" className={navItemClass}>
            Contact
          </NavLink>
          <NavLink to="/about" className={navItemClass}>
            About
          </NavLink>

          {!user ? (
            <>
              <NavLink to="/login" className={navItemClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navItemClass}>
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/profile" className={navItemClass}>
                Profile
              </NavLink>
              <button onClick={handleLogout} className={navItemClass}>
                Logout
              </button>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default Navbar;
