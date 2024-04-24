import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';


import NavBar from './components/NavBar';


// Import Style
import './index.css';

// Pages imports
import Home from './pages/Home'
import Lines from './pages/Lines'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Admin from './pages/Admin'
import Login from './pages/LogIn'

const App = () => {

  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/lines" element={<Lines />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
    </>
  );
};

export default App;
