import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { UploadCloud, CheckCircle, FileText, Loader2, AlertCircle, Target, Sparkles, Briefcase, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }

    try {
      const res = await axios.post('/api/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(res.data.analysis);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setResult(null);
    setJobDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

      {error && (
        <div className="flex items-center gap-2 p-4 mb-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {!result ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
              >
                <input {...getInputProps()} />
                <UploadCloud className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                {file ? (
                  <p className="text-blue-600 font-medium">{file.name}</p>
                ) : (
                  <div className="text-slate-500 dark:text-slate-400">
                    <p className="font-medium text-slate-700 dark:text-slate-300">Drag & drop your resume here</p>
                    <p className="text-sm mt-1">Supports PDF, DOCX</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-semibold mb-4">Job Description (Optional)</h2>
              <textarea
                className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Paste the job requirements to get matching score..."
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!file || analyzing}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white text-lg font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2"
            >
              {analyzing ? <><Loader2 className="w-6 h-6 animate-spin" /> Analyzing...</> : 'Analyze Resume Now'}
            </button>
          </div>

          <div className="hidden md:flex flex-col justify-center items-center p-12 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
            <FileText className="w-32 h-32 text-slate-200 dark:text-slate-700 mb-6" />
            <h3 className="text-2xl font-bold text-slate-400 dark:text-slate-500 text-center">Your personalized insights will appear here</h3>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-500 to-purple-500 text-white shadow-inner">
                <span className="text-2xl font-black">{result.score}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Overall Score</h2>
                <p className="text-slate-500">ATS Compatibility: {result.atsCompatibilityScore}%</p>
              </div>
            </div>
            <button onClick={resetState} className="px-6 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors text-sm">
              Analyze Another
            </button>
          </div>

          {result.jobDescriptionMatch && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-l-4 border-l-blue-500">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Target className="text-blue-500" /> Job Match Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-500 mb-1">Match Percentage</p>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-4">
                    <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${result.jobDescriptionMatch.matchPercentage}%` }}></div>
                  </div>
                  <span className="font-semibold text-lg">{result.jobDescriptionMatch.matchPercentage}%</span>
                </div>
                <div>
                  <p className="text-slate-500 mb-2">Missing Keywords to Add</p>
                  <div className="flex flex-wrap gap-2">
                    {result.jobDescriptionMatch.missingKeywords?.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium">+{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold mb-4">Section Feedback</h3>
                <div className="space-y-4">
                  <FeedbackItem title="Experience" content={result.feedback?.experience} />
                  <FeedbackItem title="Education" content={result.feedback?.education} />
                  <FeedbackItem title="Projects" content={result.feedback?.projects} />
                  <FeedbackItem title="Formatting" content={result.feedback?.generalFormatting} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BarChart2 className="text-blue-500 w-5 h-5" /> Skills Analysis</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.skillAnalytics?.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{ fill: '#64748b', fontSize: 13 }} />
                      <Tooltip
                        cursor={{ fill: 'rgba(51, 65, 85, 0.1)' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="relevance" radius={[0, 6, 6, 0]}>
                        {result.skillAnalytics?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#8b5cf6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {result.recommendedRoles && result.recommendedRoles.length > 0 && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Briefcase className="text-purple-500 w-5 h-5" /> Preferred Job Roles</h3>
                  <div className="flex flex-col gap-2">
                    {result.recommendedRoles.map((role, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-800/80">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Sparkles className="text-blue-500 w-5 h-5" /> Suggested Bullet Points</h3>
                <ul className="space-y-3">
                  {result.improvedBulletPoints?.map((bp, i) => (
                    <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeedbackItem({ title, content }) {
  if (!content) return null;
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
      <h4 className="font-semibold text-slate-900 dark:text-white capitalize mb-1">{title}</h4>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{content}</p>
    </div>
  );
}
