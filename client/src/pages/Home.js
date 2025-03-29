import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import TypingTest from '../components/TypingTest';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="home-page">
      <header className="hero">
        <h1>Monkey-Type: Test Your Typing Speed</h1>
        <p>Improve your typing speed and accuracy, and gain insights about your performance.</p>
        {!isAuthenticated && (
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">
              Create New Account
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        )}
      </header>
      
      <div className="features">
        <div className="feature">
          <h3>15 or 30 Second Typing Test</h3>
          <p>Choose a quick session to test your typing speed</p>
        </div>
        <div className="feature">
          <h3>Different Text Options</h3>
          <p>Choose words, numbers, or punctuation marks to practice typing</p>
        </div>
        <div className="feature">
          <h3>Typing Analysis</h3>
          <p>Learn about your common typing errors and opportunities for improvement</p>
        </div>
        <div className="feature">
          <h3>Neuropsychological Insights</h3>
          <p>Learn about your typing behavior and personality and style</p>
        </div>
      </div>
      
      <section className="typing-test-section">
        <div className="section-header">
          <h2>Start Typing Test</h2>
          <p>See your typing speed and accuracy</p>
        </div>
        
        <TypingTest />
        
        {!isAuthenticated && (
          <div className="login-prompt">
            <p>Login to save your results and see analysis <Link to="/login">Login</Link>.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home; 