import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import SignUp from "./pages/loginPage/SignUp";
import FormatterSignUp from "./pages/loginPage/FormatterSignUp";
import ForgotPassword from "./pages/loginPage/ForgotPassword";
import OTPVerification from "./pages/loginPage/OTPVerification";
import SetPassword from "./pages/loginPage/SetPassword";
import WelcomeBack from "./pages/loginPage/WelcomeBack";
import ApprenantDashboard from "./pages/ApprenantPage/ApprenantDashboard";

function App(){
  return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/formateur/signup" element={<FormatterSignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/welcome-back" element={<WelcomeBack />} />
          <Route path="/apprenant/dashboard" element={<ApprenantDashboard />} />
        </Routes>
      </div>
  );
}

export default App;
