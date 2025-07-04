import React, { useState } from 'react';
import RegistrationForm from '../Pages/RegistrationForm';
import Test from '../Pages/Test'
import { HashRouter, Routes, Route } from 'react-router-dom';
import FinalResultsPage from '../Pages/FinalResultsPage';
import LandingPage from '@/Pages/LandingPage';
import AdminLogin from '@/Pages/AdminLogin';
import Report from '@/Pages/Report';


function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path="/details" element={<RegistrationForm />} />
      <Route path="/test" element={<Test />} />
      <Route path="/success" element={<FinalResultsPage />} />
      <Route path="/admin" element={<AdminLogin/>}/>
      <Route path="/report" element={<Report/>}/>
    
    </Routes>
  );
}

export default App;