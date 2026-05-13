import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import SignUp from "./pages/loginPage/SignUp";
import ForgotPassword from "./pages/loginPage/ForgotPassword";
import OTPVerification from "./pages/loginPage/OTPVerification";
import SetPassword from "./pages/loginPage/SetPassword";
import WelcomeBack from "./pages/loginPage/WelcomeBack";
import ApprenantDashboard from "./pages/ApprenantPage/ApprenantDashboard";
import ApprenantProfile from "./pages/ApprenantPage/ApprenantProfile";
import ApprenantEnrolled from "./pages/ApprenantPage/ApprenantEnrolled";
import ApprenantCertificates from "./pages/ApprenantPage/ApprenantCertificates";
import ApprenantQuizzes from "./pages/ApprenantPage/ApprenantQuizzes";
import ApprenantCourses from "./pages/ApprenantPage/ApprenantCourses";
import ApprenantWishlist from "./pages/ApprenantPage/ApprenantWishlist";
import ApprenantMessages from "./pages/ApprenantPage/ApprenantMessages";
import ApprenantSettings from "./pages/ApprenantPage/ApprenantSettings";
import ApprenantSupport from "./pages/ApprenantPage/ApprenantSupport";
import CourseDetails from "./pages/ApprenantPage/CourseDetails";
import CoursePlayer from "./pages/ApprenantPage/CoursePlayer";
import { WishlistProvider } from './context/WishlistContext';
import ApprenantProtectedRoute from './protectRoutes/ApprenantProtectedRoute';

function App(){
  return (
      <div className="App">
        <WishlistProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/welcome-back" element={<WelcomeBack />} />
          <Route path="/apprenant/dashboard" element={<ApprenantProtectedRoute><ApprenantDashboard /></ApprenantProtectedRoute>} />
          <Route path="/apprenant/profile" element={<ApprenantProtectedRoute><ApprenantProfile /></ApprenantProtectedRoute>} />
          <Route path="/apprenant/enrolled" element={<ApprenantProtectedRoute><ApprenantEnrolled /></ApprenantProtectedRoute>} />
          <Route path="/apprenant/certificates" element={<ApprenantProtectedRoute><ApprenantCertificates /></ApprenantProtectedRoute>} />
          <Route path="/apprenant/quizzes" element={<ApprenantProtectedRoute><ApprenantQuizzes /></ApprenantProtectedRoute>} />
          <Route path="/apprenant/courses" element={<ApprenantProtectedRoute><ApprenantCourses /></ApprenantProtectedRoute>} />
          <Route path="/apprenant/course/:id" element={<ApprenantProtectedRoute><CourseDetails /></ApprenantProtectedRoute>} />
          <Route path="/apprenant/course/:id/learn" element={<ApprenantProtectedRoute><CoursePlayer /></ApprenantProtectedRoute>} />
          <Route path="/apprenant/wishlist" element={<ApprenantProtectedRoute><ApprenantWishlist /></ApprenantProtectedRoute>} />
          <Route path="/apprenant/messages" element={<ApprenantProtectedRoute><ApprenantMessages /></ApprenantProtectedRoute>} />
          <Route path="/apprenant/settings" element={<ApprenantProtectedRoute><ApprenantSettings /></ApprenantProtectedRoute>} />
          <Route path="/apprenant/support" element={<ApprenantProtectedRoute><ApprenantSupport /></ApprenantProtectedRoute>} />
        </Routes>
        </WishlistProvider>
      </div>
  );
}

export default App;
