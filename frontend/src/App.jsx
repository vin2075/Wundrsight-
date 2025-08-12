import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  }

  return (
    <div className="p-4">
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/">Home</Link> 
        <Link to="/login">Login</Link> 
        <Link to="/register">Register</Link> 
        <button onClick={logout}>Logout</button>
      </nav>

      <Routes>
        <Route path="/" element={<div>Welcome! Please login or register.</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}
