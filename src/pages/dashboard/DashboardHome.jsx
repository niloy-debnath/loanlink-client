import { Navigate } from "react-router";
import useRole from "../../hooks/useRole";
import { TbFidgetSpinner } from "react-icons/tb";

const DashboardHome = () => {
  const { role, roleLoading } = useRole();

  if (roleLoading) {
    return (
      <div className="flex justify-center mt-20">
        <TbFidgetSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  if (role === "manager") {
    return <Navigate to="/dashboard/pending-loans" />;
  }

  if (role === "borrower") {
    return <Navigate to="/dashboard/my-loans" />;
  }

  // fallback (admin / unknown role)
  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
    </div>
  );
};

export default DashboardHome;
