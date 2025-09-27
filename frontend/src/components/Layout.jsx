import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './../styles/layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Close mobile menu when clicking on a link
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <div className="logo">
            <Link to="/" className="logo-link">
              <span className="logo-z">Z</span>
              <span className="logo-iora">iora</span>
              <span className="logo-ai">Ai</span>
            </Link>
          </div>
          
          <div className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          
          <nav className={`navigation ${isMenuOpen ? 'active' : ''}`}>
            <ul>
              <li>
                <Link 
                  to="/" 
                  className={isActive('/') ? 'nav-link active' : 'nav-link'}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  className={isActive('/pricing') ? 'nav-link active' : 'nav-link'}
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  to="/models" 
                  className={isActive('/models') ? 'nav-link active' : 'nav-link'}
                >
                  Models
                </Link>
              </li>
              {isLoggedIn && (
                <li>
                  <Link 
                    to="/chat" 
                    className={isActive('/chat') ? 'nav-link active' : 'nav-link'}
                  >
                    Chat
                  </Link>
                </li>
              )}
              <li>
                <Link 
                  to="/about" 
                  className={isActive('/about') ? 'nav-link active' : 'nav-link'}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={isActive('/contact') ? 'nav-link active' : 'nav-link'}
                >
                  Contact
                </Link>
              </li>
            </ul>
            
            <div className="auth-text">
              {isLoggedIn ? (
                <Link to="/" className="get-started-link" onClick={() => {
                  // Logout functionality
                  localStorage.removeItem('token');
                  localStorage.removeItem('userId');
                  localStorage.removeItem('userName');
                  localStorage.removeItem('userEmail');
                  localStorage.removeItem('userRole');
                  setIsLoggedIn(false);
                  window.location.href = '/';
                }}>
                  Logout
                </Link>
              ) : (
                <Link to="/login" className="get-started-link">
                  Get Started
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <Link to="/" className="logo-link">
                <span className="logo-z">Z</span>
                <span className="logo-iora">iora</span>
                <span className="logo-ai">Ai</span>
              </Link>
              <p className="footer-tagline">Next-Gen AI Solutions</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h3>Product</h3>
                <ul>
                  <li><Link to="/models">Models</Link></li>
                  <li><Link to="/pricing">Pricing</Link></li>
                  <li><Link to="/">Features</Link></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h3>Company</h3>
                <ul>
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                  <li><Link to="/">Careers</Link></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h3>Legal</h3>
                <ul>
                  <li><Link to="/">Privacy Policy</Link></li>
                  <li><Link to="/">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2023 ZioraAi. All rights reserved.</p>
            <div className="social-links">
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Discord</a>
              <a href="https://github.com/viyomog" className="social-link">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;