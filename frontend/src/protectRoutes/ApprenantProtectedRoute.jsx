import { Navigate } from "react-router-dom";
import { getStoredUser } from "../utils/authStorage";

const ApprenantProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken") || localStorage.getItem("apprenentToken");
  const user = getStoredUser();

  if (!token || user?.role !== "visiteur") {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ApprenantProtectedRoute;
