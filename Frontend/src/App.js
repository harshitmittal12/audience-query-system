import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import QueryDetailPage from './pages/QueryDetailPage';
import AuthPage from './pages/AuthPage'; // <-- Your Login/Register page

// --- Helper component to protect routes ---
const PrivateRoute = ({ children }) => {
  // Check if a token exists in local storage
  const token = localStorage.getItem('token');
  // If the token exists, render the requested page (children)
  // If the token does NOT exist, redirect to the login page (/login)
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route: The Login/Register Page */}
        {/* If the user is not logged in, they will be redirected here */}
        <Route path="/login" element={<AuthPage />} />
        
        {/* Private Routes: Only accessible with a valid token */}
        
        {/* Route 1: The main dashboard (Protected) */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        
        {/* Route 2: The details page (Protected) */}
        <Route
          path="/query/:id"
          element={
            <PrivateRoute>
              <QueryDetailPage />
            </PrivateRoute>
          }
        />

        {/* Catch-all for unknown routes (optional, but good practice) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;