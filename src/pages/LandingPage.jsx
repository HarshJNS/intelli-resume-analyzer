import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, FileSearch, Activity, ShieldCheck, TerminalSquare, Zap, Star, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.7 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold border border-blue-100 dark:border-blue-800">
              <Sparkles className="w-4 h-4" /> Powered by Google Gemini AI
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
              Land Your{' '}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                  Dream Job
                </span>
              </span>
              <br />with AI Power
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
              Get instant ATS score, skill analytics, personalized feedback, and AI-rewritten bullet points. Beat the bots and impress recruiters.
            </p>

            <div className="flex flex-wrap gap-4">
              {user ? (
                <Link to="/dashboard" className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-blue-500/30 transition-all">
                  Go to Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-blue-500/30 transition-all">
                    Start Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 shadow-sm transition-all">
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4 border-t border-slate-200 dark:border-slate-800">
              {[['10k+', 'Resumes Analyzed'], ['98%', 'ATS Accuracy'], ['100%', 'Free to Use']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-3xl font-black text-slate-900 dark:text-white">{val}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Terminal */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.9, delay: 0.2 }}>
            <div className="relative rounded-2xl bg-[#0d1117] border border-slate-700/50 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 bg-[#161b22] border-b border-slate-700/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center gap-2 ml-3 text-xs font-mono text-slate-400">
                  <TerminalSquare className="w-3.5 h-3.5" /> intelliresume_ai.exe
                </div>
              </div>
              <div className="p-6 font-mono text-sm space-y-2">
                <p className="text-slate-500">$ analyze --file resume.pdf --model gemini-1.5-flash</p>
                <p className="text-green-400">✓ Extracting text... <span className="text-slate-400">done</span></p>
                <p className="text-green-400">✓ Running AI analysis... <span className="text-slate-400">done</span></p>
                <p className="text-green-400">✓ Generating insights... <span className="text-slate-400">done</span></p>
                <div className="mt-3 p-4 bg-slate-800/60 rounded-xl border border-slate-700/50 space-y-1.5">
                  <p className="text-blue-400 font-semibold">📊 Analysis Results</p>
                  <p className="text-slate-300">Overall Score: <span className="text-green-400 font-bold">87/100</span></p>
                  <p className="text-slate-300">ATS Score: <span className="text-green-400 font-bold">92%</span></p>
                  <p className="text-slate-300">Top Skill: <span className="text-yellow-300">React.js (95%)</span></p>
                  <p className="text-slate-300">Job Match: <span className="text-blue-400 font-bold">78%</span></p>
                  <p className="text-slate-300">Missing: <span className="text-amber-400">TypeScript, Docker</span></p>
                </div>
                <p className="text-slate-500 flex items-center gap-1">$ <span className="animate-pulse text-green-400">▋</span></p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Everything You Need to Win</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">Powered by Google Gemini AI — the most advanced resume analysis platform</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, color: 'blue', title: 'Instant ATS Score', desc: 'Get a 0-100 ATS compatibility score instantly. Know exactly how recruiters\' systems see your resume.' },
              { icon: Activity, color: 'purple', title: 'Skill Analytics', desc: 'Visual bar charts showing your top skills and their relevance scores. Identify gaps at a glance.' },
              { icon: Star, color: 'amber', title: 'AI Bullet Points', desc: 'Gemini AI rewrites your bullet points using STAR method and powerful action verbs.' },
              { icon: FileSearch, color: 'green', title: 'Job Match Score', desc: 'Paste any job description and get a match percentage with missing keywords to add.' },
              { icon: ShieldCheck, color: 'red', title: 'Strengths & Gaps', desc: 'Detailed analysis of what\'s working and what needs improvement in your resume.' },
              { icon: Users, color: 'indigo', title: 'Role Recommendations', desc: 'AI suggests the best job titles that match your skills and experience level.' },
            ].map(({ icon: Icon, color, title, desc }, i) => (
              <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all group">
                <div className={`w-12 h-12 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">How It Works</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Three steps to a job-winning resume</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 opacity-30" />
            {[
              { icon: FileSearch, step: '01', color: 'blue', title: 'Upload Resume', desc: 'Upload your PDF or DOCX file. We extract text securely without storing your file.' },
              { icon: Activity, step: '02', color: 'purple', title: 'AI Analyzes', desc: 'Google Gemini AI deeply analyzes your resume for ATS compatibility, skills, and structure.', elevated: true },
              { icon: Sparkles, step: '03', color: 'green', title: 'Get Insights', desc: 'Receive your score, skill charts, feedback, and AI-improved bullet points instantly.' },
            ].map(({ icon: Icon, step, color, title, desc, elevated }) => (
              <motion.div key={step} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5 }}
                className={`flex flex-col items-center text-center p-8 bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm ${elevated ? 'md:-translate-y-4 shadow-lg' : ''}`}>
                <div className={`w-16 h-16 rounded-2xl bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center mb-4 shadow-inner`}>
                  <Icon className={`w-8 h-8 text-${color}-600 dark:text-${color}-400`} />
                </div>
                <span className={`text-xs font-black text-${color}-500 tracking-widest uppercase mb-2`}>Step {step}</span>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-24 px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
            <h2 className="text-4xl font-black text-white mb-4 relative">Ready to Get Hired?</h2>
            <p className="text-blue-100 text-xl mb-10 relative">Join thousands of job seekers who improved their resume with IntelliResume</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-colors shadow-xl text-lg relative">
              Start Analyzing Free <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </section>
      )}
    </div>
  );
}
