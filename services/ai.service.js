const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const analyzeResume = async (resumeText, jobDescription = '') => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not set. Please add your key to the .env file.');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are an expert ATS system and senior technical recruiter with 15+ years of experience.
Analyze the following resume thoroughly and provide detailed, actionable feedback.

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription || 'Not provided'}

Respond ONLY with a valid JSON object matching this exact schema (no markdown, no extra text):
{
  "score": <integer 0-100, overall resume quality score>,
  "atsCompatibilityScore": <integer 0-100, how well it passes ATS systems>,
  "skills": [<array of all technical and soft skills found, max 15>],
  "skillAnalytics": [
    { "name": "<skill>", "relevance": <integer 0-100> }
  ],
  "feedback": {
    "experience": "<detailed feedback on work experience section, mention action verbs, quantifiable achievements>",
    "education": "<feedback on education section>",
    "projects": "<feedback on projects section>",
    "generalFormatting": "<feedback on overall formatting, length, structure>"
  },
  "strengths": [<array of 3-4 resume strengths as strings>],
  "weaknesses": [<array of 3-4 areas to improve as strings>],
  "recommendedRoles": [<array of 4-5 job titles that match this resume>],
  "improvedBulletPoints": [<array of 4-5 rewritten bullet points using STAR method and strong action verbs>],
  "jobDescriptionMatch": ${jobDescription ? `{
    "matchPercentage": <integer 0-100>,
    "missingKeywords": [<array of important keywords from JD missing in resume>],
    "descriptionMatched": "<brief summary of what matched>"
  }` : 'null'}
}`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().replace(/```json|```/g, '').trim();
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Invalid AI response format');
  return JSON.parse(match[0]);
};

module.exports = { analyzeResume };
