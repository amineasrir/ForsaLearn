import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import SignUp from "./pages/loginPage/SignUp";
<<<<<<< HEAD
=======
import FormatterSignUp from "./pages/loginPage/FormatterSignUp";
import ForgotPassword from "./pages/loginPage/ForgotPassword";
import OTPVerification from "./pages/loginPage/OTPVerification";
import SetPassword from "./pages/loginPage/SetPassword";
import WelcomeBack from "./pages/loginPage/WelcomeBack";
import ApprenantDashboard from "./pages/ApprenantPage/ApprenantDashboard";
import ApprenantProfile from "./pages/ApprenantPage/ApprenantProfile";
import ApprenantEnrolled from "./pages/ApprenantPage/ApprenantEnrolled";
>>>>>>> 23dbf17fa2a0c304ea2f499386634dff8a4faefd

function App(){
  return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
<<<<<<< HEAD
=======
          <Route path="/formateur/signup" element={<FormatterSignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/welcome-back" element={<WelcomeBack />} />
          <Route path="/apprenant/dashboard" element={<ApprenantDashboard />} />
          <Route path="/apprenant/profile" element={<ApprenantProfile />} />
          <Route path="/apprenant/enrolled" element={<ApprenantEnrolled />} />
>>>>>>> 23dbf17fa2a0c304ea2f499386634dff8a4faefd
        </Routes>
      </div>
  );
}

export default App;
