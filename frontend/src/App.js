import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import api from './api';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Decode for user info (simple, no backend call)
      setUser({ role: localStorage.getItem('role') });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white shadow-lg p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">SmartSeason</h1>{/* Main app title */}
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.role}</span>
              <button onClick={logout} className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Logout
              </button>
            </>
          ) : null}
        </nav>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/" element=<Navigate to={user ? "/dashboard" : "/login"} /> />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
