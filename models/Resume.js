const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number },
  parsedText: { type: String },
  jobDescription: { type: String, default: '' },
  analysis: {
    score: Number,
    atsCompatibilityScore: Number,
    skills: [String],
    skillAnalytics: [{ name: String, relevance: Number }],
    feedback: {
      education: String,
      experience: String,
      projects: String,
      generalFormatting: String
    },
    recommendedRoles: [String],
    improvedBulletPoints: [String],
    jobDescriptionMatch: {
      matchPercentage: Number,
      missingKeywords: [String],
      descriptionMatched: String
    },
    strengths: [String],
    weaknesses: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);
