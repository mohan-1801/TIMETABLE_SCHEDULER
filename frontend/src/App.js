import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Scheduler from './pages/Scheduler';
import TimetableView from './pages/TimetableView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scheduler" element={<Scheduler />} />
        <Route path="/timetable" element={<TimetableView />} />
      </Routes>
    </Router>
  );
}

export default App;
