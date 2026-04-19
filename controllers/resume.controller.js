const Resume = require('../models/Resume');
const { extractText } = require('../services/parser.service');
const { attemptAIAnalysis } = require('../services/ai.service');

const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF or DOCX file' });
    }

    const { jobDescription } = req.body;
    const userId = req.user?.id; // Assuming auth middleware is used

    // 1. Extract text from the uploaded file
    const text = await extractText(req.file.buffer, req.file.mimetype);
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract any text from the document. Please ensure it is text-based.' });
    }

    // 2. Call OpenAI for analysis
    const aiAnalysis = await attemptAIAnalysis(text, jobDescription);

    // 3. Save to Db if user is authenticated (Optional constraint based on whether login is mandatory for analysis)
    let savedResume = null;
    if (userId) {
      const resumeDoc = new Resume({
        userId,
        fileName: req.file.originalname,
        parsedText: text,
        analysisResult: {
          score: aiAnalysis.score,
          skills: aiAnalysis.skills,
          feedback: aiAnalysis.feedback,
          improvedBulletPoints: aiAnalysis.improvedBulletPoints,
          recommendedRoles: aiAnalysis.recommendedRoles,
          atsCompatibilityScore: aiAnalysis.atsCompatibilityScore
        },
        jobDescriptionMatch: aiAnalysis.jobDescriptionMatch
      });
      savedResume = await resumeDoc.save();
    }

    res.status(200).json({
      message: 'Resume analyzed successfully',
      resumeId: savedResume ? savedResume._id : null,
      analysis: aiAnalysis
    });

  } catch (error) {
    console.error('File Upload/Analysis Error:', error);
    res.status(500).json({ error: 'An error occurred during resume processing.', details: error.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ resumes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resume history' });
  }
};

const getAnalysisById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.status(200).json({ resume });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resume details' });
  }
};

module.exports = { uploadAndAnalyze, getHistory, getAnalysisById };
