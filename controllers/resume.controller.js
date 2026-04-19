const Resume = require('../models/Resume');
const { extractText } = require('../services/parser.service');
const { analyzeResume } = require('../services/ai.service');

exports.analyze = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const text = await extractText(req.file.buffer, req.file.mimetype);
    if (!text?.trim()) return res.status(400).json({ error: 'Could not extract text from file' });

    const { jobDescription = '' } = req.body;
    const analysis = await analyzeResume(text, jobDescription);

    const resume = await Resume.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      parsedText: text,
      jobDescription,
      analysis
    });

    res.json({ message: 'Analysis complete', resumeId: resume._id, analysis });
  } catch (err) {
    console.error('Analyze error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id })
      .select('-parsedText')
      .sort({ createdAt: -1 });
    res.json({ resumes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) return res.status(404).json({ error: 'Not found' });
    res.json({ resume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
