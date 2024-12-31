import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../screens/Login'; 
import Register from '../screens/Register'; // Import Register if it exists
import Home from '../screens/Home'; // Import Home if it exists
import Project from '../screens/Project'; // Import Project if it exists
import UserAuth from '../auth/UserAuth';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserAuth><Home /></UserAuth>} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path='/project' element={<UserAuth><Project /></UserAuth>} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
