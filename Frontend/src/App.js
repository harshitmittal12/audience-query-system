import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'; // <-- TYPO REMOVED
import DashboardPage from './pages/DashboardPage';
import QueryDetailPage from './pages/QueryDetailPage';
import AuthPage from './pages/AuthPage';
import Footer from './components/Footer'; // 1. Import the new Footer

// --- Navbar Component ---
const Navbar = () => {
  const token = localStorage.getItem('token');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid container">
        <Link className="navbar-brand fw-bold" to="/">
          🚀 Query Management System
        </Link>
        {token && (
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

// --- PrivateRoute Component ---
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// --- Main App Layout Component ---
// We create this layout to wrap pages with the Navbar and Footer
const AppLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ flexGrow: 1 }}> {/* This makes the content fill the space */}
      {children}
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route: Login Page (No Navbar/Footer) */}
        <Route path="/login" element={<AuthPage />} />
        
        {/* Private Routes (Wrapped in AppLayout) */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/query/:id"
          element={
            <PrivateRoute>
              <AppLayout>
                <QueryDetailPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;