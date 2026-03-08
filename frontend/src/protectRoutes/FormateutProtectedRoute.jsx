import { Navigate } from "react-router-dom";

const FormateurProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

    if (!token || user?.role !== "formateur") {
        return <Navigate to="/formateur/signup" />;
    }

    return children;
};

export default FormateurProtectedRoute;