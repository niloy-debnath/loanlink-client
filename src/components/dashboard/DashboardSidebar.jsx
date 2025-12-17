import { NavLink } from "react-router";
import useRole from "../../hooks/useRole";

const DashboardSidebar = () => {
  const { role } = useRole();

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg font-medium transition
     ${
       isActive
         ? "bg-[#D0E6FD] text-[#162660]"
         : "text-white hover:bg-[#1f3380]"
     }`;

  return (
    <aside className="w-64 bg-[#162660] text-white p-5 min-h-full">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      <nav className="space-y-2">
        {/* -------- Borrower -------- */}
        {role === "borrower" && (
          <NavLink to="/dashboard/my-loans" className={linkClass}>
            My Loans
          </NavLink>
        )}

        {/* -------- Manager -------- */}
        {role === "manager" && (
          <NavLink to="/dashboard/pending-loans" className={linkClass}>
            Pending Loans
          </NavLink>
        )}

        {/* -------- Admin -------- */}
        {role === "admin" && (
          <>
            <NavLink to="/dashboard/admin" className={linkClass}>
              Admin Home
            </NavLink>

            <NavLink to="/dashboard/admin/applications" className={linkClass}>
              Loan Applications
            </NavLink>

            <NavLink to="/dashboard/admin/manage-users" className={linkClass}>
              Manage Users
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
