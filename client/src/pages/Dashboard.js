import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import TypingTest from '../components/TypingTest';
import SessionHistory from '../components/SessionHistory';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Hello, {user?.username}!</h1>
        <p>Practice your typing skills and track your performance.</p>
      </div>
      
      <div className="dashboard-sections">
        <section className="dashboard-section typing-test-section">
          <h2>Typing Test</h2>
          <TypingTest />
        </section>
        
        <section className="dashboard-section history-section">
          <SessionHistory />
        </section>
      </div>
    </div>
  );
};

export default Dashboard; 