import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  X, 
  Building2, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { CyberAvatar } from './CyberAvatar';
import { sounds } from '../utils/soundEngine';
import { api } from '../services/api';
import { connectSocket } from '../services/socket';

const AVATAR_OPTIONS = [
  { id: 'neon_ronin', name: 'Neon Ronin', role: 'Speed Assassin' },
  { id: 'quantum_hacker', name: 'Quantum Hacker', role: 'Optimization' },
  { id: 'byte_reaper', name: 'Byte Reaper', role: 'Brute Force' },
  { id: 'mech_overlord', name: 'Mech Overlord', role: 'Apex Titan' },
  { id: 'glitch_valkyrie', name: 'Glitch Valkyrie', role: 'Two-Pointer' },
  { id: 'core_sentinel', name: 'Core Sentinel', role: 'Shield Master' }
];

export const AuthModal = ({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  
  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('neon_ronin');
  const [targetCompany, setTargetCompany] = useState('Google');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleTabSwitch = (newMode) => {
    sounds.playSelect();
    setMode(newMode);
    setError('');
  };

  const handleAvatarSelect = (avatarId) => {
    sounds.playSelect();
    setSelectedAvatar(avatarId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    sounds.playClick();
    setIsSubmitting(true);
    setError('');

    try {
      let result;
      if (mode === 'signup') {
        result = await api.signup({
          username: username.trim() || `Gladiator_${Math.floor(Math.random() * 1000)}`,
          email: email.trim(),
          password,
          archetype: selectedAvatar,
          targetCompany
        });
      } else {
        result = await api.login(username.trim() || email.trim(), password);
      }

      setIsSubmitting(false);
      sounds.playTestCasePass(1);
      if (result.user) {
        connectSocket();
        onAuthSuccess(result.user);
        onClose();
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Authentication failed');
    }
  };

  const handleQuickDemoLogin = async () => {
    sounds.playSelect();
    setIsSubmitting(true);
    setError('');

    try {
      let result;
      try {
        result = await api.login('Neon_Ronin', 'nodewars123');
      } catch {
        // Fallback demo signup if user does not exist
        result = await api.signup({
          username: 'Neon_Ronin',
          email: 'neon@nodewars.dev',
          password: 'nodewars123',
          archetype: 'neon_ronin',
          targetCompany: 'Google'
        });
      }

      setIsSubmitting(false);
      sounds.playTestCasePass(2);
      if (result.user) {
        connectSocket();
        onAuthSuccess(result.user);
        onClose();
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Demo login failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 font-mono">
      <div className="bg-arena-panel border-2 border-player/50 rounded-2xl max-w-lg w-full p-6 sm:p-8 relative glow-player shadow-2xl overflow-hidden">
        
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 ambient-glow-cyan pointer-events-none -z-10 blur-3xl opacity-40"></div>

        {/* Top Header & Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-arena-border">
          <div className="flex items-center gap-2">
            <img src="/nodewars-logo.png" alt="NodeWars Logo" className="w-5 h-5 object-contain animate-pulse" />
            <span className="font-extrabold text-base tracking-wider text-white">
              NODE<span className="text-player">WARS</span> // ARENA ACCESS
            </span>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="text-arena-muted hover:text-white p-1 rounded hover:bg-arena-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Login vs Sign Up */}
        <div className="grid grid-cols-2 gap-2 my-4 p-1 rounded-xl bg-arena-card border border-arena-border">
          <button
            onClick={() => handleTabSwitch('login')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-player text-arena-bg shadow-md shadow-player/30 font-extrabold'
                : 'text-arena-muted hover:text-white'
            }`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => handleTabSwitch('signup')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-player text-arena-bg shadow-md shadow-player/30 font-extrabold'
                : 'text-arena-muted hover:text-white'
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Sign Up: Avatar Selection Grid */}
          {mode === 'signup' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold">CHOOSE YOUR CYBER AVATAR:</span>
                <span className="text-player text-[10px] uppercase">
                  {AVATAR_OPTIONS.find(a => a.id === selectedAvatar)?.name}
                </span>
              </div>

              <div className="grid grid-cols-6 gap-2 p-2 rounded-xl bg-arena-card border border-arena-border">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => handleAvatarSelect(av.id)}
                    className={`p-1 rounded-lg flex flex-col items-center transition-all ${
                      selectedAvatar === av.id
                        ? 'border-2 border-player glow-player bg-player/20 scale-105'
                        : 'border border-transparent hover:border-slate-600 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <CyberAvatar archetype={av.id} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Username (on signup) */}
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] text-arena-muted font-bold uppercase">Gladiator Handle</label>
              <div className="relative">
                <User className="w-4 h-4 text-arena-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. AlgoValkyrie_99"
                  className="w-full bg-arena-card pl-9 pr-3 py-2 rounded-lg border border-arena-border text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-player focus:ring-1 focus:ring-player"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[11px] text-arena-muted font-bold uppercase">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-arena-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@nodewars.arena"
                className="w-full bg-arena-card pl-9 pr-3 py-2 rounded-lg border border-arena-border text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-player focus:ring-1 focus:ring-player"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-arena-muted font-bold uppercase">Passcode</label>
              {mode === 'login' && (
                <button 
                  type="button" 
                  onClick={() => alert("Password reset link simulated.")}
                  className="text-[10px] text-player hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-arena-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-arena-card pl-9 pr-3 py-2 rounded-lg border border-arena-border text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-player focus:ring-1 focus:ring-player"
              />
            </div>
          </div>

          {/* Sign Up: Target Company */}
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] text-arena-muted font-bold uppercase">Target Interview Track</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-arena-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full bg-arena-card pl-9 pr-3 py-2 rounded-lg border border-arena-border text-xs text-white focus:outline-none focus:border-player cursor-pointer"
                >
                  <option value="Google">Google (Titan Tier)</option>
                  <option value="Amazon">Amazon (Apex Logistics)</option>
                  <option value="Microsoft">Microsoft (OS Core)</option>
                  <option value="TCS">TCS (Enterprise Speed)</option>
                  <option value="Infosys">Infosys (Digital Special)</option>
                </select>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 rounded-xl bg-player hover:bg-player-light text-arena-bg font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 glow-player transition-all hover:scale-[1.02] shadow-lg shadow-player/30 cursor-pointer"
          >
            <span>{isSubmitting ? 'CONNECTING TO ARENA...' : mode === 'login' ? 'ENTER THE ARENA' : 'CREATE GLADIATOR PROFILE'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo 1-Click Login Option */}
        <div className="mt-4 pt-3 border-t border-arena-border/60 text-center space-y-2">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 rounded-lg bg-arena-card hover:bg-arena-cardHover border border-player/40 hover:border-player text-player text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <img src="/nodewars-logo.png" alt="NodeWars Logo" className="w-4 h-4 object-contain" />
            <span>1-CLICK INSTANT DEMO LOGIN</span>
          </button>

          <p className="text-[10px] text-slate-500">
            NodeWars Protocol • Encrypted Player Session
          </p>
        </div>

      </div>
    </div>
  );
};
