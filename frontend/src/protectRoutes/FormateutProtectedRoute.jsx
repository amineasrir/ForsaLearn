import { Navigate } from "react-router-dom";
import { getStoredUser } from "../utils/authStorage";

const FormateurProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken") || localStorage.getItem("token");
  const user = getStoredUser();

    if (!token || user?.role !== "formateur") {
        return <Navigate to="/signin" />;
    }

    return children;
};

export default FormateurProtectedRoute;
