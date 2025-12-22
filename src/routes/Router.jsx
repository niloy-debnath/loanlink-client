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
import PendingLoans from "../pages/dashboard/manager/PendingLoans";
import ProtectedRoute from "../components/ProtectedRoute";
import ApplyLoan from "../pages/applyLoan/ApplyLoan";
import ManagerRoute from "../components/ManagerRoute";
import BorrowerRoute from "../components/BorrowerRoute";
import AdminApplications from "../pages/dashboard/admin/AdminApplications";
import AdminManageUsers from "../pages/dashboard/admin/AdminManageUsers";
import AdminRoute from "../components/AdminRoute";
import About from "../pages/About";
import Contact from "../pages/Contact";
import AdminAllLoans from "../pages/dashboard/admin/AdminAllLoans";
import AddLoanManager from "../pages/dashboard/manager/AddLoanManager";
import ManageLoans from "../pages/dashboard/manager/ManageLoans";
import ApprovedApplicationsManager from "../pages/dashboard/manager/ApprovedApplicationsManager";
import MyProfileManager from "../pages/dashboard/manager/MyProfileManager";
import MyProfile from "../pages/MyProfile";
import NotFound from "../pages/404/NotFound";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/loans", element: <AllLoansPage /> },
      { path: "/about", element: <About /> },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <MyProfile></MyProfile>
          </ProtectedRoute>
        ),
      },
      { path: "/contact", element: <Contact /> },
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
            <ApplyLoan />
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    path: "/login",
    element: <AuthLayout />,
    children: [{ path: "/login", element: <Login /> }],
  },

  {
    path: "/register",
    element: <AuthLayout />,
    children: [{ path: "/register", element: <Regiter /> }],
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
        index: true,
        element: <DashboardHome />,
      },

      // -------- ADMIN --------
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
        path: "admin/all-loans",
        element: (
          <AdminRoute>
            <AdminAllLoans />
          </AdminRoute>
        ),
      },

      // -------- BORROWER --------
      {
        path: "my-loans",
        element: (
          <BorrowerRoute>
            <MyLoans />
          </BorrowerRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <BorrowerRoute>
            <MyProfile></MyProfile>
          </BorrowerRoute>
        ),
      },

      // -------- MANAGER --------
      {
        path: "pending-loans",
        element: (
          <ManagerRoute>
            <PendingLoans />
          </ManagerRoute>
        ),
      },
      {
        path: "add-loan",
        element: (
          <ManagerRoute>
            <AddLoanManager></AddLoanManager>
          </ManagerRoute>
        ),
      },
      {
        path: "manage-loans",
        element: (
          <ManagerRoute>
            <ManageLoans></ManageLoans>
          </ManagerRoute>
        ),
      },
      {
        path: "approved-loans",
        element: (
          <ManagerRoute>
            <ApprovedApplicationsManager></ApprovedApplicationsManager>
          </ManagerRoute>
        ),
      },
      {
        path: "manager-profile",
        element: (
          <ManagerRoute>
            <MyProfileManager></MyProfileManager>
          </ManagerRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default Router;
