const express = require('express');
const router = express.Router();
const { createSession, getUserSessions, getSessionAnalysis } = require('../controllers/sessionController');
const { protect } = require('../middlewares/auth');

// All routes need authentication
router.use(protect);

// Session routes
router.post('/', createSession);
router.get('/:userId', getUserSessions);
router.get('/analysis/:sessionId', getSessionAnalysis);

module.exports = router; 