import React, { useState } from 'react';
import {
  ChevronRight,
  Lock,
  Mail,
  User,
} from 'lucide-react';
import { CyberAvatar } from '../components/CyberAvatar';
import { sounds } from '../utils/soundEngine';
import { api } from '../services/api';
import { connectSocket } from '../services/socket';
import animatedLogo from '../assets/NODEWARS_logo_animated.gif';

const AVATAR_OPTIONS = [
  { id: 'neon_ronin', name: 'Neon Ronin', role: 'Speed Assassin' },
  { id: 'quantum_hacker', name: 'Quantum Hacker', role: 'Optimization' },
  { id: 'byte_reaper', name: 'Byte Reaper', role: 'Brute Force' },
  { id: 'mech_overlord', name: 'Mech Overlord', role: 'Apex Titan' },
  { id: 'glitch_valkyrie', name: 'Glitch Valkyrie', role: 'Two-Pointer' },
  { id: 'core_sentinel', name: 'Core Sentinel', role: 'Shield Master' },
];

export const LoginScreen = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('neon_ronin');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleTabSwitch = (newMode) => {
    sounds.playSelect();
    setMode(newMode);
    setError('');
  };

  const handleAvatarSelect = (avatarId) => {
    sounds.playSelect();
    setSelectedAvatar(avatarId);
  };

  const finishLogin = (user) => {
    setIsExiting(true);
    setTimeout(() => {
      onLoginSuccess(user);
    }, 400);
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
        });
      } else {
        result = await api.login(username.trim() || email.trim(), password);
      }

      setIsSubmitting(false);
      sounds.playTestCasePass(1);
      if (result && result.user) {
        connectSocket();
        finishLogin(result.user);
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Authentication failed. Please check your credentials.');
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
        result = await api.signup({
          username: 'Neon_Ronin',
          email: 'neon@nodewars.dev',
          password: 'nodewars123',
          archetype: 'neon_ronin',
        });
      }

      setIsSubmitting(false);
      sounds.playTestCasePass(2);
      if (result && result.user) {
        connectSocket();
        finishLogin(result.user);
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Demo login failed.');
    }
  };

  return (
    <div
      className={`relative flex min-h-screen w-full flex-col items-stretch justify-center overflow-hidden bg-arena-bg font-mono text-arena-text transition-all duration-500 md:flex-row ${
        isExiting ? 'scale-95 opacity-0' : 'login-fade-in'
      }`}
      style={{
        backgroundImage: "linear-gradient(135deg, rgba(4, 8, 16, 0.82), rgba(8, 11, 17, 0.94)), url('/nodewars-cyber-bg.svg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(249,115,22,0.13),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex min-h-[35vh] w-full items-center justify-center overflow-hidden border-b border-white/10 bg-slate-950/25 md:min-h-screen md:w-1/2 md:border-b-0 md:border-r">
        <img
          src={animatedLogo}
          alt="NodeWars Logo"
          className="absolute inset-0 h-full w-full object-cover object-center drop-shadow-[0_0_32px_rgba(34,211,238,0.5)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-cyan-950/10" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <p className="absolute bottom-6 left-0 right-0 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-slate-200/90">
          Enter the arena
        </p>
      </div>

      <div className="relative z-10 flex w-full flex-1 items-center justify-center px-4 py-8 sm:px-6 md:min-h-screen md:w-1/2 md:px-10 lg:px-16">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-slate-950/65 p-6 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-player">NodeWars // Access</p>
                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  {mode === 'login' ? 'Welcome back.' : 'Join the arena.'}
                </h1>
              </div>
              <span className="mb-1 h-2 w-2 animate-pulse rounded-full bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.9)]" />
            </div>

            <div className="mb-6 grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-black/20 p-1">
              <button
                type="button"
                onClick={() => handleTabSwitch('login')}
                className={`rounded-full py-2 text-[10px] font-bold tracking-widest transition-all ${
                  mode === 'login' ? 'bg-player text-arena-bg shadow-lg shadow-player/25' : 'text-slate-400 hover:text-white'
                }`}
              >
                LOGIN
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch('signup')}
                className={`rounded-full py-2 text-[10px] font-bold tracking-widest transition-all ${
                  mode === 'signup' ? 'bg-player text-arena-bg shadow-lg shadow-player/25' : 'text-slate-400 hover:text-white'
                }`}
              >
                SIGN UP
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-xs font-bold text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-slate-300">
                    <span>Choose your avatar</span>
                    <span className="text-player">{AVATAR_OPTIONS.find(a => a.id === selectedAvatar)?.name}</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5 rounded-2xl border border-white/10 bg-black/20 p-1.5">
                    {AVATAR_OPTIONS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => handleAvatarSelect(av.id)}
                        className={`rounded-xl p-1 transition-all ${
                          selectedAvatar === av.id
                            ? 'border border-player bg-player/15 shadow-[0_0_14px_rgba(34,211,238,0.3)]'
                            : 'border border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <CyberAvatar archetype={av.id} size="sm" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {mode === 'signup' ? 'Gladiator handle' : 'Email or username'}
                </label>
                <div className="relative">
                  {mode === 'signup' ? <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-player/70" /> : <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-player/70" />}
                  <input
                    type="text"
                    required
                    value={mode === 'signup' ? username : (email || username)}
                    onChange={(e) => {
                      if (mode === 'signup') setUsername(e.target.value);
                      else {
                        setEmail(e.target.value);
                        setUsername(e.target.value);
                      }
                    }}
                    placeholder={mode === 'signup' ? 'e.g. AlgoValkyrie_99' : 'Enter your identity'}
                    className="w-full rounded-full border border-white/10 bg-black/25 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-player focus:bg-black/40 focus:ring-2 focus:ring-player/20"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-player/70" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@nodewars.arena"
                      className="w-full rounded-full border border-white/10 bg-black/25 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-player focus:bg-black/40 focus:ring-2 focus:ring-player/20"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Passcode</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-player/70" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your passcode"
                    className="w-full rounded-full border border-white/10 bg-black/25 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-player focus:bg-black/40 focus:ring-2 focus:ring-player/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-player py-3 text-xs font-black tracking-[0.2em] text-arena-bg shadow-lg shadow-player/25 transition hover:bg-player-light hover:shadow-player/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'CONNECTING...' : mode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wide">
              {mode === 'login' ? (
                <button type="button" onClick={() => alert('Password reset link simulated.')} className="text-slate-400 transition hover:text-player">
                  Forgot password?
                </button>
              ) : <span className="text-slate-500">Ready to compete?</span>}
              <button type="button" onClick={() => handleTabSwitch(mode === 'login' ? 'signup' : 'login')} className="text-orange-300 transition hover:text-orange-200">
                {mode === 'login' ? 'Sign up' : 'Back to login'}
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500">
              <span className="h-px flex-1 bg-white/10" />
              <span>Encrypted player session</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="mt-4 w-full rounded-full border border-orange-400/30 bg-orange-400/5 py-2.5 text-[10px] font-bold tracking-widest text-orange-300 transition hover:border-orange-300 hover:bg-orange-400/10"
            >
              1-CLICK DEMO LOGIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
