import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Film, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (email: string, pass: string, role?: UserRole) => void;
  onRegister: (name: string, email: string, phone?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLogin,
  onRegister,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (!name || !email) return;
      onRegister(name, email, phone);
    } else {
      if (!email) return;
      onLogin(email, password);
    }
    onClose();
  };

  const handleDemoLogin = (role: UserRole) => {
    if (role === 'admin') {
      onLogin('admin@imovies.com', 'admin123', 'admin');
    } else {
      onLogin('alex@example.com', 'user123', 'user');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-red-500/20">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            {isSignUp ? 'Create your IMovies Account' : 'Welcome to IMovies Premiere'}
          </h3>
          <p className="text-xs text-slate-400">
            {isSignUp ? 'Reserve seats, earn CinePoints, and get fast checkout.' : 'Sign in to access your digital tickets and reservations.'}
          </p>
        </div>

        {/* 1-Click Demo Logins */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 text-center">
            One-Click Demo Authentication (RBAC Testing)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('user')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-left transition-colors"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <User className="w-3.5 h-3.5 text-red-500" />
                <span>Patron User</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">Alex Johnson</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition-colors"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Cinema Admin</span>
              </div>
              <p className="text-[10px] text-amber-400/80 mt-0.5 truncate">Manager Access</p>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-800" />
          <span className="absolute bg-slate-900 px-3 text-[11px] text-slate-500 uppercase font-mono">
            Or with credentials
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {isSignUp && (
            <div>
              <label className="block text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-slate-400 mb-1">Mobile Phone (Optional)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5 transition-all mt-4 cursor-pointer"
          >
            <span>{isSignUp ? 'Create IMovies Account' : 'Sign In to IMovies'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            {isSignUp ? 'Already registered? Sign In' : "Don't have an account? Sign Up free"}
          </button>
        </div>

      </div>
    </div>
  );
};
