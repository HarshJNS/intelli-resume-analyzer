const router = require('express').Router();
const { analyze, getHistory, getById, deleteResume } = require('../controllers/resume.controller');
const upload = require('../middleware/upload.middleware');
const { requireAuth } = require('../middleware/auth.middleware');

router.post('/analyze', requireAuth, upload.single('resume'), analyze);
router.get('/history', requireAuth, getHistory);
router.get('/history/:id', requireAuth, getById);
router.delete('/history/:id', requireAuth, deleteResume);

module.exports = router;
