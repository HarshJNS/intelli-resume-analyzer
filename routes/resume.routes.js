const express = require('express');
const router = express.Router();
const { uploadAndAnalyze, getHistory, getAnalysisById } = require('../controllers/resume.controller');
const upload = require('../middleware/upload.middleware');
const { requireAuth } = require('../middleware/auth.middleware');

// Public or Protected depending on needs. Making it protected for history tracking.
// Since user could use it without login in a real scenario, we can make `requireAuth` optional via logic,
// but for simplicity let's protect the history endpoint and let upload be semi-public (handled in controller).

router.post('/analyze', upload.single('resume'), uploadAndAnalyze); // 'resume' is the field name
router.get('/history', requireAuth, getHistory);
router.get('/history/:id', requireAuth, getAnalysisById);

module.exports = router;
