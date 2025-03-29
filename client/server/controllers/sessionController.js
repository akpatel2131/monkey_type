const TypingSession = require('../models/TypingSession');

// @desc    Create a new typing session
// @route   POST /api/sessions
// @access  Private
exports.createSession = async (req, res) => {
  try {
    // Add user to request body
    req.body.userId = req.user.id;
    
    const session = await TypingSession.create(req.body);
    
    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all sessions for a user
// @route   GET /api/sessions/:userId
// @access  Private
exports.getUserSessions = async (req, res) => {
  try {
    // Make sure user is only getting their own sessions
    if (req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access these sessions'
      });
    }
    
    const sessions = await TypingSession.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get session analysis
// @route   GET /api/analysis/:sessionId
// @access  Private
exports.getSessionAnalysis = async (req, res) => {
  try {
    const session = await TypingSession.findById(req.params.sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }
    
    // Check if user owns the session
    if (session.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this session'
      });
    }
    
    // Analyze error patterns
    const errorPatterns = analyzeErrorPatterns(session);
    
    // Get psychological insights
    const psychInsights = session.getPsychologicalInsights();
    
    res.status(200).json({
      success: true,
      data: {
        session,
        analysis: {
          errorPatterns,
          psychologicalInsights: psychInsights
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Helper function to analyze error patterns
const analyzeErrorPatterns = (session) => {
  // This would be a more complex implementation in a real app
  // Here's a simplified version
  
  // Compare original text with typed text to find error patterns
  const original = session.rawText.split(' ');
  const typed = session.typedText.split(' ');
  
  const errors = {};
  
  // Count errors by word
  for (let i = 0; i < Math.min(original.length, typed.length); i++) {
    if (original[i] !== typed[i]) {
      errors[original[i]] = (errors[original[i]] || 0) + 1;
    }
  }
  
  // Get common error words
  const commonErrorWords = Object.entries(errors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));
  
  // Analyze typing speed variations
  let speedTrend = 'consistent';
  if (session.typingDurations.length > 0) {
    const avgDuration = session.typingDurations.reduce((a, b) => a + b, 0) / session.typingDurations.length;
    const variations = session.typingDurations.map(d => Math.abs(d - avgDuration));
    const variabilityScore = variations.reduce((a, b) => a + b, 0) / variations.length;
    
    speedTrend = variabilityScore > 100 ? 'highly variable' : 'consistent';
  }
  
  return {
    commonErrorWords,
    speedTrend,
    totalErrors: session.totalErrors,
    accuracy: session.accuracy
  };
}; 