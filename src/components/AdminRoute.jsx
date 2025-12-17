import useRole from "../hooks/useRole";
import { Navigate } from "react-router";
import { TbFidgetSpinner } from "react-icons/tb";

const AdminRoute = ({ children }) => {
  const { role, roleLoading } = useRole();

  if (roleLoading) {
    return <TbFidgetSpinner className="animate-spin text-4xl mx-auto mt-20" />;
  }

  return role === "admin" ? children : <Navigate to="/" />;
};

export default AdminRoute;
