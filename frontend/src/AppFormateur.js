import React from 'react'
import { Routes, Route } from 'react-router-dom';
import FormatterSignUp from "./pages/loginPage/FormatterSignUp";


const AppFormateur = () => {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<FormatterSignUp />} />
      </Routes>
    </div>
  )
}

export default AppFormateur
