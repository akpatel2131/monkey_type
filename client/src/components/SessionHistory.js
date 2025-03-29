import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SessionHistory = () => {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`/api/sessions/${user.id}`);
        setSessions(res.data.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching session history');
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  const fetchAnalysis = async (sessionId) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/sessions/analysis/${sessionId}`);
      setAnalysis(res.data.data.analysis);
      setLoading(false);
    } catch (err) {
      setError('Error getting analysis');
      setLoading(false);
    }
  };

  const handleSessionClick = async (session) => {
    setSelectedSession(session);
    await fetchAnalysis(session._id);
  };

  // Format date for better readability
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('hi-IN', options);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="session-history">
      <h2>Your Typing Sessions</h2>
      
      {sessions.length === 0 ? (
        <p>No typing sessions yet. Start typing!</p>
      ) : (
        <div className="history-container">
          <div className="sessions-list">
            {sessions.map((session) => (
              <div 
                key={session._id} 
                className={`session-item ${selectedSession && selectedSession._id === session._id ? 'selected' : ''}`}
                onClick={() => handleSessionClick(session)}
              >
                <div className="session-date">{formatDate(session.createdAt)}</div>
                <div className="session-stats">
                  <div className="stat">
                    <span>WPM: </span>
                    <span className="value">{session.wpm}</span>
                  </div>
                  <div className="stat">
                    <span>Accuracy: </span>
                    <span className="value">{session.accuracy}%</span>
                  </div>
                  <div className="stat">
                    <span>Duration: </span>
                    <span className="value">{session.duration}s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {selectedSession && analysis && (
            <div className="session-details">
              <h3>Session Analysis</h3>
              
              <div className="analysis-section">
                <h4>Error Patterns</h4>
                <p>Total Errors: {analysis.errorPatterns.totalErrors}</p>
                <p>Accuracy: {analysis.errorPatterns.accuracy}%</p>
                <p>Typing Speed: {analysis.errorPatterns.speedTrend}</p>
                
                {analysis.errorPatterns.commonErrorWords.length > 0 && (
                  <>
                    <h5>Common Error Words:</h5>
                    <ul className="error-words-list">
                      {analysis.errorPatterns.commonErrorWords.map((item, index) => (
                        <li key={index}>
                          {item.word} ({item.count} times)
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              
              <div className="analysis-section">
                <h4>Psychological Insights</h4>
                <ul className="insights-list">
                  <li>
                    <strong>Impulsivity: </strong> 
                    {analysis.psychologicalInsights.impulsivity === 'high' 
                      ? 'You type quickly and are more likely to make errors.' 
                      : 'You type patiently and focus on accuracy.'}
                  </li>
                  <li>
                    <strong>Cognitive Load: </strong> 
                    {analysis.psychologicalInsights.cognitiveLoad}
                  </li>
                  <li>
                    <strong>Resilience: </strong> 
                    {analysis.psychologicalInsights.resilience === 'high' 
                      ? 'You recover quickly after errors.' 
                      : analysis.psychologicalInsights.resilience === 'low'
                        ? 'Your typing speed decreases after errors.'
                        : 'Your typing speed remains average after errors.'}
                  </li>
                  <li>
                    <strong>Pressure Response: </strong> 
                    {analysis.psychologicalInsights.pressureResponse}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionHistory; 