import React from 'react'
import Dashboard from './pages/adminInterface/Dashboard';
import { Routes, Route, Navigate } from 'react-router-dom';
import MyProfile from './pages/adminInterface/MyProfile';
import Courses from './pages/adminInterface/Courses';
import CourseDetails from './pages/adminInterface/CourseDetails';
import Instructors from './pages/adminInterface/Instructors';
import InstructorDetails from './pages/adminInterface/InstructorDetails';
import Students from './pages/adminInterface/Students';
import StudentDetails from './pages/adminInterface/StudentDetails';
import Conversations from './pages/adminInterface/Conversations';
import SupportTickets from './pages/adminInterface/SupportTickets';
import Settings from './pages/adminInterface/Settings';

const AppAdmin = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/profile' element={<MyProfile />} />
        <Route path='/courses' element={<Courses />} />
        <Route path='/courses/:courseId' element={<CourseDetails />} />
        <Route path='/instructors' element={<Instructors />} />
        <Route path='/instructors/:instructorId' element={<InstructorDetails />} />
        <Route path='/students' element={<Students />} />
        <Route path='/students/:studentId' element={<StudentDetails />} />
        <Route path='/conversations' element={<Conversations />} />
        <Route path='/support' element={<SupportTickets />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </div>
  )
}

export default AppAdmin
