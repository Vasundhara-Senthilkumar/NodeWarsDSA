import React from 'react';
import { Swords, Users2, Trophy, Flame, Zap, Shield, ChevronRight, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEngine';
import { LEADERBOARD_DATA, CURRENT_USER } from '../data/mockData';
import { CyberAvatar } from '../components/CyberAvatar';

export const LandingScreen = ({ onSelectMode, currentUser }) => {
  const user = currentUser || CURRENT_USER;
  const top3 = LEADERBOARD_DATA.slice(0, 3);
  const isUserInTop3 = top3.some((p) => p.isUser || p.username === user.username);

  const handleModeClick = (mode) => {
    sounds.playSelect();
    onSelectMode(mode);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full cyber-grid relative">
      
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 ambient-glow-cyan pointer-events-none -z-10 blur-3xl opacity-50"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 ambient-glow-orange pointer-events-none -z-10 blur-3xl opacity-30"></div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto pt-2 pb-6 space-y-3 font-mono">
        
        {/* Arena Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-player/10 border border-player/30 text-player text-xs font-mono tracking-widest uppercase shadow-sm shadow-player/20">
          <img src="/nodewars-logo.png" alt="NodeWars Logo" className="w-4 h-4 object-contain" />
          <span>REAL-TIME COMPETITIVE DSA BATTLE ARENA</span>
        </div>

        {/* Main Logo */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-mono">
          NODE<span className="text-player text-glow-player">WARS</span>
        </h1>
        <p className="text-lg sm:text-2xl text-slate-200 font-bold max-w-2xl mx-auto tracking-wide">
          Where every edge case is a battlefield.
        </p>
      </div>

      {/* Main Grid: Game Mode Cards + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-4 font-mono">
        
        {/* Left: Mode Selection (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Swords className="w-4 h-4 text-player" />
              <span>SELECT COMBAT DEPLOYMENT</span>
            </h2>
            <span className="text-xs text-arena-muted">ONLINE COMBAT</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Solo 1v1 Card */}
            <div 
              onClick={() => handleModeClick('solo')}
              className="group relative bg-arena-panel hover:bg-arena-cardHover border-2 border-player/40 hover:border-player rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] glow-player flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-player/15 border border-player/40 flex items-center justify-center text-player group-hover:scale-110 transition-transform">
                    <Swords className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase px-2.5 py-1 rounded bg-player/10 text-player border border-player/30">
                    1V1 DUEL
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-player transition-colors">
                    SOLO ARENA
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed font-sans">
                    Head-to-head algorithmic racing. Optimize Big-O time and deploy tactical abilities against rival coders.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-arena-border flex items-center justify-between">
                <span className="text-xs text-player font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  DEPLOY TO 1V1 <ChevronRight className="w-4 h-4" />
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                  ⚡ 54 in queue
                </span>
              </div>
            </div>

            {/* Team 2v2 Card */}
            <div 
              onClick={() => handleModeClick('team')}
              className="group relative bg-arena-panel hover:bg-arena-cardHover border-2 border-opponent/40 hover:border-opponent rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] glow-opponent flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-opponent/15 border border-opponent/40 flex items-center justify-center text-opponent group-hover:scale-110 transition-transform">
                    <Users2 className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase px-2.5 py-1 rounded bg-opponent/10 text-opponent border border-opponent/30">
                    2V2 SQUAD
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-opponent transition-colors">
                    SQUAD CLASH
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed font-sans">
                    Pair-programmed synergy racing. Shared squad progress gauges and co-op tactical ability combinations.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-arena-border flex items-center justify-between">
                <span className="text-xs font-opponent font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  DEPLOY TO 2V2 <ChevronRight className="w-4 h-4" />
                </span>
                <span className="text-[10px] text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded border border-orange-800/40">
                  🔥 30 in queue
                </span>
              </div>
            </div>

          </div>

          {/* Arena Feature Strip */}
          <div className="bg-arena-card/60 rounded-xl p-4 border border-arena-border grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-arena-muted">TECH GIANTS</p>
              <p className="text-sm font-bold text-white mt-0.5">Google • Amazon • MS</p>
            </div>
            <div>
              <p className="text-xs text-arena-muted">CODE HARNESS</p>
              <p className="text-sm font-bold text-player mt-0.5">JS / Py / C++ / Java</p>
            </div>
            <div>
              <p className="text-xs text-arena-muted">MATCH VELOCITY</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">15:00 Deathmatch</p>
            </div>
          </div>
        </div>

        {/* Right: Live Leaderboard Ladder (5 Cols) */}
        <div className="lg:col-span-5 bg-arena-panel rounded-2xl border border-arena-border p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-arena-border">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-rank-gold" />
              <h3 className="font-bold text-white text-sm">GLOBAL TITAN LADDER</h3>
            </div>
            <span className="text-[10px] text-arena-muted uppercase">TOP GLADIATORS</span>
          </div>

          {/* Leaderboard list with CyberAvatars */}
          <div className="space-y-2.5 mt-4">
            {top3.map((player) => {
              const isYou = player.isUser || player.username === user.username;
              return (
                <div 
                  key={player.rank}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    isYou 
                      ? 'bg-player/10 border-player shadow-md shadow-player/20' 
                      : 'bg-arena-card border-arena-border hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className="w-6 text-center font-black text-sm text-slate-300">
                      {player.tierBadge || `#${player.rank}`}
                    </div>

                    {/* Cyber Avatar */}
                    <CyberAvatar archetype={player.archetype} size="sm" />

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold ${isYou ? 'text-player' : 'text-white'}`}>
                          {player.username} {isYou && '(You)'}
                        </span>
                      </div>
                      <div className="text-[10px] text-arena-muted flex items-center gap-2">
                        <span>{player.tier}</span>
                        <span>•</span>
                        <span className="text-orange-400">🔥 {player.winStreak}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-xs font-extrabold ${isYou ? 'text-player text-glow-player' : 'text-white'}`}>
                      {player.rating} ELO
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pinned "Your Rank" Row if user is not in top 3 */}
            {!isUserInTop3 && (
              <div className="pt-2 border-t border-arena-border/80">
                <div className="text-[10px] font-mono text-player font-bold uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>YOUR RANK // POSITION</span>
                  <span className="text-slate-400">PERSONAL ELO</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl border bg-player/10 border-player/60 shadow-md shadow-player/20">
                  <div className="flex items-center gap-3">
                    <div className="w-6 text-center font-black text-sm text-player font-mono">
                      #{user.rank || 4}
                    </div>
                    <CyberAvatar archetype={user.archetype || 'neon_ronin'} size="sm" />
                    <div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-xs font-bold text-player">
                          {user.username} <span className="text-[10px] text-player/80">(You)</span>
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-arena-muted flex items-center gap-2">
                        <span>{user.tier || 'Silver III'}</span>
                        <span>•</span>
                        <span className="text-orange-400">🔥 {user.winStreak || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-xs font-extrabold text-player text-glow-player">
                      {user.rating || 1480} ELO
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Bottom Footer */}
      <div className="mt-6 pt-4 border-t border-arena-border/50 text-center text-xs font-mono text-arena-muted flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>NodeWars Arena • Real-Time Competitive Algorithmic Battle Engine</span>
        <span className="text-slate-500">Multiplayer DSA Competitive Platform</span>
      </div>

    </div>
  );
};
