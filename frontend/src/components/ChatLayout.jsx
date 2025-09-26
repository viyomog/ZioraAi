import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './../styles/chat-layout.css';

const ChatLayout = ({ children }) => {
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
    <div className="chat-layout">
      {/* Dropdown menu for chat page */}
      <div className={`chat-header-dropdown ${isMenuOpen ? 'open' : ''}`}>
        <div className="dropdown-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="menu-label">Menu</span>
        </div>
        
        <div className="dropdown-menu">
          <div className="dropdown-content">
            <div className="dropdown-logo">
              <Link to="/" className="logo-link">
                <span className="logo-z">Z</span>
                <span className="logo-iora">iora</span>
                <span className="logo-ai">Ai</span>
              </Link>
            </div>
            
            <nav className="dropdown-navigation">
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
                    Pricing Plans
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/models" 
                    className={isActive('/models') ? 'nav-link active' : 'nav-link'}
                  >
                    AI Models
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
                    About Us
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
              
              <div className="dropdown-auth">
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
                    Sign Out
                  </Link>
                ) : (
                  <Link to="/login" className="get-started-link">
                    Get Started
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
      
      <main className="chat-main-content">
        {children}
      </main>
    </div>
  );
};

export default ChatLayout;