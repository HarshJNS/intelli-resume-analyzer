import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { User, Mail, Lock, Save, Loader2, CheckCircle, AlertCircle, Eye, EyeOff, Shield, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [nameStatus, setNameStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [passStatus, setPassStatus] = useState(null);
  const [nameMsg, setNameMsg] = useState('');
  const [passMsg, setPassMsg] = useState('');

  const saveName = async (e) => {
    e.preventDefault();
    if (!name.trim() || name === user?.name) return;
    setNameStatus('loading'); setNameMsg('');
    try {
      const r = await axios.put('/api/auth/profile', { name: name.trim() });
      updateUser(r.data.user);
      setNameStatus('success'); setNameMsg('Name updated successfully!');
    } catch (err) {
      setNameStatus('error'); setNameMsg(err.response?.data?.error || 'Failed to update name');
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      setPassStatus('error'); setPassMsg('New passwords do not match'); return;
    }
    if (passwords.newPass.length < 6) {
      setPassStatus('error'); setPassMsg('Password must be at least 6 characters'); return;
    }
    setPassStatus('loading'); setPassMsg('');
    try {
      await axios.put('/api/auth/password', { currentPassword: passwords.current, newPassword: passwords.newPass });
      setPassStatus('success'); setPassMsg('Password changed successfully!');
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      setPassStatus('error'); setPassMsg(err.response?.data?.error || 'Failed to change password');
    }
  };

  const toggle = (k) => setShowPass(p => ({ ...p, [k]: !p[k] }));

  const StatusMsg = ({ status, msg }) => {
    if (!msg) return null;
    return (
      <div className={`flex items-center gap-2 p-3 rounded-xl text-sm mt-3 ${status === 'success'
        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800'
        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800'}`}>
        {status === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
        {msg}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          Profile & Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account information</p>
      </div>

      {/* Account Info Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-black text-slate-800 dark:text-white">{user?.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {user?.email}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs text-green-600 dark:text-green-400 font-semibold">Verified Account</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Update Name */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 mb-6">
        <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" /> Update Name
        </h2>
        <form onSubmit={saveName} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" required value={name} onChange={e => { setName(e.target.value); setNameStatus(null); setNameMsg(''); }}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="email" value={user?.email} disabled
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-900/50 text-slate-400 text-sm cursor-not-allowed" />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">Email cannot be changed</p>
          </div>
          <StatusMsg status={nameStatus} msg={nameMsg} />
          <button type="submit" disabled={nameStatus === 'loading' || !name.trim() || name === user?.name}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all shadow-md">
            {nameStatus === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Name
          </button>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
        <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-500" /> Change Password
        </h2>
        <form onSubmit={savePassword} className="space-y-4">
          {[
            { key: 'current', label: 'Current Password', placeholder: '••••••••' },
            { key: 'newPass', label: 'New Password', placeholder: 'Min. 6 characters' },
            { key: 'confirm', label: 'Confirm New Password', placeholder: 'Repeat new password' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPass[key] ? 'text' : 'password'} required value={passwords[key]}
                  onChange={e => { setPasswords(p => ({ ...p, [key]: e.target.value })); setPassStatus(null); setPassMsg(''); }}
                  placeholder={placeholder}
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all" />
                <button type="button" onClick={() => toggle(key)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          <StatusMsg status={passStatus} msg={passMsg} />
          <button type="submit" disabled={passStatus === 'loading'}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all shadow-md">
            {passStatus === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            Change Password
          </button>
        </form>
      </motion.div>
    </div>
  );
}
