import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../screens/Login'; 
import Register from '../screens/Register'; // Import Register if it exists
import Home from '../screens/Home'; // Import Home if it exists
import Project from '../screens/Project'; // Import Project if it exists

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Ensure Home is defined or imported */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Ensure Register is defined or imported */}
        <Route path='/project' element={<Project />} /> {/* Ensure Project is defined or imported */} 
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
