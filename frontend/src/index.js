import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppAdmin from "./AppAdmin";
import AppFormateur from "./AppFormateur";
import SignIn from "./pages/loginPage/SignIn";
import ForgotPassword from "./pages/loginPage/ForgotPassword";
import OTPVerification from "./pages/loginPage/OTPVerification";
import SetPassword from "./pages/loginPage/SetPassword";
import WelcomeBack from "./pages/loginPage/WelcomeBack";
import AdminLogin from "./pages/loginPage/AdminLogin";
import AdminProtectedRoute from "./protectRoutes/AdminProtectedRoute";
import FormatterSignUp from "./pages/loginPage/FormatterSignUp";
import FormateurProtectedRoute from "./protectRoutes/FormateutProtectedRoute";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminProtectedRoute >
          <AppAdmin />
        </AdminProtectedRoute>} />
        <Route path="/formateur/signup" element={<FormatterSignUp />} />
        <Route path="/formateur/*" element={<FormateurProtectedRoute ><AppFormateur /> </FormateurProtectedRoute>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/welcome-back" element={<WelcomeBack />} />

      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
