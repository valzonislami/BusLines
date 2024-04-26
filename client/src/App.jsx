import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Style
import './index.css';

// Pages imports
import Home from './pages/Home'
import Lines from './pages/Lines'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import Login from './pages/LogIn'
import CityList from './pages/admin/city/CityList'
import CityCreate from './pages/admin/city/CityCreate'
import EditCity from './pages/admin/city/EditCity'
import ScheduleList from './pages/admin/schedule/ScheduleList'
import EditSchedule from './pages/admin/schedule/EditSchedule';

const App = () => {

  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lines" element={<Lines />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/authentication" element={<Login />} />
            <Route path="/admin/cities/" element={<CityList />} />
            <Route path="/admin/cities/addCity" element={<CityCreate />} />
            <Route path="/admin/cities/:id/edit" element={<EditCity />} />
            <Route path="/admin/schedules/" element={<ScheduleList />} />
            <Route path="/admin/schedules/:id/edit" element={<EditSchedule />} />
          </Routes>
        </Router>
    </>
  );
};

export default App;
