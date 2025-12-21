import { Outlet } from "react-router";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { HiMenu } from "react-icons/hi";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      <div className="flex flex-1 pt-14">
        {/* Overlay (Mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed md:static z-50 md:z-auto
            top-14 left-0 h-[calc(100vh-56px)]
            w-64 bg-[#162660]
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          <DashboardSidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-4 sm:p-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden mb-4 flex items-center gap-2 bg-white px-4 py-2 rounded shadow"
          >
            <HiMenu size={22} />
            Menu
          </button>

          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
