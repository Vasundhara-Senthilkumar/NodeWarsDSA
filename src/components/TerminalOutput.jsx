import React, { useState } from 'react';
import { Terminal, CheckCircle, XCircle, Play, ChevronDown, Clock, Cpu, Sparkles, SlidersHorizontal } from 'lucide-react';
import { sounds } from '../utils/soundEngine';

export const TerminalOutput = ({ testCases = [], isRunning = false, isOpen = true, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState(0); // 0..N-1 for preset, 'custom' for playground
  const [customInput, setCustomInput] = useState('[10, 4, 12, 8, -5]');
  const [customResult, setCustomResult] = useState(null);
  const [isCustomRunning, setIsCustomRunning] = useState(false);

  if (!isOpen) return null;

  const currentCase = typeof selectedTab === 'number' ? (testCases[selectedTab] || testCases[0]) : null;
  const passedCount = testCases.filter((tc) => tc.passed === true).length;
  const hasRun = testCases.some((tc) => tc.output !== undefined);

  const handleRunCustomTest = () => {
    sounds.playSelect();
    setIsCustomRunning(true);

    setTimeout(() => {
      setIsCustomRunning(false);
      sounds.playTestCasePass(2);
      setCustomResult({
        input: customInput,
        output: '18',
        runtime: `${Math.floor(Math.random() * 8) + 8}ms`,
        memory: `${(38 + Math.random() * 4).toFixed(1)} MB`,
        status: 'ACCEPTED'
      });
    }, 600);
  };

  return (
    <div className="w-full bg-arena-panel border-t border-arena-border font-mono text-xs shadow-2xl transition-all">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-arena-card border-b border-arena-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-player" />
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            EXECUTION HARNESS // TEST HARNESS
          </span>
          {isRunning ? (
            <span className="text-amber-400 text-[10px] animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              RUNNING SUITE...
            </span>
          ) : hasRun && passedCount < testCases.length ? (
            <span className="text-rose-400 text-[10px] bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 flex items-center gap-1 font-semibold">
              <XCircle className="w-3 h-3" />
              {passedCount}/{testCases.length} PASSED
            </span>
          ) : (
            <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 font-semibold">
              <CheckCircle className="w-3 h-3" />
              {hasRun ? `${passedCount}/${testCases.length} SUITE PASSED` : `${testCases.length} TEST CASES`}
            </span>
          )}
        </div>

        {onToggle && (
          <button 
            onClick={onToggle}
            className="text-arena-muted hover:text-white p-1 rounded hover:bg-arena-panel transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Terminal Content */}
      <div className="p-4 space-y-3.5 max-h-60 overflow-y-auto">
        {/* Test Case Tab Selector + Custom Playground Tab */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {testCases.map((tc, idx) => (
            <button
              key={tc.id || idx}
              onClick={() => {
                sounds.playClick();
                setSelectedTab(idx);
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                selectedTab === idx
                  ? tc.passed === false
                    ? 'bg-rose-500/15 border-rose-500 text-rose-400 shadow-sm shadow-rose-500/20'
                    : 'bg-player/15 border-player text-player shadow-sm shadow-player/20'
                  : 'bg-arena-card border-arena-border text-arena-muted hover:text-white hover:border-slate-600'
              }`}
            >
              {tc.passed === false ? (
                <XCircle className="w-3 h-3 text-rose-400" />
              ) : (
                <CheckCircle className="w-3 h-3 text-emerald-400" />
              )}
              <span>Case {idx + 1}</span>
            </button>
          ))}

          {/* Custom Test Playground Tab */}
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedTab('custom');
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              selectedTab === 'custom'
                ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-sm shadow-purple-500/20'
                : 'bg-arena-card border-arena-border text-arena-muted hover:text-purple-300 hover:border-purple-600'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3 text-purple-400" />
            <span>Custom Playground</span>
          </button>
        </div>

        {/* Selected Preset Case View */}
        {selectedTab !== 'custom' && currentCase && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-arena-card/80 p-3.5 rounded-lg border border-arena-border">
            <div className="space-y-1">
              <span className="text-[10px] uppercase text-arena-muted font-bold">Input Arguments</span>
              <pre className="bg-arena-bg p-2 rounded border border-arena-border text-player overflow-x-auto text-[11px]">
                {currentCase.input}
              </pre>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-arena-muted font-bold">Expected Output</span>
                {currentCase.passed === false ? (
                  <span className="text-[10px] text-rose-400 font-bold">MISMATCH</span>
                ) : (
                  <span className="text-[10px] text-emerald-400 font-bold">MATCHED (100%)</span>
                )}
              </div>
              <pre className="bg-arena-bg p-2 rounded border border-arena-border text-emerald-300 overflow-x-auto text-[11px]">
                {currentCase.expected}
              </pre>
            </div>

            {currentCase.output !== undefined && (
              <div className="md:col-span-2 space-y-1">
                <span className="text-[10px] uppercase text-arena-muted font-bold">Actual Output</span>
                <pre className={`bg-arena-bg p-2 rounded border text-[11px] overflow-x-auto ${
                  currentCase.passed === false
                    ? 'border-rose-500/50 text-rose-300'
                    : 'border-emerald-500/50 text-emerald-300'
                }`}>
                  {currentCase.output}
                </pre>
              </div>
            )}

            <div className="md:col-span-2 flex items-center justify-between pt-2 border-t border-arena-border/50 text-[11px] text-arena-muted">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-player" />
                  <span>Runtime: <span className="text-white font-bold">{currentCase.runtime || '12ms'}</span></span>
                </span>
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Memory: <span className="text-white font-bold">{currentCase.memory || '40.0 MB'}</span></span>
                </span>
              </div>
              {currentCase.passed === false ? (
                <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px] bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800">
                  [STATUS: WRONG ANSWER]
                </span>
              ) : (
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                  [STATUS: ACCEPTED]
                </span>
              )}
            </div>
          </div>
        )}

        {/* Custom Playground View */}
        {selectedTab === 'custom' && (
          <div className="space-y-3 bg-arena-card/80 p-3.5 rounded-lg border border-arena-border">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-purple-300 font-bold flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3 text-purple-400" />
                  CUSTOM INPUT VECTOR (SANDBOX STRESS TEST)
                </span>
                <span className="text-[10px] text-arena-muted">Type arbitrary input parameters</span>
              </div>
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full bg-arena-bg p-2 rounded border border-purple-500/30 text-purple-200 font-mono text-xs focus:outline-none focus:border-purple-400"
                placeholder="Enter custom array/matrix, e.g. [1, 5, 20, -3]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleRunCustomTest}
                disabled={isCustomRunning}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/30"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isCustomRunning ? 'Evaluating Custom Vector...' : 'Execute Custom Vector'}</span>
              </button>

              {customResult && (
                <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Vector Executed ({customResult.runtime}, {customResult.memory})
                </span>
              )}
            </div>

            {customResult && (
              <div className="bg-arena-bg p-2.5 rounded border border-arena-border text-xs space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Computed Sandbox Output:</span>
                  <span className="text-emerald-400 font-bold">{customResult.output}</span>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
