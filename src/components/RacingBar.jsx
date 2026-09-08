import React from 'react';
import { Zap, Swords, Flame, Sparkles, CheckCircle2 } from 'lucide-react';

export const RacingBar = ({
  playerProgress = 0,
  opponentProgress = 0,
  isTeamMode = false,
  teammateProgress = 0,
  opponentTeammateProgress = 0,
  playerName = "You",
  opponentName = "Opponent",
  teammateName = "Teammate",
  opponentTeammateName = "Opponent 2"
}) => {
  // Aggregate calculations for 2v2 or direct for 1v1
  const effectivePlayerProgress = isTeamMode 
    ? Math.round((playerProgress + teammateProgress) / 2) 
    : Math.round(playerProgress);

  const effectiveOpponentProgress = isTeamMode 
    ? Math.round((opponentProgress + opponentTeammateProgress) / 2) 
    : Math.round(opponentProgress);

  const getStatusText = (val) => {
    if (val >= 100) return 'READY FOR SUBMIT';
    if (val >= 75) return 'PASSING EDGE CASES';
    if (val >= 50) return 'OPTIMIZING LOOPS';
    if (val >= 25) return 'SYNTAX REFINEMENT';
    return 'DRAFTING ALGORITHM';
  };

  return (
    <div className="w-full bg-arena-panel/95 rounded-xl border border-arena-border p-4 shadow-xl font-mono">
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-player" />
          <span className="text-white font-bold tracking-wider uppercase">
            {isTeamMode ? 'SQUAD CLASH SYNERGY GAUGE' : 'REAL-TIME COMBAT VELOCITY'}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-arena-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-player inline-block"></span>
            <span className="text-slate-300">YOU (CYAN)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-opponent inline-block"></span>
            <span className="text-slate-300">OPPONENT (ORANGE)</span>
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Player (Cyan) Progress Track */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-player animate-ping"></span>
              <span className="font-bold text-player">{playerName} {isTeamMode && `+ ${teammateName}`}</span>
              <span className="text-[10px] text-arena-muted bg-arena-card px-2 py-0.5 rounded border border-arena-border">
                {getStatusText(effectivePlayerProgress)}
              </span>
            </div>
            <span className="text-player font-bold text-sm text-glow-player">
              {effectivePlayerProgress}%
            </span>
          </div>

          {/* Health/Mana Bar Track */}
          <div className="relative h-4 w-full bg-arena-card rounded-full overflow-hidden border border-player/30 p-0.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-teal-500 via-player to-cyan-300 transition-all duration-300 relative shadow-lg shadow-player/40 flex items-center justify-end"
              style={{ width: `${Math.min(100, Math.max(4, effectivePlayerProgress))}%` }}
            >
              {/* Pulsing leading edge */}
              <div className="w-2 h-full bg-white/80 rounded-full blur-[1px] animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Opponent (Orange) Progress Track */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-opponent animate-pulse"></span>
              <span className="font-bold text-opponent">{opponentName} {isTeamMode && `+ ${opponentTeammateName}`}</span>
              <span className="text-[10px] text-arena-muted bg-arena-card px-2 py-0.5 rounded border border-arena-border">
                {getStatusText(effectiveOpponentProgress)}
              </span>
            </div>
            <span className="text-opponent font-bold text-sm text-glow-opponent">
              {effectiveOpponentProgress}%
            </span>
          </div>

          {/* Opponent Health/Mana Bar Track */}
          <div className="relative h-4 w-full bg-arena-card rounded-full overflow-hidden border border-opponent/30 p-0.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-red-600 via-opponent to-amber-400 transition-all duration-1000 ease-out relative shadow-lg shadow-opponent/40 flex items-center justify-end"
              style={{ width: `${Math.min(100, Math.max(4, effectiveOpponentProgress))}%` }}
            >
              {/* Pulsing leading edge */}
              <div className="w-2 h-full bg-white/80 rounded-full blur-[1px] animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
