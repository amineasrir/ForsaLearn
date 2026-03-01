import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FormateurDashboard from './pages/FormateurPage/FormateurDashboard';
import FormateurProfile from './pages/FormateurPage/FormateurProfile';
import FormateurCourses from './pages/FormateurPage/FormateurCourses';
import FormateurStudent from './pages/FormateurPage/FormateurStudent';
import FormateurEarnings from './pages/FormateurPage/FormateurEarnings';
import FormateurCertificats from './pages/FormateurPage/FormateurCertificats';
import FormateurMessage from './pages/FormateurPage/FormateurMessage';
import FormateurSupport from './pages/FormateurPage/FormateurSupport';
import FormateurQuiz from './pages/FormateurPage/FormateurQuiz';
import FormateurQuizResult from './pages/FormateurPage/FormateurQuizResult';
import FormateurSetting from './pages/FormateurPage/FormateurSetting';

const AppFormateur = () => {
  // nested routes for the instructor area
  return (
    <div>
      <Routes>
        <Route path="dashboard" element={<FormateurDashboard />} />
        <Route path="profile" element={<FormateurProfile />} />
        <Route path="courses" element={<FormateurCourses />} />
        <Route path="students" element={<FormateurStudent />} />
        <Route path="earnings" element={<FormateurEarnings />} />
        <Route path="certificates" element={<FormateurCertificats />} />
        <Route path="messages" element={<FormateurMessage />} />
        <Route path="support" element={<FormateurSupport />} />
        <Route path="quiz" element={<FormateurQuiz />} />
        <Route path="quiz-results" element={<FormateurQuizResult />} />
        <Route path="settings" element={<FormateurSetting />} />
        {/* redirect any unknown path to dashboard */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default AppFormateur;
