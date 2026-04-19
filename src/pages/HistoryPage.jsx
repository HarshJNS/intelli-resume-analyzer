import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { History, FileText, Trash2, Loader2, AlertCircle, Calendar, ArrowRight, BarChart2, Eye } from 'lucide-react';

const scoreColor = (s) => s >= 75 ? 'text-green-500' : s >= 50 ? 'text-amber-500' : 'text-red-500';
const scoreBg = (s) => s >= 75 ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800' : s >= 50 ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800';

export default function HistoryPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/resume/history')
      .then(r => setResumes(r.data.resumes))
      .catch(() => setError('Failed to load history'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await axios.delete(`/api/resume/history/${id}`);
      setResumes(p => p.filter(r => r._id !== id));
    } catch {
      setError('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center">
            <History className="w-5 h-5 text-white" />
          </div>
          Analysis History
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">All your past resume analyses — {resumes.length} total</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm border border-red-100 dark:border-red-800">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Loading your history...</p>
          </div>
        </div>
      ) : resumes.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-400 dark:text-slate-500">No analyses yet</h3>
          <p className="text-slate-400 dark:text-slate-600 text-sm mt-2 mb-8">Upload your first resume to get started</p>
          <button onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg">
            Analyze Resume <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {resumes.map((resume, i) => (
            <motion.div key={resume._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm p-5 hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl border flex flex-col items-center justify-center shrink-0 ${scoreBg(resume.analysis?.score)}`}>
                    <span className={`text-2xl font-black ${scoreColor(resume.analysis?.score)}`}>{resume.analysis?.score ?? '—'}</span>
                    <span className="text-xs text-slate-400">/100</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-slate-400" /> {resume.fileName}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(resume.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {resume.analysis?.skills?.slice(0, 5).map((s, j) => (
                        <span key={j} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-xs font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center hidden sm:block">
                    <p className="text-xs text-slate-400 flex items-center gap-1"><BarChart2 className="w-3 h-3" /> ATS</p>
                    <p className="font-black text-slate-700 dark:text-slate-300">{resume.analysis?.atsCompatibilityScore ?? '—'}%</p>
                  </div>
                  {resume.analysis?.jobDescriptionMatch && (
                    <div className="text-center hidden sm:block">
                      <p className="text-xs text-slate-400">Job Match</p>
                      <p className="font-black text-blue-600 dark:text-blue-400">{resume.analysis.jobDescriptionMatch.matchPercentage}%</p>
                    </div>
                  )}
                  <button onClick={() => navigate(`/history/${resume._id}`)}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(resume._id)} disabled={deleting === resume._id}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50">
                    {deleting === resume._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
