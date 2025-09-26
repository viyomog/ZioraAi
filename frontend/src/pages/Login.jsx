import React, { useState } from 'react';
import axios from 'axios';
import '../styles/login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear password errors when user starts typing
    if (e.target.name === 'password') {
      setPasswordErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    setLoading(true);
    setError('');
    setPasswordErrors([]);
    
    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
      const requestData = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, username: formData.username, email: formData.email, password: formData.password };
      
      const response = await axios.post(`${API_URL}${endpoint}`, requestData);
      
      // Store user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data._id);
      localStorage.setItem('userName', response.data.name);
      localStorage.setItem('userEmail', response.data.email);
      localStorage.setItem('userRole', response.data.role);
      
      // Redirect to home page or previous page
      window.location.href = '/';
    } catch (err) {
      if (err.response?.data?.errors) {
        // Handle password validation errors
        setPasswordErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container card">
        <div className="login-header">
          <h1>ZioraAi</h1>
          <p>Experience the power of AI</p>
        </div>

        <div className="login-form-container">
          <div className={`form-toggle ${!isLogin ? 'signup-active' : ''}`}>
            <button 
              className={isLogin ? 'active' : ''} 
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={!isLogin ? 'active' : ''} 
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}

            {!isLogin && (
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}

            {/* Password requirements for signup */}
            {!isLogin && (
              <div className="password-requirements">
                <h4>Password Requirements:</h4>
                <ul>
                  <li>At least 8 characters long</li>
                  <li>At least one uppercase letter (A-Z)</li>
                  <li>At least one lowercase letter (a-z)</li>
                  <li>At least one number (0-9)</li>
                  <li>At least one special character</li>
                </ul>
              </div>
            )}

            {isLogin && (
              <div className="form-options">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
            </button>

            {/* Display password errors */}
            {passwordErrors.length > 0 && (
              <div className="password-errors">
                <h4>Password Issues:</h4>
                <ul>
                  {passwordErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            {isLogin && (
              <div className="social-login">
                <p>Or login with</p>
                <div className="social-icons">
                  <a href="#" className="social-icon google">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.8 10.5H12v3.5h5.8c-.3 1.5-1.2 2.8-2.5 3.5v3h4c2.3-2.1 3.8-5.2 3.8-8.8 0-.4 0-.8-.1-1.2z"></path>
                      <path d="M12 22c3.1 0 5.7-1 7.6-2.8l-3.8-3c-1 1-2.4 1.6-4 1.6-3.1 0-5.7-2.1-6.6-5H1.2v3.2C3 19.8 7.1 22 12 22z"></path>
                      <path d="M5.4 13.4c-.2-.7-.3-1.3-.3-2s.1-1.3.3-2V6.2H1.2C.5 7.5.1 9 .1 10.5s.4 3 1.1 4.3l4.3-3.2z"></path>
                      <path d="M12 4.3c1.7 0 3.1.6 4.2 1.8l3.1-3.1C17.6 1.2 15 0 12 0 7.1 0 3 2.2 1.2 5.2l4.2 3.2c.9-2.3 3.1-4.1 6.6-4.1z"></path>
                    </svg>
                  </a>
                  <a href="#" className="social-icon github">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                  </a>
                  <a href="#" className="social-icon discord">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8c0 2.21-2.24 4-5 4s-5-1.79-5-4 2.24-4 5-4 5 1.79 5 4z"></path>
                      <path d="M10 16c.44 1.23 1.5 2 3 2s2.56-.77 3-2"></path>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              className="toggle-form" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;