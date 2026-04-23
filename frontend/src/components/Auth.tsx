import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronRight, Activity, Mail, Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../main';

const API_BASE = 'http://localhost:8000';

interface AuthProps {
  onLogin: (token: string, user: any) => void;
}

const Auth = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
  const [email, setEmail] = useState('admin@retain.ai');
  const [password, setPassword] = useState('luxury2026');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(false);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const res = await axios.post(`${API_BASE}/login`, formData);
      
      const { access_token, user } = res.data;
      login(access_token, user);
      navigate('/dashboard');
    } catch (err) {
      console.error("Auth failed:", err);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.03] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gold/[0.03] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel max-w-md w-full p-12 relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 border border-gold/30 rounded-2xl flex items-center justify-center mb-6 bg-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <Activity size={32} className="text-gold" />
          </div>
          <h1 className="text-4xl font-serif text-center mb-2 tracking-tight">Executive Login</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-bold">RetainAI Platform — 2026 Edition</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest font-bold text-gray-500 ml-1">Corporate ID</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-gold/50 transition-all placeholder:text-gray-700"
                placeholder="admin@retain.ai"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest font-bold text-gray-500 ml-1">Access Cipher</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-gold/50 transition-all placeholder:text-gray-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <AnimatePresence>
            {isError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-xs font-bold"
              >
                <AlertCircle size={16} />
                <span>Invalid credentials for private instance.</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-gold py-5 rounded-xl flex items-center justify-center gap-3 mt-4"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                Authenticate Access <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 text-gray-600">
                <Shield size={12} />
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold">Encrypted TLS Phase 3 Connection</span>
            </div>
            <p className="text-[10px] text-gray-700 leading-relaxed">
                Unauthorized access attempts are logged and reported to the system infrastructure team.
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
