import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders'; // ✅ New import
import Analysis from './pages/Analysis';

import PrivateRoute from './components/PrivateRoute';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/inventory"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Inventory />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
  path="/analysis"
  element={
    <PrivateRoute isLoggedIn={isLoggedIn}>
      <Analysis />
    </PrivateRoute>
  }
/>


        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
