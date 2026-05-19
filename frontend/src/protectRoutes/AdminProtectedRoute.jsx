import { Navigate } from "react-router-dom";
import { getAuthToken, getStoredUser } from "../utils/authStorage";

const AdminProtectedRoute = ({ children }) => {
  const token = getAuthToken();
  const user = getStoredUser();

  if (!token || user?.role !== "admin") {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
