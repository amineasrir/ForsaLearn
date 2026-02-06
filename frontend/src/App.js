import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import SignIn from "./pages/loginPage/SignIn";
import SignUp from "./pages/loginPage/SignUp";
import FormatterSignUp from "./pages/loginPage/FormatterSignUp";
import ForgotPassword from "./pages/loginPage/ForgotPassword";import OTPVerification from "./pages/loginPage/OTPVerification";

import SetPassword from "./pages/loginPage/SetPassword";
import WelcomeBack from "./pages/loginPage/WelcomeBack";

function App(){
  return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/formateur/signup" element={<FormatterSignUp />} />
          <Route path="/formateur/register" element={<FormatterSignUp />} />
          <Route path="/formateur/signin" element={<SignIn />} />
          <Route path="/formateur/login" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/welcome-back" element={<WelcomeBack />} />
        </Routes>
      </div>
  );
}

export default App;
