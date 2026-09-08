import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  Home, 
  Clock, 
  Cpu, 
  Flame, 
  CheckCircle2, 
  Award,
  AlertOctagon
} from 'lucide-react';
import { triggerVictoryConfetti } from '../utils/confetti';
import { sounds } from '../utils/soundEngine';
import { CURRENT_USER } from '../data/mockData';

export const ResultScreen = ({ battleResult, currentUser, onPlayAgain, onHome }) => {
  const user = currentUser || CURRENT_USER;
  const didWin = battleResult?.didWin ?? true;
  const ratingDelta = battleResult?.ratingChange !== undefined 
    ? battleResult.ratingChange 
    : (didWin ? 42 : -15);

  const targetRating = user.rating || 1480;
  const initialRating = targetRating - ratingDelta;
  
  // Did user cross rank threshold (e.g. >= 1500 is Gold I tier)
  const isRankUp = initialRating < 1500 && targetRating >= 1500;

  // Animated counting rating state
  const [displayedRating, setDisplayedRating] = useState(initialRating);
  const [displayedDelta, setDisplayedDelta] = useState(0);
  const [showRankUpBanner, setShowRankUpBanner] = useState(false);

  useEffect(() => {
    if (didWin) {
      triggerVictoryConfetti();
      sounds.playVictory();
    } else {
      sounds.playDefeat();
    }

    // Smooth count-up / count-down animation over ~1.4s
    const startTime = Date.now();
    const duration = 1400;

    const animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      const currentVal = Math.round(initialRating + ratingDelta * progress);
      const currentDelta = Math.round(ratingDelta * progress);

      setDisplayedRating(currentVal);
      setDisplayedDelta(currentDelta);

      if (progress >= 1) {
        clearInterval(animationInterval);
        if (isRankUp) {
          setShowRankUpBanner(true);
          sounds.playRankUp();
        }
      }
    }, 30);

    return () => clearInterval(animationInterval);
  }, [didWin, initialRating, ratingDelta, isRankUp]);

  // Format mm:ss into human readable
  const formatTime = (secs = 0) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full cyber-grid relative overflow-hidden font-mono">
      
      {/* Ambient background glows */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] pointer-events-none -z-10 blur-3xl opacity-40 ${
        didWin ? 'ambient-glow-cyan' : 'ambient-glow-orange'
      }`}></div>

      {/* Main Banner: VICTORY or DEFEATED */}
      <div className="text-center space-y-3 pt-4">
        
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest ${
          didWin 
            ? 'bg-player/10 border-player text-player shadow-md shadow-player/20' 
            : 'bg-opponent/10 border-opponent text-opponent shadow-md shadow-opponent/20'
        }`}>
          {didWin ? <Trophy className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
          <span>{didWin ? 'MATCH WON' : 'MATCH LOST'}</span>
        </div>

        <h1 className={`text-5xl sm:text-7xl font-black tracking-tight ${
          didWin 
            ? 'text-player text-glow-player animate-pulse-glow-cyan' 
            : 'text-opponent text-glow-opponent'
        }`}>
          {didWin ? 'VICTORY' : 'DEFEATED'}
        </h1>

        <p className="text-sm text-slate-300 max-w-md mx-auto font-sans">
          {didWin 
            ? 'Great job! You solved the problem first and passed all test cases.' 
            : 'Your opponent finished first this time. Challenge them to a rematch!'}
        </p>
      </div>

      {/* Rank Up Glow Notification Banner */}
      {showRankUpBanner && (
        <div className="my-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-rank-gold/30 to-amber-500/20 border-2 border-rank-gold glow-gold text-center animate-in zoom-in-95 duration-500 shadow-2xl">
          <div className="flex items-center justify-center gap-2 text-rank-gold text-sm font-bold tracking-wider uppercase">
            <Award className="w-5 h-5" />
            <span>RANK LEVEL UP: PROMOTED TO GOLD RANK!</span>
            <Award className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-200 mt-1 font-sans">
            You crossed 1,500 points! Unlocked your new Gold rank badge.
          </p>
        </div>
      )}

      {/* Rating Points Progression Card */}
      <div className="my-6 bg-arena-panel rounded-2xl border border-arena-border p-6 shadow-2xl text-center">
        <p className="text-xs text-arena-muted uppercase tracking-widest font-bold mb-1">
          YOUR PLAYER RATING (POINTS)
        </p>

        {/* Big Animated Points Number */}
        <div className="flex items-center justify-center gap-4 my-2">
          <span className={`text-4xl sm:text-5xl font-black ${didWin ? 'text-white' : 'text-slate-300'}`}>
            {displayedRating}
          </span>
          <span className={`text-xl sm:text-2xl font-bold px-3 py-1 rounded-lg border ${
            didWin 
              ? 'bg-player/15 border-player/50 text-player text-glow-player' 
              : 'bg-opponent/15 border-opponent/50 text-opponent text-glow-opponent'
          }`}>
            {displayedDelta >= 0 ? `+${displayedDelta}` : displayedDelta} Points
          </span>
        </div>

        {/* Progress bar to next rank */}
        <div className="max-w-md mx-auto mt-4 space-y-1.5">
          <div className="flex justify-between text-[11px] text-arena-muted">
            <span>{isRankUp ? 'Gold Rank' : user.tier}</span>
            <span className="text-rank-gold font-bold">Next Rank at: 1,600 Points (Platinum)</span>
          </div>
          <div className="h-2.5 w-full bg-arena-card rounded-full overflow-hidden border border-arena-border">
            <div 
              className={`h-full transition-all duration-700 ${
                didWin ? 'bg-gradient-to-r from-teal-400 to-player shadow-md shadow-player' : 'bg-slate-500'
              }`}
              style={{ width: `${Math.min(100, (displayedRating / 1600) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Performance Summary Cards (Clean & Simple Labels) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2">
        
        {/* 1. Time Taken */}
        <div className="bg-arena-panel p-4 rounded-xl border border-arena-border text-center">
          <div className="flex items-center justify-center gap-1 text-arena-muted text-xs mb-1">
            <Clock className="w-3.5 h-3.5 text-player" />
            <span>TIME TAKEN</span>
          </div>
          <p className="text-base font-extrabold text-white">
            {formatTime(battleResult?.timeTakenSec || 342)}
          </p>
          <span className="text-[10px] text-emerald-400">⚡ Fast Finish</span>
        </div>

        {/* 2. Test Cases Passed */}
        <div className="bg-arena-panel p-4 rounded-xl border border-arena-border text-center">
          <div className="flex items-center justify-center gap-1 text-arena-muted text-xs mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>TEST CASES</span>
          </div>
          <p className="text-base font-extrabold text-emerald-400">
            5 / 5 Passed
          </p>
          <span className="text-[10px] text-arena-muted">100% Correct</span>
        </div>

        {/* 3. Coding Speed */}
        <div className="bg-arena-panel p-4 rounded-xl border border-arena-border text-center">
          <div className="flex items-center justify-center gap-1 text-arena-muted text-xs mb-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>TYPING SPEED</span>
          </div>
          <p className="text-base font-extrabold text-player">
            {battleResult?.cpm || 58} chars/min
          </p>
          <span className="text-[10px] text-slate-400">Speed Score</span>
        </div>

        {/* 4. Win Streak */}
        <div className="bg-arena-panel p-4 rounded-xl border border-arena-border text-center">
          <div className="flex items-center justify-center gap-1 text-arena-muted text-xs mb-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>WIN STREAK</span>
          </div>
          <p className="text-base font-extrabold text-orange-400">
            🔥 {user.winStreak || 0} in a row
          </p>
          <span className="text-[10px] text-orange-400">{didWin ? '+1 Win Added' : 'Streak Reset'}</span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="mt-8 pt-4 border-t border-arena-border flex flex-col sm:flex-row items-center justify-center gap-4">
        
        <button
          onClick={() => {
            sounds.playClick();
            onHome();
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-arena-panel hover:bg-arena-card border border-arena-border text-slate-300 hover:text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>BACK TO HOME</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onPlayAgain();
          }}
          className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xl ${
            didWin 
              ? 'bg-player text-arena-bg hover:bg-player-light glow-player-lg shadow-player/30' 
              : 'bg-opponent text-arena-bg hover:bg-opponent-light glow-opponent-lg shadow-opponent/30'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>PLAY NEXT MATCH</span>
        </button>

      </div>

    </div>
  );
};
