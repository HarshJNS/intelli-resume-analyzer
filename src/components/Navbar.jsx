import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Files, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const darkModeActive = document.documentElement.classList.toggle('dark');
    setIsDark(darkModeActive);
  };

  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Files className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-xl tracking-tight">IntelliResume</span>
          </Link>
          <div className="flex items-center space-x-4">
                 <Link to="/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">Dashboard</Link>
            <button 
              onClick={toggleTheme}
              className="relative w-14 h-7 flex items-center bg-slate-200 dark:bg-slate-700 rounded-full p-1 cursor-pointer transition-colors border border-slate-300 dark:border-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label="Toggle Dark Mode"
            >
               <div className="flex w-full justify-between px-1 pointer-events-none">
                 <Moon className="w-3.5 h-3.5 text-slate-400 opacity-50" />
                 <Sun className="w-3.5 h-3.5 text-slate-400 opacity-50" />
               </div>
               <div 
                 className={`absolute left-1 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform duration-300 ${isDark ? 'translate-x-7' : 'translate-x-0'}`}
               >
                 {isDark ? <Moon className="w-3 h-3 text-slate-800"/> : <Sun className="w-3 h-3 text-amber-500"/>}
               </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
