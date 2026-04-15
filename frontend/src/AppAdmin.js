import React from 'react'
import Dashboard from './pages/adminInterface/Dashboard';
import { Routes, Route, Navigate } from 'react-router-dom';
import MyProfile from './pages/adminInterface/MyProfile';
import Courses from './pages/adminInterface/Courses';
import Instructors from './pages/adminInterface/Instructors';
import Students from './pages/adminInterface/Students';
import Conversations from './pages/adminInterface/Conversations';
import Settings from './pages/adminInterface/Settings';

const AppAdmin = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/profile' element={<MyProfile />} />
        <Route path='/courses' element={<Courses />} />
        <Route path='/instructors' element={<Instructors />} />
        <Route path='/students' element={<Students />} />
        <Route path='/conversations' element={<Conversations />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </div>
  )
}

export default AppAdmin
