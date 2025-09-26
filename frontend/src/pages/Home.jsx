import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="highlight">ZioraAi</span> - Your Gateway to Advanced AI
            </h1>
            <p className="hero-subtitle">
              Experience the future of artificial intelligence with our cutting-edge platform. 
              Access multiple AI models in one powerful interface.
            </p>
            <div className="hero-buttons">
              <Link to="/models" className="btn btn-primary">
                Explore AI Models
              </Link>
              <Link to="/pricing" className="btn btn-secondary">
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Features Section */}
      <section className="features-new">
        <div className="container">
          <div className="features-header">
            <h2 className="section-title">Powerful AI Capabilities</h2>
            <p className="section-description">
              Discover what makes ZioraAi the ultimate AI platform
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3>Multi-Model Access</h3>
              <p>Switch between 8 different AI models seamlessly for various tasks and needs.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3>OpenRouter Powered</h3>
              <p>Reliable and fast AI responses powered by the OpenRouter API infrastructure.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3>Flexible Pricing</h3>
              <p>Choose from free and premium plans to match your requirements and budget.</p>
            </div>
          </div>
        </div>
      </section>

      {/* New AI Models Preview */}
      <section className="models-preview-new">
        <div className="container">
          <div className="models-header">
            <h2 className="section-title">Featured AI Models</h2>
            <p className="section-description">
              Explore our collection of state-of-the-art AI models
            </p>
          </div>
          
          <div className="models-types">
            <div className="model-type">
              <h3>Popular Free Models</h3>
              <ul>
                <li>
                  <span className="model-name">Grok 4 Fast</span>
                  <span className="model-provider">xAI</span>
                </li>
                <li>
                  <span className="model-name">Nemotron Nano 9B V2</span>
                  <span className="model-provider">NVIDIA</span>
                </li>
                <li>
                  <span className="model-name">DeepSeek V3.1</span>
                  <span className="model-provider">DeepSeek</span>
                </li>
              </ul>
            </div>
            
            <div className="model-type">
              <h3>Advanced Premium Models</h3>
              <ul>
                <li>
                  <span className="model-name">Llama 3.3 8B Instruct</span>
                  <span className="model-provider">Meta</span>
                </li>
                <li>
                  <span className="model-name">Gemma 3n 2B</span>
                  <span className="model-provider">Google</span>
                </li>
                <li>
                  <span className="model-name">Kimi Dev 72B</span>
                  <span className="model-provider">MoonshotAI</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="center-button">
            <Link to="/models" className="btn btn-primary">
              Browse All Models
            </Link>
          </div>
        </div>
      </section>

      {/* New CTA Section */}
      <section className="cta-new">
        <div className="container">
          <div className="cta-content">
            <h2>Start Your AI Journey Today</h2>
            <p>
              Join thousands of users who are already leveraging the power of multiple AI models
            </p>
            <div className="cta-buttons">
              <Link to="/login" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/about" className="btn btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;