import React from 'react'
import Dashboard from './pages/adminInterface/Dashboard';
import { Routes, Route } from 'react-router-dom';

const AppAdmin = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default AppAdmin
