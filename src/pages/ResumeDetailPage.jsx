import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  ArrowLeft, FileText, Calendar, Download, Loader2, AlertCircle,
  Target, Sparkles, Briefcase, BarChart2, TrendingUp, TrendingDown,
  CheckCircle, Trophy, RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell
} from 'recharts';

const scoreColor = (s) => s >= 75 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#ef4444';
const scoreBg = (s) => s >= 75 ? 'from-green-500 to-emerald-500' : s >= 50 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500';
const scoreLabel = (s) => s >= 75 ? 'Excellent' : s >= 50 ? 'Good' : 'Needs Work';

export default function ResumeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    axios.get(`/api/resume/history/${id}`)
      .then(r => setResume(r.data.resume))
      .catch(() => setError('Failed to load resume analysis'))
      .finally(() => setLoading(false));
  }, [id]);

  const exportPDF = async () => {
    setExporting(true);
    try {
      const { default: html2pdf } = await import('html2pdf.js');
      html2pdf()
        .set({
          margin: 10,
          filename: `${resume.fileName.replace(/\.[^.]+$/, '')}_analysis.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(printRef.current)
        .save();
    } catch {
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-40">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-3" />
        <p className="text-slate-400 text-sm">Loading analysis...</p>
      </div>
    </div>
  );

  if (error || !resume) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <p className="text-slate-500">{error || 'Resume not found'}</p>
      <button onClick={() => navigate('/history')} className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors">
        Back to History
      </button>
    </div>
  );

  const { analysis } = resume;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/history')}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-500" />
              {resume.fileName}
            </h1>
            <p className="text-slate-400 text-sm flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(resume.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <button onClick={exportPDF} disabled={exporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed shrink-0">
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Export PDF
        </button>
      </div>

      {/* Printable content */}
      <div ref={printRef} className="space-y-6">
        {/* Score Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-r ${scoreBg(analysis.score)} p-6 rounded-3xl shadow-xl text-white`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex flex-col items-center justify-center shadow-inner">
                <span className="text-3xl font-black">{analysis.score}</span>
                <span className="text-xs font-semibold opacity-80">/100</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-5 h-5" />
                  <span className="text-xl font-black">{scoreLabel(analysis.score)} Resume</span>
                </div>
                <p className="opacity-80 text-sm">ATS Compatibility: <strong>{analysis.atsCompatibilityScore}%</strong></p>
                <div className="w-48 bg-white/20 rounded-full h-2 mt-2">
                  <div className="h-2 rounded-full bg-white transition-all" style={{ width: `${analysis.atsCompatibilityScore}%` }} />
                </div>
              </div>
            </div>
            <button onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl font-semibold text-sm transition-colors backdrop-blur">
              <RefreshCw className="w-4 h-4" /> Analyze New
            </button>
          </div>
        </motion.div>

        {/* Strengths & Weaknesses */}
        {(analysis.strengths?.length > 0 || analysis.weaknesses?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                <TrendingUp className="w-5 h-5" /> Strengths
              </h3>
              <ul className="space-y-2.5">
                {analysis.strengths?.map((s, i) => (
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
                {analysis.weaknesses?.map((w, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Job Match */}
        {analysis.jobDescriptionMatch && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-l-4 border-l-blue-500 border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" /> Job Description Match
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-2">Match Score</p>
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-4xl font-black text-blue-600 dark:text-blue-400">{analysis.jobDescriptionMatch.matchPercentage}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                  <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all" style={{ width: `${analysis.jobDescriptionMatch.matchPercentage}%` }} />
                </div>
                {analysis.jobDescriptionMatch.descriptionMatched && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{analysis.jobDescriptionMatch.descriptionMatched}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-3">Missing Keywords to Add</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.jobDescriptionMatch.missingKeywords?.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold">+ {kw}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section Feedback */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Section Feedback</h3>
            <div className="space-y-3">
              {[
                { key: 'experience', label: 'Experience', color: 'blue' },
                { key: 'education', label: 'Education', color: 'purple' },
                { key: 'projects', label: 'Projects', color: 'green' },
                { key: 'generalFormatting', label: 'Formatting', color: 'amber' },
              ].map(({ key, label, color }) => analysis.feedback?.[key] && (
                <div key={key} className={`p-4 rounded-2xl bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-100 dark:border-${color}-800`}>
                  <p className={`text-xs font-black uppercase tracking-wide text-${color}-600 dark:text-${color}-400 mb-1`}>{label}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{analysis.feedback[key]}</p>
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
                <BarChart data={analysis.skillAnalytics?.slice(0, 6)} layout="vertical" margin={{ top: 0, right: 20, left: 5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={85} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(99,102,241,0.06)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    formatter={(v) => [`${v}%`, 'Relevance']}
                  />
                  <Bar dataKey="relevance" radius={[0, 8, 8, 0]}>
                    {analysis.skillAnalytics?.map((_, i) => (
                      <Cell key={i} fill={['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][i % 6]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              {analysis.skills?.map((s, i) => (
                <span key={i} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold">{s}</span>
              ))}
            </div>
          </div>

          {/* Recommended Roles */}
          {analysis.recommendedRoles?.length > 0 && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-500" /> Recommended Roles
              </h3>
              <div className="space-y-2.5">
                {analysis.recommendedRoles.map((role, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-black shrink-0">{i + 1}</div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improved Bullet Points */}
          {analysis.improvedBulletPoints?.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" /> AI-Improved Bullet Points
              </h3>
              <ul className="space-y-3">
                {analysis.improvedBulletPoints.map((bp, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 p-3 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{bp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
