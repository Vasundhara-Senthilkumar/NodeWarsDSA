import React, { useState, useEffect } from 'react';
import { Swords, Users, Zap, Trophy, Radio } from 'lucide-react';
import { LIVE_ACTIVITY_EVENTS } from '../data/mockData';

export const StatsTicker = () => {
  const [eventIndex, setEventIndex] = useState(0);
  const [duelsToday, setDuelsToday] = useState(1842);
  const [inQueue, setInQueue] = useState(84);

  // Rotate through mock live events every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setEventIndex((prev) => (prev + 1) % LIVE_ACTIVITY_EVENTS.length);
    }, 3500);

    // Subtle random tick for in-queue and duels
    const countTimer = setInterval(() => {
      setInQueue((prev) => Math.max(70, prev + Math.floor(Math.random() * 5) - 2));
      if (Math.random() > 0.6) {
        setDuelsToday((prev) => prev + 1);
      }
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(countTimer);
    };
  }, []);

  return (
    <div className="w-full bg-arena-panel/90 border-y border-arena-border/60 py-2 px-4 text-xs font-mono">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* Live Counters */}
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5 bg-arena-card px-2.5 py-1 rounded border border-arena-border">
            <Swords className="w-3.5 h-3.5 text-player" />
            <span>DUELS TODAY:</span>
            <span className="text-white font-bold">{duelsToday.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-arena-card px-2.5 py-1 rounded border border-arena-border">
            <Users className="w-3.5 h-3.5 text-opponent" />
            <span>IN QUEUE:</span>
            <span className="text-opponent font-bold">{inQueue}</span>
          </div>
        </div>

        {/* Live Event Stream */}
        <div className="flex items-center gap-2 overflow-hidden text-slate-300 w-full sm:w-auto justify-center sm:justify-end">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-player opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-player"></span>
          </span>
          <span className="text-[11px] text-player font-bold uppercase tracking-wider hidden lg:inline">FEED:</span>
          <p className="text-[11px] truncate transition-opacity duration-300 text-slate-300">
            {LIVE_ACTIVITY_EVENTS[eventIndex]?.text}
          </p>
        </div>

      </div>
    </div>
  );
};
