import React, { useState } from 'react';
import axios from 'axios';

// URL for your backend authentication routes
const AUTH_API_URL = 'http://localhost:5000/api/auth';

function AuthPage() {
  // State to hold form data and current mode (Login/Register)
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (Login or Register)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const endpoint = isLogin ? 'login' : 'register';

    try {
      const response = await axios.post(`${AUTH_API_URL}/${endpoint}`, formData);

      if (isLogin) {
        // If successful login, save the JWT token
        localStorage.setItem('token', response.data.token);
        setMessage('Login successful! Redirecting...');
        
        // Use window.location to force a full page reload, which will trigger the router check
        window.location.href = '/'; 

      } else {
        // Successful registration
        setMessage(response.data.msg + ' Please log in now.');
        // Switch to login mode automatically after registration
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
      }

    } catch (err) {
      // Handle backend errors (e.g., Invalid Credentials, User already exists)
      const errorMessage = err.response?.data?.msg || 'An unexpected error occurred.';
      setError(errorMessage);
      console.error('Auth Error:', err);
    }
  };

  // --- Render Logic ---
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '450px', width: '100%' }}>
        <h2 className="card-title text-center mb-4">
          {isLogin ? 'Audience Dashboard Login' : 'Register New User'}
        </h2>

        {/* Messaging Area */}
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name Field (Only for Register mode) */}
          {!isLogin && (
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          {/* Email Field */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            {isLogin ? 'Log In' : 'Register'}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <p className="text-center mt-3">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <span 
            className="text-primary" 
            style={{ cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register here' : 'Log In'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;