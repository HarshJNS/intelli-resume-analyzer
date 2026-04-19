const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

const attemptAIAnalysis = async (resumeText, jobDescription = '') => {
  // Demo Mode deactivated. Running true Generative AI architecture.
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API Key is missing. Please add GEMINI_API_KEY to your .env file.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // Real Gemini call logic
  const prompt = `
    Act as an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
    Analyze the following resume text.
    If a job description is provided, match the resume against the job description.
    
    Resume Text:
    ${resumeText}
    
    Job Description:
    ${jobDescription || 'None provided'}
    
    Respond STRICTLY in JSON format matching this schema:
    {
      "score": <number 0-100 overall score>,
      "skills": [<array of extracted skills>],
      "skillAnalytics": [
         { "name": "<skill name>", "relevance": <number 0-100 score of how relevant it is> }
      ],
      "feedback": {
        "education": "<feedback string>",
        "experience": "<feedback string highlighting action verbs>",
        "projects": "<feedback string>",
        "generalFormatting": "<feedback string>"
      },
      "recommendedRoles": [<array of 3-5 strings representing preferred job titles based on their skills>],
      "improvedBulletPoints": [<array of 3-5 improved bullet point strings based on their experience>],
      "atsCompatibilityScore": <number 0-100>,
      "jobDescriptionMatch": ${jobDescription ? `{
        "descriptionMatched": "<string snippet of JD>",
        "matchPercentage": <number 0-100>,
        "missingKeywords": [<array of strings>]
      }` : 'null'}
    }
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    let content = result.response.text();
    
    // Strip markdown formatting if AI wrapped it in ```json 
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const aiResult = JSON.parse(content);
    return aiResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error.message || error);
    throw new Error("Failed to analyze resume with Free AI.");
  }
};

module.exports = { attemptAIAnalysis };
