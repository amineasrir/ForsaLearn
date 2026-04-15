import { Navigate } from "react-router-dom";
import { AUTH_KEYS } from "../utils/authStorage";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem(AUTH_KEYS.adminToken);
  const rawUser = localStorage.getItem(AUTH_KEYS.adminUser);
  const user = rawUser ? JSON.parse(rawUser) : null;

  if (!token || user?.role !== "admin") {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default AdminProtectedRoute;
