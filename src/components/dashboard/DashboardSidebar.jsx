import { NavLink } from "react-router";
import useRole from "../../hooks/useRole";

const DashboardSidebar = ({ onClose }) => {
  const { role } = useRole();

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg font-medium transition
     ${
       isActive
         ? "bg-[#D0E6FD] text-[#162660]"
         : "text-white hover:bg-[#1f3380]"
     }`;

  return (
    <aside className="w-64 bg-[#162660] text-white p-5 h-full">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      <nav className="space-y-2" onClick={onClose}>
        {/* -------- Borrower -------- */}
        {role === "borrower" && (
          <>
            <NavLink to="/dashboard/my-loans" className={linkClass}>
              My Loans
            </NavLink>
            <NavLink to="/dashboard/profile" className={linkClass}>
              My Profile
            </NavLink>
          </>
        )}

        {/* -------- Manager -------- */}
        {role === "manager" && (
          <>
            <NavLink to="/dashboard/add-loan" className={linkClass}>
              Add Loan
            </NavLink>
            <NavLink to="/dashboard/manage-loans" className={linkClass}>
              Manage Loans
            </NavLink>
            <NavLink to="/dashboard/pending-loans" className={linkClass}>
              Pending Loans
            </NavLink>
            <NavLink to="/dashboard/approved-loans" className={linkClass}>
              Approved Loans
            </NavLink>
            <NavLink to="/dashboard/manager-profile" className={linkClass}>
              My Profile
            </NavLink>
          </>
        )}

        {/* -------- Admin -------- */}
        {role === "admin" && (
          <>
            <NavLink to="/dashboard/admin/all-loans" className={linkClass}>
              All Loans
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
