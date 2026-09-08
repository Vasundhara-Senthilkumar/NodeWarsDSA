import React, { useState, useEffect, useRef } from 'react';
import { Swords, Radio, Shield, Zap, Sparkles } from 'lucide-react';
import { PlayerCard } from '../components/PlayerCard';
import { CURRENT_USER, OPPONENTS_POOL, TEAMMATES_POOL } from '../data/mockData';
import { sounds } from '../utils/soundEngine';
import { getSocket, socketApi } from '../services/socket';

export const MatchmakingScreen = ({ matchConfig, currentUser, onMatchReady }) => {
  const user = currentUser || CURRENT_USER;
  const [matchStep, setMatchStep] = useState(0); // 0: Scanning, 1: Matched, 2: Countdown / Enter
  const [countdown, setCountdown] = useState(3);
  const [searchProgress, setSearchProgress] = useState(15);
  const [opponent, setOpponent] = useState(null);
  const [teammate, setTeammate] = useState(null);
  const [opponentTeammate, setOpponentTeammate] = useState(null);

  const isTeam = matchConfig?.mode === 'team';
  const onMatchReadyRef = useRef(onMatchReady);
  useEffect(() => {
    onMatchReadyRef.current = onMatchReady;
  }, [onMatchReady]);

  useEffect(() => {
    const socket = getSocket();

    const progressTimer = setInterval(() => {
      setSearchProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 400);

    if (socket) {
      // Real Socket Matchmaking
      socketApi.joinMatchmaking({
        mode: matchConfig?.mode || 'solo',
        companyId: matchConfig?.company?.id,
        topicId: matchConfig?.topic?.id
      });

      let hasMatched = false;

      const handleFound = (data) => {
        hasMatched = true;
        setMatchStep(1);
        sounds.playMatchFound();
        sounds.playCountdown(false);
        setCountdown(data.countdown || 3);

        const otherPlayers = (data.players || []).filter((p) => p.userId !== socket.user?.id);
        if (otherPlayers.length > 0) {
          const oppUser = otherPlayers[0];
          setOpponent({
            id: oppUser.userId,
            username: oppUser.username,
            title: oppUser.title || 'Contender',
            archetype: oppUser.archetype || 'quantum_hacker',
            rating: oppUser.rating || 1500,
            tier: oppUser.tier || 'Silver',
            winStreak: 3,
            duelsFought: 25,
            winRate: '60%'
          });
        }
      };

      const handleBattleStart = (battleData) => {
        hasMatched = true;
        setMatchStep(2);
        sounds.playCountdown(true);
        setTimeout(() => {
          if (onMatchReadyRef.current) {
            onMatchReadyRef.current({
              ...matchConfig,
              ...battleData
            });
          }
        }, 400);
      };

      // Safety fallback timer if socket event is delayed
      const fallbackTimer = setTimeout(() => {
        if (!hasMatched) {
          const randomOpp = OPPONENTS_POOL[Math.floor(Math.random() * OPPONENTS_POOL.length)];
          setOpponent(randomOpp);
          setMatchStep(1);
          sounds.playMatchFound();
          sounds.playCountdown(false);

          let count = 3;
          setCountdown(count);
          const countInterval = setInterval(() => {
            count--;
            if (count > 0) {
              setCountdown(count);
              sounds.playCountdown(false);
            } else {
              clearInterval(countInterval);
              sounds.playCountdown(true);
              setMatchStep(2);
              setTimeout(() => {
                if (onMatchReadyRef.current) {
                  onMatchReadyRef.current({
                    ...matchConfig,
                    opponent: randomOpp,
                    teammate: isTeam ? TEAMMATES_POOL[0] : null,
                    opponentTeammate: isTeam ? TEAMMATES_POOL[1] : null
                  });
                }
              }, 400);
            }
          }, 900);
        }
      }, 3500);

      socket.on('matchmaking:found', handleFound);
      socket.on('battle:start', handleBattleStart);

      return () => {
        clearInterval(progressTimer);
        clearTimeout(fallbackTimer);
        socket.off('matchmaking:found', handleFound);
        socket.off('battle:start', handleBattleStart);
      };
    } else {
      // Local Mock Matchmaking Fallback
      const randomOpp = OPPONENTS_POOL[Math.floor(Math.random() * OPPONENTS_POOL.length)];
      setOpponent(randomOpp);

      if (isTeam) {
        setTeammate(TEAMMATES_POOL[0]);
        setOpponentTeammate(TEAMMATES_POOL[1]);
      }

      const matchTimer = setTimeout(() => {
        setMatchStep(1);
        sounds.playMatchFound();

        let count = 3;
        setCountdown(count);
        sounds.playCountdown(false);

        const countInterval = setInterval(() => {
          count--;
          if (count > 0) {
            setCountdown(count);
            sounds.playCountdown(false);
          } else {
            clearInterval(countInterval);
            sounds.playCountdown(true);
            setMatchStep(2);
            setTimeout(() => {
              if (onMatchReadyRef.current) {
                onMatchReadyRef.current({
                  ...matchConfig,
                  opponent: randomOpp,
                  teammate: isTeam ? TEAMMATES_POOL[0] : null,
                  opponentTeammate: isTeam ? TEAMMATES_POOL[1] : null,
                });
              }
            }, 400);
          }
        }, 900);

      }, 2200);

      return () => {
        clearInterval(progressTimer);
        clearTimeout(matchTimer);
      };
    }
  }, [isTeam, matchConfig]);

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full cyber-grid relative font-mono">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 ambient-glow-cyan pointer-events-none -z-10 blur-3xl opacity-40"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 ambient-glow-orange pointer-events-none -z-10 blur-3xl opacity-40"></div>

      {/* Top Header Summary Chip */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-arena-panel border border-arena-border text-xs text-slate-300 shadow-lg">
          <span className="text-player font-bold uppercase">{matchConfig?.mode === 'team' ? '2V2 SQUAD CLASH' : '1V1 SOLO ARENA'}</span>
          <span className="text-arena-muted">•</span>
          <span className="text-white font-semibold">🏢 {matchConfig?.company?.name || 'Google'}</span>
          <span className="text-arena-muted">•</span>
          <span className="text-opponent font-semibold">🧩 {matchConfig?.topic?.name || 'Dynamic Programming'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {matchStep === 0 ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-full bg-player animate-ping"></span>
              SCANNING MATCHMAKING POOL...
            </span>
          ) : (
            <span className="text-player text-glow-player flex items-center justify-center gap-2">
              <img src="/nodewars-logo.png" alt="NodeWars Logo" className="w-7 h-7 object-contain animate-bounce" />
              MATCH LOCKED! DEPLOYING IN {countdown}...
            </span>
          )}
        </h2>
      </div>

      {/* VS Face-Off Arena Layout */}
      <div className="relative my-8 grid grid-cols-1 md:grid-cols-11 gap-6 items-center justify-items-center">
        
        {/* Left Side: You */}
        <div className="md:col-span-5 w-full flex flex-col items-center animate-slide-in-left">
          <PlayerCard 
            player={user} 
            isPlayer={true} 
            size="large"
            showStatus={true}
            statusText="SYNCHRONIZED // COMBAT READY"
          />

          {isTeam && teammate && (
            <div className="mt-3 w-full max-w-sm">
              <PlayerCard 
                player={teammate} 
                isPlayer={true} 
                size="compact"
              />
            </div>
          )}
        </div>

        {/* Center: Glowing Metallic "VS" Emblem */}
        <div className="md:col-span-1 flex flex-col items-center justify-center my-4 md:my-0 z-20">
          <div className="relative w-16 h-16 rounded-full bg-arena-panel border-2 border-slate-600 flex items-center justify-center shadow-2xl">
            <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-300 to-slate-500 tracking-wider">
              VS
            </span>
            <div className="absolute inset-0 rounded-full border border-player/30 animate-ping pointer-events-none opacity-60"></div>
          </div>
          <div className="h-8 w-0.5 bg-gradient-to-b from-player to-opponent hidden md:block my-1"></div>
        </div>

        {/* Right Side: Opponent (Slides in from Right) */}
        <div className="md:col-span-5 w-full flex flex-col items-center animate-slide-in-right">
          {matchStep === 0 ? (
            /* Silhouette / Mystery Scanning Card */
            <div className="relative bg-arena-panel rounded-2xl border-2 border-dashed border-opponent/50 glow-opponent p-6 flex flex-col items-center text-center w-full max-w-sm min-h-[350px] justify-between">
              
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-arena-card text-opponent border border-opponent/30">
                  OPPONENT SEARCH
                </span>
                <span className="text-xs text-arena-muted animate-pulse">
                  LOCATING CONTENDER...
                </span>
              </div>

              {/* Radar Center Scanner */}
              <div className="relative w-28 h-28 rounded-full border-2 border-opponent/40 flex items-center justify-center my-4">
                <div className="w-20 h-20 rounded-full border border-opponent/60 animate-ping"></div>
                <Radio className="w-8 h-8 text-opponent animate-pulse" />
              </div>

              <div className="space-y-2 w-full">
                <div className="h-4 bg-arena-card rounded animate-pulse w-3/4 mx-auto"></div>
                <div className="h-3 bg-arena-card rounded animate-pulse w-1/2 mx-auto"></div>
              </div>

              <div className="w-full bg-arena-card/80 rounded-xl p-3 border border-arena-border text-xs text-slate-400">
                MATCHING ELO [1450 - 1550]...
              </div>

            </div>
          ) : (
            /* Revealed Opponent Card with CyberAvatar */
            <div className="w-full flex flex-col items-center">
              <PlayerCard 
                player={opponent} 
                isPlayer={false} 
                size="large"
                showStatus={true}
                statusText="CONTENDER LOCKED // READY"
              />

              {isTeam && opponentTeammate && (
                <div className="mt-3 w-full max-w-sm">
                  <PlayerCard 
                    player={opponentTeammate} 
                    isPlayer={false} 
                    size="compact"
                  />
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Bottom Progress Bar & Search Status */}
      <div className="w-full max-w-xl mx-auto bg-arena-panel rounded-xl border border-arena-border p-4 shadow-xl text-center space-y-2">
        <div className="flex items-center justify-between text-xs text-arena-muted">
          <span>MATCHMAKING PROTOCOL:</span>
          <span className="text-player font-bold">{searchProgress}% COMPLETE</span>
        </div>

        <div className="h-2 w-full bg-arena-card rounded-full overflow-hidden border border-arena-border">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 via-player to-cyan-300 transition-all duration-300 shadow-sm shadow-player"
            style={{ width: `${searchProgress}%` }}
          ></div>
        </div>

        <p className="text-[11px] text-slate-400">
          {matchStep === 0 
            ? 'Scanning regional servers for optimal latency and skill bracket...' 
            : 'Match secured! Synchronizing test matrix and starting countdown...'}
        </p>
      </div>

    </div>
  );
};
