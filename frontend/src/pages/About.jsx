import React from 'react';
import '../styles/about.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-header">
        <div className="container">
          <h1>About ZioraAi</h1>
          <p>Revolutionizing access to artificial intelligence</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-section">
            <h2>Our Vision</h2>
            <p>
              We believe that artificial intelligence should be a tool available to everyone, not just 
              large corporations or technical experts. Our vision is to democratize AI by making it 
              accessible, affordable, and easy to use for individuals and businesses of all sizes.
            </p>
            <p>
              Founded in 2025, ZioraAi emerged from a simple idea: what if anyone could harness the 
              power of cutting-edge AI without the complexity and cost typically associated with it?
            </p>
          </div>

          <div className="about-section">
            <h2>Our Founder</h2>
            <div className="founder-content">
              <div className="founder-text">
                <h3>Viyom Paliwal</h3>
                <p>
                  Viyom Paliwal, the visionary founder of ZioraAi, has always been passionate about 
                  making technology more accessible. With a background in computer science and 
                  artificial intelligence, Viyom recognized the potential of AI to transform lives 
                  but also saw the barriers that prevented many from accessing these powerful tools.
                </p>
                <p>
                  His dream was to create a platform where anyone could experiment with 
                  state-of-the-art AI models without the complexity and cost typically associated 
                  with such technology. This dream became reality with ZioraAi, a platform that 
                  embodies his commitment to democratizing AI.
                </p>
                <p>
                  Under Viyom's leadership, ZioraAi continues to push boundaries, constantly adding 
                  new models and features to ensure our users always have access to the latest in 
                  AI technology.
                </p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Our Journey</h2>
            <div className="journey-content">
              <div className="journey-text">
                <p>
                  What started as a passion project has evolved into a comprehensive AI platform 
                  that brings together the most advanced artificial intelligence models in a single, 
                  intuitive interface.
                </p>
                <p>
                  Our team of AI enthusiasts and developers work tirelessly to curate and integrate 
                  the best AI models available, ensuring our users always have access to state-of-the-art 
                  technology without the technical barriers.
                </p>
                <p>
                  Today, we serve thousands of users who rely on our platform for creative projects, 
                  business solutions, research, and everyday problem-solving.
                </p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Our Commitment</h2>
            <div className="commitment-content">
              <p>
              We are committed to breaking down the barriers between complex AI technology and everyday users. 
              Our platform is designed to be intuitive, powerful, and accessible to everyone - from students 
              and hobbyists to professionals and enterprises.
              </p>
              <div className="commitment-features">
                <div className="commitment-item">
                  <h3>Innovation</h3>
                  <p>Continuously integrating the latest AI advancements</p>
                </div>
                <div className="commitment-item">
                  <h3>Accessibility</h3>
                  <p>Making advanced AI available to everyone</p>
                </div>
                <div className="commitment-item">
                  <h3>Simplicity</h3>
                  <p>Removing complexity without sacrificing power</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;