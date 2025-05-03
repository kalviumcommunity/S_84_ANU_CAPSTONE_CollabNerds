import React from "react";
import '../Styles/FrontPage.css';

const FrontPage = () => {
  return (
    <div className="frontpage-container">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>Welcome to CollabNerds</h1>
          <p>The ultimate platform for students to pitch ideas, find collaborators, and manage projects</p>
          <button className="cta-button">Get Started</button>
        </div>
      </header>

      {/* About Section */}
      <section className="about">
        <h2>About CollabNerds</h2>
        <p>
          CollabNerds is a collaborative platform designed to help students connect with like-minded individuals,
          pitch innovative ideas, and bring them to life through teamwork. It's a space for growth, collaboration, and creativity.
        </p>
      </section>

      {/* Key Features Section */}
      <section className="features">
        <h2>Core Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Pitch Ideas</h3>
            <p>Share your innovative project ideas with the community and find collaborators.</p>
          </div>
          <div className="feature-card">
            <h3>Team Management</h3>
            <p>Easily manage your project teams with built-in task assignments, schedules, and progress tracking.</p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Chat</h3>
            <p>Communicate with your team in real-time through our integrated chat system.</p>
          </div>
        </div>
      </section>

      {/* Sign-Up / Log-In Section */}
      <section className="auth">
        <h2>Join CollabNerds</h2>
        <button className="cta-button">Sign Up</button>
        <p>Already have an account? <a href="/login">Log In</a></p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 CollabNerds. All rights reserved.</p>
        <div className="social-links">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>
      </footer>
    </div>
  );
};

export default FrontPage;
