import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
// import Register from "../pages/Register";
// import Dashboard from "../pages/Dashboard";
// import ApplyLoan from "../pages/ApplyLoan";
// import ProtectedRoute from "../components/ProtectedRoute";
import Regiter from "../pages/Regiter";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Regiter></Regiter>,
      },
      // {
      //   path: "/apply-loan",
      //   element: (
      //     <ProtectedRoute>
      //       <ApplyLoan />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "/dashboard",
      //   element: (
      //     <ProtectedRoute>
      //       <Dashboard />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
]);

export default Router;
