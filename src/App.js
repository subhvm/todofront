import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/login';
import TodoApp from './components/todo';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    console.log('Auth status updated:', isAuthenticated);
  }, [isAuthenticated]);

  // Listen for storage changes (e.g., when token is saved or removed)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Auth onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/todos" />} />
          <Route path="/todos" element={isAuthenticated ? <TodoApp /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
       
    </Router>
  );
}

export default App;
