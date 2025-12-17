import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import Home from "../pages/home/Home";
import Login from "../pages/Login";
import Regiter from "../pages/Register";
import AllLoansPage from "../pages/AllLoans";
import LoanDetailsPage from "../pages/LoanDetailsPage";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";
import MyLoans from "../pages/dashboard/MyLoans";
import PendingLoans from "../pages/dashboard/PendingLoans";
import ProtectedRoute from "../components/ProtectedRoute";
import ApplyLoan from "../pages/applyLoan/ApplyLoan";
import ManagerRoute from "../components/ManagerRoute";
import BorrowerRoute from "../components/BorrowerRoute";
import AdminHome from "../pages/dashboard/admin/AdminHome";
import AdminApplications from "../pages/dashboard/admin/AdminApplications";
import AdminRoute from "../components/AdminRoute";
import AdminManageUsers from "../pages/dashboard/admin/AdminManageUsers";
import About from "../pages/About";
import Contact from "../pages/Contact";

const Router = createBrowserRouter([
  // Pages with MainLayout (carousel)
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/loans",
        element: <AllLoansPage />,
      },
      {
        path: "/about",
        element: <About></About>,
      },
      {
        path: "/contact",
        element: <Contact></Contact>,
      },
      {
        path: "/loans/:loanId",
        element: (
          <ProtectedRoute>
            <LoanDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/apply-loan/:loanId",
        element: (
          <ProtectedRoute>
            <ApplyLoan></ApplyLoan>
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Auth pages with AuthLayout
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/register",
    element: <AuthLayout />,
    children: [
      {
        path: "/register",
        element: <Regiter />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <AdminRoute>
            <AdminHome />
          </AdminRoute>
        ),
      },
      {
        path: "admin/applications",
        element: (
          <AdminRoute>
            <AdminApplications />
          </AdminRoute>
        ),
      },
      {
        path: "admin/manage-users",
        element: (
          <AdminRoute>
            <AdminManageUsers />
          </AdminRoute>
        ),
      },
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "my-loans",
        element: (
          <BorrowerRoute>
            <MyLoans></MyLoans>
          </BorrowerRoute>
        ),
      },
      {
        path: "pending-loans",
        element: (
          <ManagerRoute>
            <PendingLoans></PendingLoans>
          </ManagerRoute>
        ),
      },
    ],
  },
]);

export default Router;
