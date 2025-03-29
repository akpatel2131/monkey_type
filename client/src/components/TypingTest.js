import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Sample paragraphs for testing
const paragraphs = {
  words: `Once upon a time, there was a little child who went to school every day. He loved his parents very much and always enjoyed playing with his friends. He also liked reading books and wanted to become a scientist when he grew up.`,
  numbers: `In 2023, there were 5.9 billion mobile phone users worldwide. India has 1.4 billion people and 830 million internet users. An average person spends 3.25 hours on their phone daily and uses 24.7 apps.`,
  punctuation: `Did you know? India gained independence in 1947! Our constitution states: "We, the people of India, having solemnly resolved to constitute India into a sovereign, socialist, secular, democratic republic."`,
  mixed: `In 2022, India celebrated its 75th Independence Day! The country has 28 states and 8 union territories, with a total population of 1.4 billion. Did you know that India's national bird is the peacock? Our national sport is hockey and the national flower is the lotus.`
};

const TypingTest = () => {
  const { user } = useContext(AuthContext);
  const [testDuration, setTestDuration] = useState(15);
  const [textType, setTextType] = useState('words');
  const [text, setText] = useState(paragraphs.words);
  const [typed, setTyped] = useState('');
  const [timeLeft, setTimeLeft] = useState(null); // null means not started
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [errors, setErrors] = useState(0);
  const [charTimes, setCharTimes] = useState([]);
  const [errorWords, setErrorWords] = useState([]);
  
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  
  // Load text based on selected type
  useEffect(() => {
    setText(paragraphs[textType]);
  }, [textType]);
  
  // Start/reset the test
  const startTest = () => {
    setTyped('');
    setTimeLeft(testDuration);
    setIsTestActive(true);
    setIsTestComplete(false);
    setStartTime(Date.now());
    setWpm(0);
    setAccuracy(0);
    setErrors(0);
    setCharTimes([]);
    setErrorWords([]);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Clear any existing timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          endTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // End the test
  const endTest = () => {
    setIsTestActive(false);
    setIsTestComplete(true);
    
    // Calculate final WPM, accuracy and collect error words
    calculateResults();
    
    // Save results if user is logged in
    if (user) {
      saveResults();
    }
  };
  
  // Calculate WPM, accuracy and errors
  const calculateResults = () => {
    const elapsedMinutes = (Date.now() - startTime) / 60000;
    const wordsTyped = typed.trim().split(' ').length;
    const typedWpm = Math.round(wordsTyped / elapsedMinutes);
    
    // Calculate accuracy by comparing characters
    let correctChars = 0;
    let incorrectChars = 0;
    const typedChars = typed.split('');
    const originalChars = text.split('');
    
    typedChars.forEach((char, index) => {
      if (originalChars[index] === char) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    });
    
    const totalChars = typedChars.length;
    const accuracyPercent = Math.round((correctChars / totalChars) * 100) || 0;
    
    // Find error words
    const originalWords = text.split(' ');
    const typedWords = typed.split(' ');
    const errorWordsArray = [];
    
    typedWords.forEach((word, index) => {
      if (originalWords[index] && originalWords[index] !== word) {
        errorWordsArray.push(originalWords[index]);
      }
    });
    
    setWpm(typedWpm);
    setAccuracy(accuracyPercent);
    setErrors(incorrectChars);
    setErrorWords(errorWordsArray);
  };
  
  // Save test results to backend
  const saveResults = async () => {
    try {
      const sessionData = {
        duration: testDuration,
        wpm,
        accuracy,
        totalErrors: errors,
        errorWords,
        typingDurations: charTimes,
        textType,
        rawText: text,
        typedText: typed
      };
      
      await axios.post('/api/sessions', sessionData);
    } catch (error) {
      console.error('Error saving results:', error);
    }
  };
  
  // Handle typing in the input field
  const handleType = (e) => {
    if (!isTestActive) return;
    
    const currentInput = e.target.value;
    setTyped(currentInput);
    
    // Record time for each keystroke
    setCharTimes(prev => [...prev, Date.now() - startTime]);
    
    // If user typed all the text, end the test
    if (currentInput.length >= text.length) {
      endTest();
    }
  };
  
  // Render different character classes based on typing progress
  const renderText = () => {
    const characters = text.split('');
    const typedChars = typed.split('');
    
    return characters.map((char, index) => {
      let className = '';
      
      if (index < typedChars.length) {
        className = typedChars[index] === char ? 'correct' : 'incorrect';
      } else if (index === typedChars.length) {
        className = 'current';
      }
      
      return (
        <span 
          key={index} 
          className={className}
        >
          {char}
        </span>
      );
    });
  };
  
  // Render results after test completion
  const renderResults = () => {
    return (
      <div className="results">
        <h2>Typing Test Results</h2>
        <div className="result-stats">
          <div className="stat">
            <div className="stat-value">{wpm}</div>
            <div className="stat-label">Words Per Minute</div>
          </div>
          <div className="stat">
            <div className="stat-value">{accuracy}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat">
            <div className="stat-value">{errors}</div>
            <div className="stat-label">Errors</div>
          </div>
        </div>
        
        {errorWords.length > 0 && (
          <div className="error-words">
            <h3>Your Error Words</h3>
            <div className="word-list">
              {errorWords.map((word, index) => (
                <span key={index} className="error-word">{word}</span>
              ))}
            </div>
          </div>
        )}
        
        <button onClick={startTest} className="btn">
          Try Again
        </button>
      </div>
    );
  };
  
  return (
    <div className="typing-test">
      <div className="test-controls">
        <div className="duration-selector">
          <button 
            className={testDuration === 15 ? 'selected' : ''}
            onClick={() => setTestDuration(15)}
            disabled={isTestActive}
          >
            15 seconds
          </button>
          <button 
            className={testDuration === 30 ? 'selected' : ''}
            onClick={() => setTestDuration(30)}
            disabled={isTestActive}
          >
            30 seconds
          </button>
        </div>
        
        <div className="text-type-selector">
          <select 
            value={textType} 
            onChange={(e) => setTextType(e.target.value)}
            disabled={isTestActive}
          >
            <option value="words">Words</option>
            <option value="numbers">Numbers</option>
            <option value="punctuation">Punctuation</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>
      
      {timeLeft !== null && !isTestComplete && (
        <div className="timer">
          {timeLeft} seconds remaining
        </div>
      )}
      
      {!isTestActive && !isTestComplete && (
        <button onClick={startTest} className="btn start-btn">
          Start Typing Test
        </button>
      )}
      
      {isTestActive && (
        <>
          <div className="text-display">
            {renderText()}
          </div>
          <input
            ref={inputRef}
            type="text"
            className="typing-input"
            value={typed}
            onChange={handleType}
            placeholder="Type here..."
            autoFocus
          />
        </>
      )}
      
      {isTestComplete && renderResults()}
    </div>
  );
};

export default TypingTest; 