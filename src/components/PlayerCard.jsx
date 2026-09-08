import React from 'react';
import { Shield, Flame, Trophy, Award, Zap } from 'lucide-react';
import { CyberAvatar } from './CyberAvatar';

export const PlayerCard = ({ 
  player, 
  isPlayer = false, 
  size = 'medium', // 'compact', 'medium', 'large'
  showStatus = false,
  statusText = 'Ready',
  progress = 0
}) => {
  if (!player) return null;

  const isCyan = isPlayer;
  const themeBorder = isCyan ? 'border-player/50 hover:border-player' : 'border-opponent/50 hover:border-opponent';
  const themeGlow = isCyan ? 'glow-player' : 'glow-opponent';
  const themeText = isCyan ? 'text-player' : 'text-opponent';

  if (size === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 p-2 rounded-xl bg-arena-panel border ${themeBorder} transition-all`}>
        <CyberAvatar archetype={player.archetype || (isCyan ? 'neon_ronin' : 'byte_reaper')} size="sm" />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white truncate max-w-[110px] font-mono">{player.username}</span>
            {player.winStreak > 0 && (
              <span className="text-[10px] text-orange-400 flex items-center font-mono">🔥{player.winStreak}</span>
            )}
          </div>
          <div className="text-[10px] font-mono text-arena-muted flex items-center gap-1.5">
            <span className={themeText}>{player.rating} ELO</span>
            <span>•</span>
            <span className="text-slate-400">{player.tier || 'Silver'}</span>
          </div>
        </div>
      </div>
    );
  }

  if (size === 'large') {
    return (
      <div className={`relative bg-arena-panel rounded-2xl border-2 ${themeBorder} ${themeGlow} p-6 flex flex-col items-center text-center transition-all duration-300 w-full max-w-sm`}>
        
        {/* Top Badges */}
        <div className="w-full flex items-center justify-between mb-4">
          <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-arena-card border ${isCyan ? 'border-player/30 text-player' : 'border-opponent/30 text-opponent'}`}>
            {isCyan ? 'YOU // GLADIATOR' : 'OPPONENT // CONTENDER'}
          </span>
          <div className="flex items-center gap-1 text-xs font-mono bg-arena-card px-2.5 py-1 rounded border border-arena-border text-orange-400">
            <Flame className="w-3.5 h-3.5 fill-orange-400" />
            <span>{player.winStreak || 0} STREAK</span>
          </div>
        </div>

        {/* Big Holographic Cyber Avatar */}
        <div className="relative my-2">
          <div className={`p-1 rounded-full border-2 ${isCyan ? 'border-player glow-player' : 'border-opponent glow-opponent'}`}>
            <CyberAvatar archetype={player.archetype || (isCyan ? 'neon_ronin' : 'byte_reaper')} size="xl" />
          </div>
          <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full bg-arena-panel border-2 ${isCyan ? 'border-player text-player' : 'border-opponent text-opponent'} shadow-md`}>
            <Shield className="w-4 h-4" />
          </div>
        </div>

        {/* Username & Title */}
        <h3 className="text-xl font-black text-white font-mono mt-3 flex items-center gap-2">
          {player.username}
        </h3>
        <p className="text-xs font-mono text-arena-muted mt-0.5">
          {player.title || 'Algorithmic Specialist'} • <span className="text-white font-medium">{player.tier || 'Silver III'}</span>
        </p>

        {/* ELO Rating Badge */}
        <div className="mt-4 w-full bg-arena-card/80 rounded-xl p-3 border border-arena-border flex items-center justify-between font-mono">
          <span className="text-xs text-arena-muted">COMBAT RATING</span>
          <span className={`text-lg font-extrabold ${themeText}`}>{player.rating} ELO</span>
        </div>

        {/* Live Status indicator */}
        {showStatus && (
          <div className="mt-4 flex items-center gap-2 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${isCyan ? 'bg-player animate-ping' : 'bg-opponent animate-pulse'}`}></span>
            <span className="text-slate-300">{statusText}</span>
          </div>
        )}
      </div>
    );
  }

  // Medium (Default)
  return (
    <div className={`p-3.5 rounded-xl bg-arena-panel border ${themeBorder} ${themeGlow} flex items-center gap-3.5 transition-all`}>
      <CyberAvatar archetype={player.archetype || (isCyan ? 'neon_ronin' : 'byte_reaper')} size="md" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
            {player.username}
            {player.winStreak > 0 && <span className="text-xs text-orange-400">🔥{player.winStreak}</span>}
          </h4>
          <span className={`text-xs font-mono font-bold ${themeText}`}>{player.rating} ELO</span>
        </div>
        <div className="text-xs text-arena-muted font-mono mt-1 flex items-center gap-2">
          <span>{player.tier}</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">{player.winRate || '65% WR'}</span>
        </div>
      </div>
    </div>
  );
};
