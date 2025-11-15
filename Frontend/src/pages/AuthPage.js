// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AUTH_API_URL = 'http://localhost:5000/api/auth';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const endpoint = isLogin ? 'login' : 'register';
    try {
      const response = await axios.post(`${AUTH_API_URL}/${endpoint}`, formData);
      if (isLogin) {
        // Save token and redirect to homepage (or use router navigate)
        localStorage.setItem('token', response.data.token);
        setMessage('Login successful! Redirecting...');
        // simple redirect:
        window.location.href = '/';
      } else {
        setMessage((response.data.msg || 'Registration successful.') + ' Please log in now.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.msg || err.message || 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: '460px',
          width: '100%',
          border: 'none',
          borderRadius: '12px',
        }}
      >
        <div className="card-body">
          <h2 className="card-title text-center mb-4 fw-bold">
            {isLogin ? 'Audience Dashboard Login' : 'Register New User'}
          </h2>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
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

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
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

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-3 fs-5"
              disabled={loading}
            >
              {loading ? (isLogin ? 'Logging in...' : 'Registering...') : isLogin ? 'Log In' : 'Register'}
            </button>
          </form>

          <p className="text-center mt-3 mb-0">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <span
              className="text-primary"
              style={{ cursor: 'pointer', fontWeight: '600' }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Register here' : 'Log In'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
