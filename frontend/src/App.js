import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import SignUp from "./pages/loginPage/SignUp";
import FormatterSignUp from "./pages/loginPage/FormatterSignUp";
import ForgotPassword from "./pages/loginPage/ForgotPassword";
import OTPVerification from "./pages/loginPage/OTPVerification";
import SetPassword from "./pages/loginPage/SetPassword";
import WelcomeBack from "./pages/loginPage/WelcomeBack";
import ApprenantDashboard from "./pages/ApprenantPage/ApprenantDashboard";
import FormateurEarnings from "./pages/FormateurPage/FormateurEarnings";
import ApprenantProfile from "./pages/ApprenantPage/ApprenantProfile";
import ApprenantEnrolled from "./pages/ApprenantPage/ApprenantEnrolled";
import ApprenantCertificates from "./pages/ApprenantPage/ApprenantCertificates";
import ApprenantQuizzes from "./pages/ApprenantPage/ApprenantQuizzes";
import ApprenantCourses from "./pages/ApprenantPage/ApprenantCourses";
import ApprenantWishlist from "./pages/ApprenantPage/ApprenantWishlist";
import ApprenantMessages from "./pages/ApprenantPage/ApprenantMessages";
import { WishlistProvider } from './context/WishlistContext';

function App(){
  return (
      <div className="App">
        <WishlistProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/formateur/signup" element={<FormatterSignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/welcome-back" element={<WelcomeBack />} />
          <Route path="/apprenant/dashboard" element={<ApprenantDashboard />} />
          <Route path="/apprenant/profile" element={<ApprenantProfile />} />
          <Route path="/apprenant/enrolled" element={<ApprenantEnrolled />} />
          <Route path="/apprenant/certificates" element={<ApprenantCertificates />} />
          <Route path="/apprenant/quizzes" element={<ApprenantQuizzes />} />
          <Route path="/apprenant/courses" element={<ApprenantCourses />} />
          <Route path="/apprenant/wishlist" element={<ApprenantWishlist />} />
          <Route path="/apprenant/messages" element={<ApprenantMessages />} />
        </Routes>
        </WishlistProvider>
      </div>
  );
}

export default App;
