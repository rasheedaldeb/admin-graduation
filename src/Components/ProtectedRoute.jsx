import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("admintoken");
  return token ? <Outlet /> : <Navigate to="/admin-signin" />;
};

export default ProtectedRoute;
