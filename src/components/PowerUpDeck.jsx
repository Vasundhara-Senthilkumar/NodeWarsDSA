import React from 'react';
import { Lightbulb, Search, Shield, CloudFog, Zap } from 'lucide-react';
import { sounds } from '../utils/soundEngine';

export const ABILITIES = [
  {
    id: 'hint',
    name: 'Hint',
    tagline: 'Conceptual Insight',
    cost: 30,
    icon: Lightbulb,
    color: '#fbbf24',
    bgHover: 'hover:border-amber-400 hover:bg-amber-500/10',
    description: 'Provides a small conceptual hint without revealing the code solution.'
  },
  {
    id: 'scan',
    name: 'Code Scan',
    tagline: 'Edge Case Alert',
    cost: 25,
    icon: Search,
    color: '#38bdf8',
    bgHover: 'hover:border-sky-400 hover:bg-sky-500/10',
    description: 'Scans your current solution and warns about potential edge case traps.'
  },
  {
    id: 'firewall',
    name: 'Firewall',
    tagline: 'Blocks Syntax Fog',
    cost: 40,
    icon: Shield,
    color: '#34d399',
    bgHover: 'hover:border-emerald-400 hover:bg-emerald-500/10',
    description: 'Deploys an active firewall barrier that absorbs 1 incoming Syntax Fog attack.'
  },
  {
    id: 'fog',
    name: 'Syntax Fog',
    tagline: 'Disrupt Opponent',
    cost: 50,
    icon: CloudFog,
    color: '#c084fc',
    bgHover: 'hover:border-purple-400 hover:bg-purple-500/10',
    description: 'Temporarily creates visual and UI disruption static for the opponent.'
  }
];

export const PowerUpDeck = ({ charge = 0, onUseAbility, activeAbilities = [], hasFirewall = false }) => {

  const handleTrigger = (ability) => {
    if (charge < ability.cost) {
      sounds.playClick();
      return;
    }

    if (ability.id === 'firewall') {
      sounds.playShield();
    } else if (ability.id === 'hint') {
      sounds.playSelect();
    } else if (ability.id === 'scan') {
      sounds.playClick();
    } else {
      sounds.playSabotageAttack();
    }

    onUseAbility(ability);
  };

  return (
    <div className="w-full bg-arena-panel rounded-xl border border-arena-border p-3 shadow-xl font-mono">
      
      {/* Header & Live Charge Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <img src="/nodewars-logo.png" alt="NodeWars Charge" className="w-5 h-5 object-contain animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            TACTICAL ABILITIES
          </span>
          {hasFirewall && (
            <span className="text-[10px] bg-emerald-500/15 border border-emerald-400/50 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
              <Shield className="w-3 h-3 text-emerald-400" /> FIREWALL ACTIVE
            </span>
          )}
        </div>

        {/* Charge Readout */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] text-arena-muted">ABILITY CHARGE:</span>
          <span className={`text-xs font-extrabold ${charge >= 50 ? 'text-player text-glow-player' : 'text-slate-300'}`}>
            {charge} / 100 CHARGE
          </span>
        </div>
      </div>

      {/* Charge Progress Meter */}
      <div className="h-2 w-full bg-arena-card rounded-full overflow-hidden border border-arena-border mb-3">
        <div 
          className="h-full bg-gradient-to-r from-teal-500 via-player to-indigo-400 transition-all duration-300 relative shadow-sm shadow-player"
          style={{ width: `${Math.min(100, charge)}%` }}
        ></div>
      </div>

      {/* 4 Redesigned Tactical Ability Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ABILITIES.map((ab) => {
          const canAfford = charge >= ab.cost;
          const isActive = activeAbilities.includes(ab.id);
          const Icon = ab.icon;

          return (
            <button
              key={ab.id}
              disabled={!canAfford && !isActive}
              onClick={() => handleTrigger(ab)}
              className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all duration-200 ${
                isActive
                  ? 'bg-player/20 border-player shadow-md shadow-player/30 scale-[1.02]'
                  : canAfford
                  ? `bg-arena-card border-arena-border ${ab.bgHover} hover:scale-[1.02] cursor-pointer`
                  : 'bg-arena-card/40 border-arena-border/50 opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div 
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: `${ab.color}25`, color: ab.color }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-arena-bg border border-arena-border text-slate-300">
                  {ab.cost} Charge
                </span>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-white truncate">
                  {ab.name}
                </h4>
                <p className="text-[9px] text-arena-muted truncate mt-0.5">
                  {ab.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
