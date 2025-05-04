import React, { useEffect } from "react";
import '../Styles/FrontPage.css';
import AnimatedGlobe from "../Components/AnimatedGlobe";
import { motion } from "framer-motion";
const FrontPage = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="frontpage-container">
      {/* Hero Section */}
      <header className="hero hidden">
      <div className="globe-overlay">
        <AnimatedGlobe />
      </div>
        <div className="hero-content">
         

<motion.h1
  className="hero-title"
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }}
>
  {"Find Your Perfect Team for Innovation".split(" ").map((word, index) => (
    <motion.span
      key={index}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      style={{ display: "inline-block", marginRight: "8px" }}
    >
      {word}
    </motion.span>
  ))}
</motion.h1>
          <p className="subtitle">CollabNerds connects students with brilliant ideas to talented collaborators. Pitch your project, build your team, and bring your vision to life.</p>
          
          <div className="cta-buttons">
            <button className="primary-button hover-scale">
              Get Started
              <span className="button-glow"></span>
            </button>
            <button className="secondary-button hover-scale">
              Explore Projects
              <span className="button-glow"></span>
            </button>
          </div>
        </div>
        
        <div className="hero-deco">
          <div className="deco-orb purple"></div>
          <div className="deco-orb blue"></div>
        </div>
      </header>

      {/* Innovation Section */}
      <section className="innovation-section hidden">
        <div className="section-inner">
          <h2>Fueling Innovation One Collab at a Time</h2>
          <div className="innovation-grid">
            {['💡', '👥', '💬'].map((icon, index) => (
              <div className="innovation-card hover-float" key={index}>
                <div className="card-icon">{icon}</div>
                <h3>{['Project Pitching', 'Team Management', 'Built-in Communication'][index]}</h3>
                <p>{[
                  'Share your idea with goals, description & required skills to attract the perfect team.',
                  'Accept or decline contributor requests and manage team roles efficiently.',
                  'Chat with team members and schedule meetings using our integrated tools.'
                ][index]}</p>
                <div className="card-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-inner">
          <h2>How CollabNerds Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Sign up with email or Google in seconds</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Pitch Your Idea</h3>
              <p>Share project details and required skills</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Build Your Team</h3>
              <p>Review and accept contributor requests</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Collaborate</h3>
              <p>Use built-in tools to bring your idea to life</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="cta-content">
          <h2>Ready to Find Your Dream Team?</h2>
          <p>Join CollabNerds today and turn your ideas into reality with the perfect collaborators.</p>
          <button className="cta-button">Get Started Now</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
         
         

        <div className="footer-wrapper">
  <svg
    className="footer-wave"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 320"
  >
    <path
      fill="#282c34"
      fillOpacity="1"
      d="M0,160L60,170.7C120,181,240,203,360,213.3C480,224,600,224,720,192C840,160,960,96,1080,85.3C1200,75,1320,117,1380,138.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
    ></path>
  </svg>

  <div className="footer-branding">
    <h3>CollabNerds</h3>
    <p>By students, for students. Fueling innovation one collab at a time.</p>
    <p className="copyright">© 2025 CollabNerds. All rights reserved.</p>
  </div>
</div>

        </div>
      </footer>
    </div>
  );
};

export default FrontPage;