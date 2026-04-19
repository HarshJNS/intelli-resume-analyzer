const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  parsedText: { type: String },
  analysisResult: {
    score: { type: Number },
    skills: [String],
    feedback: {
      education: String,
      experience: String,
      projects: String,
      generalFormatting: String
    },
    recommendedRoles: [String],
    improvedBulletPoints: [String],
    atsCompatibilityScore: { type: Number }
  },
  jobDescriptionMatch: {
    descriptionMatched: { type: String },
    matchPercentage: { type: Number },
    missingKeywords: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);
