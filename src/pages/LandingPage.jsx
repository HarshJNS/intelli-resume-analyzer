import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bot, Target, Sparkles, ArrowRight, ShieldCheck, TerminalSquare, Activity, FileSearch } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center pt-10 px-4 w-full overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-500/20 round-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-500/20 round-full blur-[100px] -z-10 pointer-events-none"></div>

      {/* HERO SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-10 mb-24"
      >
        <div className="text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium text-sm border border-blue-100 dark:border-blue-800">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Next-Gen AI Models</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Crack the Code to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Your Dream Job.
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-xl">
            Bypass the ATS, extract powerful analytics from your resume, and get actionable metrics instantly. Upload your PDF and let our intelligent engine do the heavily lifting.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/dashboard" className="group px-8 py-4 rounded-xl text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2">
              Start Analyzing Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="flex items-center gap-8 pt-4 border-t border-slate-200 dark:border-slate-800">
             <div>
                <p className="text-3xl font-black">10k+</p>
                <p className="text-sm text-slate-500">Resumes Processed</p>
             </div>
             <div>
                <p className="text-3xl font-black">98%</p>
                <p className="text-sm text-slate-500">ATS Accuracy</p>
             </div>
          </div>
        </div>

        {/* MOCK TERMINAL VISUAL */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full rounded-2xl bg-[#0d1117] border border-slate-800 shadow-2xl overflow-hidden"
        >
           <div className="flex items-center px-4 py-3 bg-[#161b22] border-b border-slate-800">
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <p className="ml-4 text-xs font-mono text-slate-400 flex items-center gap-2"><TerminalSquare className="w-3 h-3"/> parse_engine.exe</p>
           </div>
           <div className="p-6 font-mono text-sm space-y-2 text-green-400 max-h-[400px] overflow-hidden">
              <p className="text-slate-500">$ initialize_engine --target "resume.pdf"</p>
              <p className="animate-pulse">Loading neural weights... OK</p>
              <p>Extracting raw text via OCR... DONE</p>
              <p>Parsing experience semantics... DONE</p>
              <p className="text-blue-400">{'['}</p>
              <p className="pl-4 text-blue-400">"Targeting Keyword": <span className="text-yellow-300">"React.js"</span>,</p>
              <p className="pl-4 text-blue-400">"Match Density": <span className="text-yellow-300">92.5%</span>,</p>
              <p className="pl-4 text-blue-400">"ATS Passed": <span className="text-green-400">true</span></p>
              <p className="text-blue-400">{']'}</p>
              <p className="text-slate-500">$ generating_dashboard...</p>
           </div>
        </motion.div>
      </motion.div>

      {/* HOW IT WORKS PIPELINE */}
      <div className="w-full max-w-7xl mt-12 mb-32">
        <h2 className="text-3xl font-bold text-center mb-16">How Our AI Engine Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
           {/* Connecting Line (Desktop only) */}
           <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 -z-10 transform -translate-y-1/2 opacity-30"></div>
           
           <div className="flex flex-col items-center text-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-6 shadow-inner">
                 <FileSearch className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Upload & Parse</h3>
              <p className="text-slate-600 dark:text-slate-400">Securely upload your PDF or DOCX. We extract raw semantic data without storing your files permanently.</p>
           </div>
           
           <div className="flex flex-col items-center text-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative transform md:-translate-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-6 shadow-inner border border-purple-200 dark:border-purple-700/50">
                 <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. NLP Engine Analysis</h3>
              <p className="text-slate-600 dark:text-slate-400">Advanced Large Language Models compute keyword density, action verbs, and structural integrity.</p>
           </div>

           <div className="flex flex-col items-center text-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mb-6 shadow-inner">
                 <ShieldCheck className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Score & Optimize</h3>
              <p className="text-slate-600 dark:text-slate-400">Receive an instant dashboard with 100-point scales, extracted skills, and line-by-line rewrite suggestions.</p>
           </div>
        </div>
      </div>

    </div>
  );
}
