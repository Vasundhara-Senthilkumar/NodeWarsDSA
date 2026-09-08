import React, { useState, useEffect, useRef } from 'react';
import { Cpu, CheckCircle2, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEngine';

export const JudgingModal = ({ onComplete, totalTests = 5 }) => {
  const [passedTests, setPassedTests] = useState(0);
  const [statusMessage, setStatusMessage] = useState('ALLOCATING SECURE SANDBOX...');
  
  // Use ref for onComplete to prevent re-triggering effect when parent re-renders
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    sounds.playSelect();

    const messages = [
      'ALLOCATING SECURE SANDBOX...',
      'EVALUATING INPUT EDGES & STRESS DATA...',
      'TESTING ASYMPTOTIC MEMORY BOUNDS...',
      'VERIFYING SUBTREE EQUIVALENCE...',
      'FINALIZING TIME COMPLEXITY VECTOR...',
      'ALL CASES VALIDATED! SYNCHRONIZING ARENA SEED...'
    ];

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setPassedTests(current);
      sounds.playTestCasePass(current);
      
      if (messages[current]) {
        setStatusMessage(messages[current]);
      }

      if (current >= totalTests) {
        clearInterval(interval);
        setTimeout(() => {
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
        }, 500);
      }
    }, 420);

    return () => clearInterval(interval);
  }, [totalTests]); // totalTests is stable number

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-arena-panel border-2 border-player rounded-2xl max-w-lg w-full p-8 relative glow-player-lg text-center flex flex-col items-center overflow-hidden">
        
        {/* Ambient background beam */}
        <div className="absolute inset-0 ambient-glow-cyan pointer-events-none"></div>

        {/* Animated Cyber Core / Energy Rings */}
        <div className="relative w-32 h-32 my-4 flex items-center justify-center">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-player/60 animate-spin" style={{ animationDuration: '6s' }}></div>
          {/* Inner counter-rotating ring */}
          <div className="absolute inset-3 rounded-full border-2 border-player/40 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
          {/* Center core pulse */}
          <div className="w-16 h-16 rounded-full bg-player/20 border-2 border-player flex items-center justify-center animate-pulse shadow-lg shadow-player/50">
            <Cpu className="w-8 h-8 text-player animate-bounce" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-white font-mono tracking-wider flex items-center gap-2">
          JUDGING MATRIX <span className="text-player text-glow-player">//</span> RUNNING
        </h2>

        {/* Dynamic Status Text */}
        <p className="text-xs font-mono text-player/90 mt-2 tracking-widest uppercase animate-pulse">
          {statusMessage}
        </p>

        {/* Ticking Test Cases Count */}
        <div className="my-6 w-full bg-arena-card/90 rounded-xl p-4 border border-arena-border">
          <div className="flex items-center justify-between font-mono mb-2">
            <span className="text-xs text-arena-muted uppercase font-bold">TEST VECTORS EVALUATED</span>
            <span className="text-base font-extrabold text-player text-glow-player">
              {passedTests} / {totalTests} PASSED
            </span>
          </div>

          {/* Test Case Step Dots / Bar */}
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: totalTests }).map((_, i) => (
              <div 
                key={i}
                className={`h-3 rounded-md flex items-center justify-center transition-all duration-300 ${
                  i < passedTests 
                    ? 'bg-player border border-cyan-200 shadow-md shadow-player/60 scale-105' 
                    : 'bg-arena-panel border border-arena-border'
                }`}
              >
                {i < passedTests && <CheckCircle2 className="w-2.5 h-2.5 text-arena-bg font-black" />}
              </div>
            ))}
          </div>
        </div>

        {/* Subtitle */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-arena-muted">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>ZERO TIMEOUTS DETECTED • OPTIMAL SPACE COMPLEXITY</span>
        </div>

      </div>
    </div>
  );
};
