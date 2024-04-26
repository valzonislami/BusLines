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
import ScheduleCreate from './pages/admin/schedule/ScheduleCreate';
import LineList from './pages/admin/line/LineList'
import LineCreate from './pages/admin/line/LineCreate'
import EditLine from './pages/admin/line/EditLine'

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
            <Route path="/admin/schedules/addSchedule" element={<ScheduleCreate />} />
            <Route path="/admin/schedules/:id/edit" element={<EditSchedule />} />
            <Route path="/admin/lines/" element={<LineList />} />
            <Route path="/admin/lines/addLine" element={<LineCreate />} />
            <Route path="/admin/lines/:id/edit" element={<EditLine />} />

          </Routes>
        </Router>
    </>
  );
};

export default App;

