import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Play, 
  Send, 
  Code2, 
  Terminal as TerminalIcon, 
  HelpCircle, 
  Building2,
  BrainCircuit,
  Eye,
  Shield,
  Lightbulb,
  Search,
  CloudFog,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';
import { RacingBar } from '../components/RacingBar';
import { TerminalOutput } from '../components/TerminalOutput';
import { JudgingModal } from '../components/JudgingModal';
import { PowerUpDeck } from '../components/PowerUpDeck';
import { getProblem } from '../data/mockData';
import { sounds } from '../utils/soundEngine';
import { getSocket, socketApi } from '../services/socket';
import { runSimulatedJudge } from '../utils/judgeEvaluator';

export const BattleScreen = ({ matchData, onBattleComplete, onForfeit }) => {
  const companyId = matchData?.company?.id || 'google';
  const topicId = matchData?.topic?.id || 'dp';
  const fallbackProblem = getProblem(companyId, topicId);
  const problem = matchData?.problem ? {
    id: matchData.problem.id,
    title: matchData.problem.title,
    difficulty: matchData.problem.difficulty,
    timeLimit: matchData.problem.time_limit || '1.2s',
    memoryLimit: matchData.problem.memory_limit || '128 MB',
    description: matchData.problem.description,
    examples: typeof matchData.problem.examples_json === 'string' ? JSON.parse(matchData.problem.examples_json) : (matchData.problem.examples || fallbackProblem.examples),
    constraints: typeof matchData.problem.constraints_json === 'string' ? JSON.parse(matchData.problem.constraints_json) : (matchData.problem.constraints || fallbackProblem.constraints),
    hints: typeof matchData.problem.hints_json === 'string' ? JSON.parse(matchData.problem.hints_json) : (matchData.problem.hints || fallbackProblem.hints),
    starterCode: typeof matchData.problem.starter_code_json === 'string' ? JSON.parse(matchData.problem.starter_code_json) : (matchData.problem.starter_code || matchData.problem.starterCode || fallbackProblem.starterCode),
    testCases: typeof matchData.problem.test_cases_json === 'string' ? JSON.parse(matchData.problem.test_cases_json) : (matchData.problem.test_cases || matchData.problem.testCases || fallbackProblem.testCases)
  } : fallbackProblem;

  const matchId = matchData?.matchId;
  const isTeam = matchData?.mode === 'team';

  // Language & Code Editor State
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(problem.starterCode?.javascript || '// TODO: implement');

  // A BattleScreen instance can be reused for another match. Always discard the
  // previous editor contents and load only the selected problem's starter code.
  useEffect(() => {
    const starterCode = problem.starterCode?.javascript || '// TODO: implement';
    setLanguage('javascript');
    setCode(starterCode);
  }, [matchId, problem.id]);
  
  // Progress, Charge & Abilities
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15:00 in seconds
  const [playerProgress, setPlayerProgress] = useState(15);
  const [opponentProgress, setOpponentProgress] = useState(10);
  const [teammateProgress, setTeammateProgress] = useState(12);
  const [opponentTeammateProgress, setOpponentTeammateProgress] = useState(8);

  const [charge, setCharge] = useState(35);
  const [hasFirewall, setHasFirewall] = useState(false);
  const [activeAbilities, setActiveAbilities] = useState([]);
  const [screenEffect, setScreenEffect] = useState(null); // 'glitch' | 'scan_active'

  // Active Feedback Modals for Hint & Code Scan
  const [activeHintToast, setActiveHintToast] = useState(null);
  const [activeScanToast, setActiveScanToast] = useState(null);

  // Terminal & Judging State
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isJudging, setIsJudging] = useState(false);
  const [testCasesResults, setTestCasesResults] = useState(null);
  const [unlockedHints, setUnlockedHints] = useState([]);
  const [combatLogs, setCombatLogs] = useState([
    { id: 1, text: '⚔️ Battle started. 15-minute countdown active.' },
    { id: 2, text: '⚡ Type code to build Charge and unlock Tactical Abilities.' }
  ]);

  const textareaRef = useRef(null);

  const handleLanguageChange = (newLang) => {
    sounds.playSelect();
    setLanguage(newLang);
    if (problem.starterCode[newLang]) {
      setCode(problem.starterCode[newLang]);
    }
  };

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishBattle(false);
          return 0;
        }
        if (prev <= 60 && prev % 10 === 0) {
          sounds.playCountdown(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [opponentCharge, setOpponentCharge] = useState(0);

  // Opponent simulated coding progress & AI counter-attacks
  useEffect(() => {
    let opponentTimer;

    const simulateOpponentTurn = () => {
      setOpponentProgress((prev) => {
        if (prev >= 92) return prev;
        // Mimic a human coder: small progress bursts arrive several seconds apart.
        const inc = Math.floor(Math.random() * 4) + 1;
        const newScore = Math.min(92, prev + inc);

        // Opponent ability charge ONLY increases on test case pass events
        if (newScore > 35 && prev <= 35) {
          setOpponentCharge((c) => Math.min(100, c + 40));
          addCombatLog('⚠️ Opponent passed Test Case #1 (+40 Ability Charge earned)');
        } else if (newScore > 65 && prev <= 65) {
          setOpponentCharge((c) => Math.min(100, c + 40));
          addCombatLog('⚡ Opponent passed Test Case #2 (+40 Ability Charge earned)');
        }
        return newScore;
      });

      // Opponent deploys attack ONLY if sufficient charge was earned from test case pass events
      setOpponentCharge((currentCharge) => {
        if (currentCharge >= 40) {
          if (hasFirewall) {
            setHasFirewall(false);
            sounds.playShield();
            addCombatLog('🛡️ FIREWALL blocked incoming Opponent Syntax Fog attack!');
          } else {
            sounds.playGlitch();
            setScreenEffect('glitch');
            addCombatLog('⚠️ Opponent deployed [Syntax Fog]! Your view is disrupted for 3s!');
            setTimeout(() => setScreenEffect(null), 3000);
          }
          return currentCharge - 40;
        }
        return currentCharge;
      });

      if (isTeam) {
        setTeammateProgress((prev) => Math.min(95, prev + Math.floor(Math.random() * 3) + 1));
        setOpponentTeammateProgress((prev) => Math.min(88, prev + Math.floor(Math.random() * 3) + 1));
      }

      // Vary each thinking interval so the opponent does not feel scripted.
      opponentTimer = setTimeout(simulateOpponentTurn, 7000 + Math.random() * 7000);
    };

    opponentTimer = setTimeout(simulateOpponentTurn, 7000 + Math.random() * 7000);
    return () => clearTimeout(opponentTimer);
  }, [isTeam, hasFirewall]);

  // Join battle room on socket if matchId exists
  useEffect(() => {
    const socket = getSocket();
    if (socket && matchId) {
      socketApi.joinBattle(matchId);

      const handleProgress = (roomState) => {
        if (!roomState || !roomState.players) return;
        const myId = socket.user?.id;
        const me = roomState.players.find((p) => p.userId === myId);
        const opp = roomState.players.find((p) => p.userId !== myId);

        if (me) setPlayerProgress(me.progress || 0);
        if (opp) setOpponentProgress(opp.progress || 0);
      };

      const handleAbility = (data) => {
        const myId = socket.user?.id;
        if (data.toUserId === myId) {
          if (data.blocked) {
            sounds.playShield();
            addCombatLog('🛡️ FIREWALL blocked incoming Opponent attack!');
          } else if (data.abilityId === 'fog') {
            sounds.playGlitch();
            setScreenEffect('glitch');
            addCombatLog('⚠️ Opponent deployed [Syntax Fog]! Your view is disrupted for 3s!');
            setTimeout(() => setScreenEffect(null), 3000);
          }
        }
      };

      const handleEnded = (data) => {
        const myId = socket.user?.id;
        const didWin = data.winnerId === myId || data.winnerUserId === myId;
        handleFinishBattle(didWin, data);
      };

      socket.on('battle:progress', handleProgress);
      socket.on('battle:ability', handleAbility);
      socket.on('battle:ended', handleEnded);

      return () => {
        socket.off('battle:progress', handleProgress);
        socket.off('battle:ability', handleAbility);
        socket.off('battle:ended', handleEnded);
      };
    }
  }, [matchId]);

  const addCombatLog = (msg) => {
    setCombatLogs((prev) => [...prev.slice(-3), { id: Date.now(), text: msg }]);
  };

  // Code typing generates progress AND Charge
  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);

    const baseLength = problem.starterCode?.[language]?.length || 100;
    const typedDelta = Math.max(0, newCode.length - baseLength);
    const calculatedProgress = Math.min(95, Math.floor(20 + (typedDelta / 12)));
    setPlayerProgress(calculatedProgress);

    // Build Charge (up to 100)
    setCharge((prev) => Math.min(100, Math.floor(35 + (typedDelta / 8))));

    if (matchId) {
      socketApi.sendCodeUpdate(matchId, newCode, language);
    }
  };

  // Handle Tab key in textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      setCode(newValue);
      if (matchId) {
        socketApi.sendCodeUpdate(matchId, newValue, language);
      }
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // Tactical Abilities Handlers
  const handleUseAbility = (ability) => {
    setCharge((prev) => Math.max(0, prev - ability.cost));

    if (matchId) {
      socketApi.useBattleAbility(matchId, ability.id);
    }

    if (ability.id === 'hint') {
      const nextHintIdx = unlockedHints.length;
      if (problem.hints && problem.hints[nextHintIdx]) {
        setUnlockedHints((prev) => [...prev, nextHintIdx]);
        setActiveHintToast(problem.hints[nextHintIdx]);
      } else {
        setActiveHintToast("Conceptual Strategy: Focus on building an iterative DP state or maintaining a monotonic stack to avoid redundant computations.");
      }
      addCombatLog('💡 [HINT] activated! Conceptual insight unlocked.');
    } 
    else if (ability.id === 'scan') {
      setActiveScanToast([
        '⚠️ Empty Array / Length Zero: Ensure base case returns default when n == 0.',
        '⚠️ Negative Numbers: Check if absolute speed or delta signs cause infinite loop.',
        '⚠️ Stack Overflow: Ensure recursion bounds terminate before 10^5 depth.'
      ]);
      addCombatLog('🔍 [CODE SCAN] complete! Edge case warnings generated.');
    } 
    else if (ability.id === 'firewall') {
      setHasFirewall(true);
      addCombatLog('🛡️ [FIREWALL] activated! Next incoming Syntax Fog will be blocked.');
    } 
    else if (ability.id === 'fog') {
      setOpponentProgress((prev) => Math.max(10, prev - 15));
      addCombatLog('🌫️ [SYNTAX FOG] deployed! Opponent UI disrupted and momentum dropped.');
    }
  };

  // Run Test Cases
  const handleRunTests = () => {
    sounds.playSelect();
    setIsTesting(true);
    setIsTerminalOpen(true);
    addCombatLog('🧪 Running test suite against sample test cases...');

    const localResult = runSimulatedJudge({ code, language, problem, mode: 'run' });
    setTestCasesResults(localResult.results);

    if (matchId) {
      socketApi.runBattleCode(matchId, (res) => {
        setIsTesting(false);
        const verdict = res?.result?.verdict || localResult;
        if (verdict.results) setTestCasesResults(verdict.results);
        if (verdict.allPassed) {
          sounds.playTestCasePass(1);
          setPlayerProgress((prev) => Math.min(98, Math.max(prev, 75)));
          setCharge((prev) => Math.min(100, prev + 20));
          addCombatLog(`✅ Sandbox tests passed (${verdict.passed}/${verdict.total}). +20 Charge earned!`);
        } else {
          addCombatLog(`❌ Sandbox tests failed (${verdict.passed}/${verdict.total} passed).`);
        }
      });
    } else {
      setTimeout(() => {
        setIsTesting(false);
        if (localResult.allPassed) {
          sounds.playTestCasePass(1);
          setPlayerProgress((prev) => Math.min(98, Math.max(prev, 75)));
          setCharge((prev) => Math.min(100, prev + 20));
          addCombatLog(`✅ Sandbox tests passed (${localResult.passed}/${localResult.total}). +20 Charge earned!`);
        } else {
          addCombatLog(`❌ Sandbox tests failed (${localResult.passed}/${localResult.total} passed).`);
        }
      }, 600);
    }
  };

  // Submit Solution
  const handleSubmit = () => {
    sounds.playClick();
    setIsJudging(true);
    addCombatLog('🚀 Final solution dispatched to Judging Matrix...');

    const localResult = runSimulatedJudge({ code, language, problem, mode: 'submit' });
    setTestCasesResults(localResult.results);

    if (matchId) {
      socketApi.submitBattleCode(matchId, (res) => {
        setIsJudging(false);
        const verdict = res?.result?.verdict || localResult;
        if (verdict.results) setTestCasesResults(verdict.results);
        if (verdict.allPassed) {
          addCombatLog('🏆 All test cases passed! Victory!');
        } else {
          addCombatLog(`❌ Submission failed: ${verdict.passed}/${verdict.total} test cases passed.`);
        }
      });
    } else {
      setTimeout(() => {
        setIsJudging(false);
        if (localResult.allPassed) {
          addCombatLog('🏆 All test cases passed! Victory!');
          handleFinishBattle(true);
        } else {
          addCombatLog(`❌ Submission failed: ${localResult.passed}/${localResult.total} test cases passed.`);
          setIsTerminalOpen(true);
        }
      }, 1500);
    }
  };

  const handleFinishBattle = (didWin = true, endedData = null) => {
    setIsJudging(false);
    onBattleComplete({
      didWin,
      timeTakenSec: 15 * 60 - timeLeft,
      ratingChange: endedData?.ratingChange || (didWin ? 42 : -15),
      accuracy: '100%',
      cpm: Math.floor((code.length / Math.max(1, (15 * 60 - timeLeft))) * 60) || 54,
      problem,
      opponent: matchData?.opponent
    });
  };

  const handleUnlockHint = (idx) => {
    sounds.playSelect();
    if (!unlockedHints.includes(idx)) {
      setUnlockedHints([...unlockedHints, idx]);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const isUnderOneMin = timeLeft <= 60;

  return (
    <div className={`min-h-[calc(100vh-60px)] flex flex-col justify-between py-3 px-3 sm:px-6 max-w-7xl mx-auto w-full font-sans relative transition-all duration-300 ${
      screenEffect === 'glitch' ? 'animate-glitch filter hue-rotate-90' : ''
    }`}>
      
      {/* Top Combat HUD Header */}
      <div className="w-full bg-arena-panel rounded-xl border border-arena-border p-3 shadow-lg flex flex-wrap items-center justify-between gap-3 font-mono">
        
        {/* Match Tags */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-player/10 text-player border border-player/30">
            {isTeam ? '2V2 SQUAD' : '1V1 DUEL'}
          </span>
          <span className="text-xs text-white font-semibold flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-player" /> {problem.company}
          </span>
          <span className="text-arena-muted">•</span>
          <span className="text-xs text-slate-300 flex items-center gap-1">
            <BrainCircuit className="w-3.5 h-3.5 text-opponent" /> {problem.topic}
          </span>
        </div>

        {/* 15:00 Countdown Timer */}
        <div className={`flex items-center gap-2 px-4 py-1 rounded-lg border font-mono ${
          isUnderOneMin 
            ? 'bg-rose-950/60 border-rose-500 text-rose-400 animate-pulse text-glow-opponent' 
            : 'bg-arena-card border-arena-border text-white'
        }`}>
          <Clock className={`w-4 h-4 ${isUnderOneMin ? 'text-rose-400' : 'text-player'}`} />
          <span className="text-lg font-black tracking-wider">
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Exit / Forfeit */}
        <button
          onClick={() => {
            sounds.playClick();
            if (confirm("Forfeit match and return to arena?")) {
              onForfeit();
            }
          }}
          className="text-xs text-arena-muted hover:text-rose-400 font-mono px-2.5 py-1 rounded bg-arena-card hover:bg-rose-950/20 border border-arena-border hover:border-rose-900 transition-colors"
        >
          FORFEIT
        </button>

      </div>

      {/* Real-time Racing Velocity Bars */}
      <div className="my-2">
        <RacingBar 
          playerProgress={playerProgress}
          opponentProgress={opponentProgress}
          isTeamMode={isTeam}
          teammateProgress={teammateProgress}
          opponentTeammateProgress={opponentTeammateProgress}
          playerName="You"
          opponentName={matchData?.opponent?.username || "Opponent"}
          teammateName={matchData?.teammate?.username || "Teammate"}
          opponentTeammateName={matchData?.opponentTeammate?.username || "Opponent 2"}
        />
      </div>

      {/* Redesigned Tactical Abilities Deck */}
      <div className="my-1.5">
        <PowerUpDeck 
          charge={charge}
          onUseAbility={handleUseAbility}
          activeAbilities={activeAbilities}
          hasFirewall={hasFirewall}
        />
      </div>

      {/* Active Hint Popup Modal */}
      {activeHintToast && (
        <div className="mb-2 bg-amber-500/10 border border-amber-500/40 rounded-xl p-3 flex items-start justify-between gap-3 animate-in fade-in duration-200 font-mono">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase">CONCEPTUAL HINT ACTIVATED</span>
              <p className="text-xs text-slate-200 mt-0.5">{activeHintToast}</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveHintToast(null)}
            className="text-arena-muted hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Code Scan Popup Modal */}
      {activeScanToast && (
        <div className="mb-2 bg-sky-500/10 border border-sky-500/40 rounded-xl p-3 flex items-start justify-between gap-3 animate-in fade-in duration-200 font-mono">
          <div className="flex items-start gap-2">
            <Search className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-sky-300 uppercase">CODE SCAN // EDGE CASE WARNINGS</span>
              <ul className="text-xs text-slate-200 mt-1 space-y-0.5 list-disc list-inside">
                {activeScanToast.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
          <button 
            onClick={() => setActiveScanToast(null)}
            className="text-arena-muted hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Split Layout: Left Problem | Right Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[440px]">
        
        {/* LEFT PANEL: Problem Workspace (5 Cols) */}
        <div className="lg:col-span-5 bg-arena-panel rounded-xl border border-arena-border p-4 flex flex-col justify-between overflow-y-auto max-h-[520px] shadow-lg">
          <div className="space-y-4">
            
            {/* Title & Badges */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                  problem.difficulty === 'Hard' 
                    ? 'bg-rose-950/40 border-rose-800 text-rose-400' 
                    : 'bg-amber-950/40 border-amber-800 text-amber-400'
                }`}>
                  {problem.difficulty}
                </span>
                <span className="text-[10px] font-mono text-arena-muted bg-arena-card px-2 py-0.5 rounded border border-arena-border">
                  ⏱️ {problem.timeLimit}
                </span>
                <span className="text-[10px] font-mono text-arena-muted bg-arena-card px-2 py-0.5 rounded border border-arena-border">
                  💾 {problem.memoryLimit}
                </span>
              </div>

              <h2 className="text-lg font-black text-white font-mono leading-tight">
                {problem.title}
              </h2>
            </div>

            {/* Problem Narrative Description */}
            <div className="text-xs text-slate-300 leading-relaxed space-y-2.5 font-sans border-t border-arena-border/60 pt-3 whitespace-pre-line">
              {problem.description}
            </div>

            {/* Examples */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-300">
                EXAMPLE TEST VECTORS:
              </h4>

              {problem.examples?.map((ex, i) => (
                <div key={i} className="bg-arena-card rounded-lg p-3 border border-arena-border text-xs font-mono space-y-1">
                  <div className="text-player">
                    <span className="text-arena-muted">Input: </span>
                    <code>{ex.input}</code>
                  </div>
                  <div className="text-emerald-400">
                    <span className="text-arena-muted">Output: </span>
                    <code>{ex.output}</code>
                  </div>
                  {ex.explanation && (
                    <p className="text-[11px] text-arena-muted font-sans italic pt-1 border-t border-arena-border/40">
                      {ex.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-1.5 pt-2">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-300">
                SYSTEM CONSTRAINTS:
              </h4>
              <ul className="list-disc list-inside text-[11px] font-mono text-slate-400 space-y-0.5">
                {problem.constraints?.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Hints Accordion */}
            {problem.hints && problem.hints.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-arena-border/60">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300">
                  <HelpCircle className="w-3.5 h-3.5 text-player" />
                  <span>TACTICAL HINTS ({unlockedHints.length}/{problem.hints.length})</span>
                </div>

                {problem.hints.map((hint, idx) => {
                  const isUnlocked = unlockedHints.includes(idx);
                  return (
                    <div key={idx} className="bg-arena-card rounded-lg border border-arena-border p-2.5 text-xs">
                      {isUnlocked ? (
                        <p className="text-player font-mono text-[11px]">💡 {hint}</p>
                      ) : (
                        <button
                          onClick={() => handleUnlockHint(idx)}
                          className="flex items-center justify-between w-full text-arena-muted hover:text-white font-mono text-[11px]"
                        >
                          <span>Unlock Hint #{idx + 1}</span>
                          <span className="text-player flex items-center gap-1">
                            <Eye className="w-3 h-3" /> Reveal
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

        {/* RIGHT PANEL: Code Editor & Execution Harness (7 Cols) */}
        <div className="lg:col-span-7 bg-arena-panel rounded-xl border border-arena-border flex flex-col justify-between overflow-hidden shadow-xl">
          
          {/* Editor Header / Language Switcher */}
          <div className="bg-arena-card px-4 py-2.5 border-b border-arena-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-player" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                COMPILER ENGINE
              </span>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-arena-bg text-player font-mono text-xs font-semibold px-3 py-1 rounded-lg border border-player/30 focus:outline-none focus:border-player cursor-pointer"
              >
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="python">Python 3.11</option>
                <option value="cpp">C++ 20</option>
                <option value="java">Java 17 (OpenJDK)</option>
              </select>
            </div>
          </div>

          {/* Monospace Code Editor Area */}
          <div className="relative flex-1 bg-[#0a0e17] min-h-[260px]">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              className="w-full h-full min-h-[260px] p-4 bg-transparent text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-player/30"
              placeholder="// Write your solution here..."
            />
          </div>

          {/* Interactive Test Terminal Drawer */}
          <TerminalOutput 
            testCases={testCasesResults || problem.testCases}
            isRunning={isTesting}
            isOpen={isTerminalOpen}
            onToggle={() => setIsTerminalOpen(!isTerminalOpen)}
          />

          {/* Action Bar (Run Tests + Submit Solution) */}
          <div className="bg-arena-card p-3 border-t border-arena-border flex flex-wrap items-center justify-between gap-3 font-mono">
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-arena-panel hover:bg-arena-cardHover px-3 py-2 rounded-lg border border-arena-border transition-colors"
              >
                <TerminalIcon className="w-3.5 h-3.5 text-player" />
                <span>Console {isTerminalOpen ? '▼' : '▲'}</span>
              </button>

              <button
                onClick={handleRunTests}
                disabled={isTesting}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-arena-panel hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-600 transition-all hover:scale-105"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                <span>{isTesting ? 'Sandboxing...' : 'Run Tests'}</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 text-xs font-bold text-arena-bg bg-player hover:bg-player-light px-6 py-2 rounded-lg glow-player transition-all hover:scale-105 shadow-md shadow-player/30 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 fill-arena-bg" />
              <span>SUBMIT SOLUTION</span>
            </button>

          </div>

        </div>

      </div>

      {/* Bottom Live Combat Ticker Bar */}
      <div className="mt-2 w-full bg-arena-panel/80 rounded-lg border border-arena-border/70 py-1.5 px-4 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-player animate-ping"></span>
          <span className="text-player font-bold uppercase">ARENA LOG:</span>
          <span className="text-slate-300 truncate">
            {combatLogs[combatLogs.length - 1]?.text}
          </span>
        </div>
        <span className="hidden sm:inline text-arena-muted">
          Chars: {code.length} • Charge: {charge}/100
        </span>
      </div>

      {/* Dramatic Judging Matrix Overlay */}
      {isJudging && (
        <JudgingModal 
          totalTests={5}
          onComplete={() => handleFinishBattle(true)}
        />
      )}

    </div>
  );
};
