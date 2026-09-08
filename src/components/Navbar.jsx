import React, { useState } from 'react';
import { Zap, Volume2, VolumeX, Shield, User, Trophy, LogIn, LogOut } from 'lucide-react';
import { sounds } from '../utils/soundEngine';
import { CyberAvatar } from './CyberAvatar';

export const Navbar = ({ 
  onNavigateHome, 
  activeScreen, 
  currentUser,
  currentRating = 1480,
  onOpenAuth,
  onLogout
}) => {
  const [isMuted, setIsMuted] = useState(sounds.isMuted);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const toggleAudio = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) sounds.playClick();
  };

  const user = currentUser || {
    username: 'Neon_Ronin',
    title: 'Syntax Assassin',
    archetype: 'neon_ronin',
    tier: 'Silver III',
    winStreak: 4,
    winRate: '68%',
    duelsFought: 34,
    cpmSpeed: 48,
    isLoggedIn: true
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-arena-bg/85 backdrop-blur-md border-b border-arena-border/80 px-4 lg:px-8 py-2.5 font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => {
              sounds.playClick();
              if (onNavigateHome) onNavigateHome();
            }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 rounded-xl bg-arena-card border border-player/50 flex items-center justify-center p-0.5 shadow-lg shadow-player/20 group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/nodewars-logo.png" alt="NodeWars Logo" className="w-full h-full object-contain" />
              <div className="absolute inset-0 rounded-xl border border-player/50 animate-pulse-glow-cyan pointer-events-none"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-wider text-white flex items-center">
                  NODE<span className="text-player text-glow-player">WARS</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-player/10 text-player border border-player/30">
                  COMPETITIVE ARENA
                </span>
              </div>
              <p className="text-[11px] text-arena-muted hidden sm:block">
                Where every edge case is a battlefield.
              </p>
            </div>
          </div>

          {/* Center Status Indicators */}
          <div className="hidden md:flex items-center gap-6 text-xs text-arena-muted">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-slate-300">ARENA: <span className="text-emerald-400 font-bold">ONLINE</span></span>
            </div>
            <div className="flex items-center gap-2 bg-arena-panel px-3 py-1.5 rounded-full border border-arena-border">
              <Trophy className="w-3.5 h-3.5 text-rank-gold" />
              <span>SEASON 04 // TITAN MATRIX</span>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-lg border transition-all ${
                isMuted 
                  ? 'bg-arena-panel border-arena-border text-arena-muted hover:text-white' 
                  : 'bg-player/10 border-player/40 text-player shadow-sm shadow-player/20 hover:bg-player/20'
              }`}
              title={isMuted ? "Unmute Sound Effects" : "Mute Sound Effects"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Auth / Profile Trigger */}
            {user?.isLoggedIn ? (
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowProfileModal(true);
                }}
                className="flex items-center gap-2.5 bg-arena-panel hover:bg-arena-cardHover border border-arena-border hover:border-player/40 px-3 py-1.5 rounded-xl transition-all group"
              >
                <CyberAvatar archetype={user.archetype} size="sm" />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white group-hover:text-player transition-colors flex items-center gap-1">
                    <span>{user.username}</span>
                  </div>
                  <div className="text-[10px] text-player flex items-center gap-1">
                    <span>{currentRating} Points</span>
                    <span className="text-orange-400 font-bold flex items-center">🔥{user.winStreak}</span>
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playClick();
                  if (onOpenAuth) onOpenAuth();
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-player/15 hover:bg-player/25 border border-player/40 text-player text-xs font-bold transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>SIGN IN</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Quick Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-mono">
          <div className="bg-arena-panel border border-arena-border rounded-2xl max-w-md w-full p-6 relative glow-player shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-arena-border">
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-full border-2 border-player glow-player">
                  <CyberAvatar archetype={user.archetype} size="md" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{user.username}</h3>
                  <p className="text-xs text-player">{user.title} • {user.tier} ({currentRating} Points)</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="text-arena-muted hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="bg-arena-card p-3 rounded-lg border border-arena-border text-center">
                <p className="text-[11px] text-arena-muted">Win Rate</p>
                <p className="text-lg font-bold text-emerald-400">{user.winRate || '68%'}</p>
              </div>
              <div className="bg-arena-card p-3 rounded-lg border border-arena-border text-center">
                <p className="text-[11px] text-arena-muted">Win Streak</p>
                <p className="text-lg font-bold text-orange-400">🔥 {user.winStreak || 4}</p>
              </div>
              <div className="bg-arena-card p-3 rounded-lg border border-arena-border text-center">
                <p className="text-[11px] text-arena-muted">Total Duels</p>
                <p className="text-lg font-bold text-player">{user.duelsFought || 34}</p>
              </div>
            </div>

            <div className="bg-arena-card/60 p-3 rounded-lg border border-arena-border text-xs text-slate-300 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-arena-muted">Target Rank:</span>
                <span className="text-rank-gold font-semibold">Gold Rank (1,500 Points)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-arena-muted">Avg Speed:</span>
                <span>{user.cpmSpeed || 48} chars/min</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  if (onOpenAuth) onOpenAuth();
                }}
                className="flex-1 py-2.5 rounded-lg bg-arena-card hover:bg-arena-cardHover border border-arena-border text-slate-300 text-xs font-semibold uppercase transition-all"
              >
                Switch Account
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="flex-1 py-2.5 rounded-lg bg-player/15 hover:bg-player/25 border border-player/40 text-player font-semibold text-xs uppercase transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
