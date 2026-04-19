import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  UploadCloud, FileText, Loader2, AlertCircle, Target, Sparkles,
  Briefcase, BarChart2, RefreshCw, CheckCircle, TrendingUp, TrendingDown, Trophy
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { useAuth } from '../context/AuthContext';

const scoreColor = (s) => s >= 75 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#ef4444';
const scoreBg = (s) => s >= 75 ? 'from-green-500 to-emerald-500' : s >= 50 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500';
const scoreLabel = (s) => s >= 75 ? 'Excellent' : s >= 50 ? 'Good' : 'Needs Work';

export default function Dashboard() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback(files => {
    if (files[0]) { setFile(files[0]); setError(''); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1
  });

  const analyze = async () => {
    if (!file) return;
    setLoading(true); setError('');
    const fd = new FormData();
    fd.append('resume', file);
    if (jd) fd.append('jobDescription', jd);
    try {
      const res = await axios.post('/api/resume/analyze', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(res.data.analysis);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Make sure your Gemini API key is set in .env');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); setJd(''); setError(''); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Hey, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Upload your resume and get AI-powered insights in seconds</p>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              {/* Dropzone */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-blue-500" /> Upload Resume
                </h2>
                <div {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
                    ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.01]'
                      : 'border-slate-200 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}>
                  <input {...getInputProps()} />
                  <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all
                    ${isDragActive ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    {file
                      ? <FileText className="w-8 h-8 text-blue-500" />
                      : <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-blue-500' : 'text-slate-400'}`} />
                    }
                  </div>
                  {file ? (
                    <div>
                      <p className="font-bold text-blue-600 dark:text-blue-400">{file.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB • Ready to analyze</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-slate-700 dark:text-slate-300 text-lg">Drop your resume here</p>
                      <p className="text-slate-400 text-sm mt-1">or click to browse — PDF, DOCX (max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" /> Job Description
                  <span className="text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">Optional</span>
                </h2>
                <p className="text-xs text-slate-400 mb-4">Paste to get match score and missing keywords</p>
                <textarea
                  className="w-full h-36 p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm transition-all"
                  placeholder="We are looking for a React developer with 3+ years experience..."
                  value={jd} onChange={e => setJd(e.target.value)}
                />
              </div>

              <button onClick={analyze} disabled={!file || loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-3 text-base">
                {loading
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing with Gemini AI...</>
                  : <><Sparkles className="w-5 h-5" /> Analyze My Resume</>
                }
              </button>
            </div>

            {/* Tips panel */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" /> What You'll Get
                </h3>
                <ul className="space-y-3">
                  {[
                    'Overall resume score (0-100)',
                    'ATS compatibility percentage',
                    'Skills chart with relevance scores',
                    'Section-by-section feedback',
                    'AI-rewritten bullet points',
                    'Recommended job roles',
                    'Job description match score',
                    'Strengths & improvement areas',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-2xl border border-amber-100 dark:border-amber-800">
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-2">⚡ Pro Tip</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">Add a job description to get a tailored match score and see exactly which keywords you're missing.</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="space-y-6">
            {/* Score Banner */}
            <div className={`bg-gradient-to-r ${scoreBg(result.score)} p-6 rounded-3xl shadow-xl text-white`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex flex-col items-center justify-center shadow-inner">
                    <span className="text-3xl font-black">{result.score}</span>
                    <span className="text-xs font-semibold opacity-80">/100</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-5 h-5" />
                      <span className="text-xl font-black">{scoreLabel(result.score)} Resume</span>
                    </div>
                    <p className="opacity-80 text-sm">ATS Compatibility: <strong>{result.atsCompatibilityScore}%</strong></p>
                    <div className="w-48 bg-white/20 rounded-full h-2 mt-2">
                      <div className="h-2 rounded-full bg-white transition-all" style={{ width: `${result.atsCompatibilityScore}%` }} />
                    </div>
                  </div>
                </div>
                <button onClick={reset}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl font-semibold text-sm transition-colors backdrop-blur">
                  <RefreshCw className="w-4 h-4" /> Analyze Another
                </button>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            {(result.strengths?.length > 0 || result.weaknesses?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                    <TrendingUp className="w-5 h-5" /> Strengths
                  </h3>
                  <ul className="space-y-2.5">
                    {result.strengths?.map((s, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <TrendingDown className="w-5 h-5" /> Areas to Improve
                  </h3>
                  <ul className="space-y-2.5">
                    {result.weaknesses?.map((w, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Job Match */}
            {result.jobDescriptionMatch && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-l-4 border-l-blue-500 border border-slate-100 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" /> Job Description Match
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Match Score</p>
                    <div className="flex items-end gap-3 mb-2">
                      <span className="text-4xl font-black text-blue-600 dark:text-blue-400">{result.jobDescriptionMatch.matchPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                      <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all" style={{ width: `${result.jobDescriptionMatch.matchPercentage}%` }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-3">Missing Keywords to Add</p>
                    <div className="flex flex-wrap gap-2">
                      {result.jobDescriptionMatch.missingKeywords?.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold">+ {kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Feedback */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Section Feedback</h3>
                <div className="space-y-3">
                  {[
                    { key: 'experience', label: 'Experience', color: 'blue' },
                    { key: 'education', label: 'Education', color: 'purple' },
                    { key: 'projects', label: 'Projects', color: 'green' },
                    { key: 'generalFormatting', label: 'Formatting', color: 'amber' },
                  ].map(({ key, label, color }) => result.feedback?.[key] && (
                    <div key={key} className={`p-4 rounded-2xl bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-100 dark:border-${color}-800`}>
                      <p className={`text-xs font-black uppercase tracking-wide text-${color}-600 dark:text-${color}-400 mb-1`}>{label}</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{result.feedback[key]}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Chart */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-blue-500" /> Skills Analysis
                </h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.skillAnalytics?.slice(0, 6)} layout="vertical" margin={{ top: 0, right: 20, left: 5, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={85} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip
                        cursor={{ fill: 'rgba(99,102,241,0.06)' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
                        formatter={(v) => [`${v}%`, 'Relevance']}
                      />
                      <Bar dataKey="relevance" radius={[0, 8, 8, 0]}>
                        {result.skillAnalytics?.map((_, i) => (
                          <Cell key={i} fill={['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][i % 6]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  {result.skills?.slice(0, 12).map((s, i) => (
                    <span key={i} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold">{s}</span>
                  ))}
                </div>
              </div>

              {/* Recommended Roles */}
              {result.recommendedRoles?.length > 0 && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-500" /> Recommended Roles
                  </h3>
                  <div className="space-y-2.5">
                    {result.recommendedRoles.map((role, i) => (
                      <div key={i} className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-black shrink-0">{i + 1}</div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improved Bullet Points */}
              {result.improvedBulletPoints?.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" /> AI-Improved Bullet Points
                  </h3>
                  <ul className="space-y-3">
                    {result.improvedBulletPoints.map((bp, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 p-3 rounded-xl">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
