import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Code2, 
  Layers, 
  FileCode, 
  BrainCircuit, 
  GitFork, 
  Network, 
  Repeat, 
  ArrowLeft, 
  Swords, 
  Check, 
  Flame,
  ShieldCheck
} from 'lucide-react';
import { sounds } from '../utils/soundEngine';
import { COMPANIES as MOCK_COMPANIES, TOPICS as MOCK_TOPICS } from '../data/mockData';
import { api } from '../services/api';

export const SelectionScreen = ({ mode = 'solo', onBack, onFindMatch }) => {
  const [companiesList, setCompaniesList] = useState(MOCK_COMPANIES);
  const [topicsList, setTopicsList] = useState(MOCK_TOPICS);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    Promise.all([api.getCompanies(), api.getTopics()])
      .then(([fetchedCompanies, fetchedTopics]) => {
        if (fetchedCompanies && fetchedCompanies.length > 0) setCompaniesList(fetchedCompanies);
        if (fetchedTopics && fetchedTopics.length > 0) setTopicsList(fetchedTopics);
      })
      .catch((err) => console.log('Using local fallback companies/topics metadata:', err.message));
  }, []);

  const getTopicIcon = (iconName) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'FileCode': return <FileCode className="w-5 h-5" />;
      case 'BrainCircuit': return <BrainCircuit className="w-5 h-5" />;
      case 'GitFork': return <GitFork className="w-5 h-5" />;
      case 'Network': return <Network className="w-5 h-5" />;
      case 'Repeat': return <Repeat className="w-5 h-5" />;
      default: return <Code2 className="w-5 h-5" />;
    }
  };

  const handleSelectCompany = (comp) => {
    sounds.playSelect();
    setSelectedCompany(comp);
  };

  const handleSelectTopic = (top) => {
    sounds.playSelect();
    setSelectedTopic(top);
  };

  const isReady = selectedCompany && selectedTopic;

  const handleStartMatchmaking = () => {
    if (!isReady) return;
    sounds.playClick();
    onFindMatch({
      mode,
      company: selectedCompany,
      topic: selectedTopic
    });
  };

  return (
    <div className="min-h-[calc(100vh-60px)] py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full cyber-grid flex flex-col justify-between">
      
      {/* Top Header & Navigation */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-arena-border">
          <button
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="flex items-center gap-2 text-xs font-mono text-arena-muted hover:text-white bg-arena-panel hover:bg-arena-card px-3 py-2 rounded-lg border border-arena-border transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>CHANGE MODE</span>
          </button>

          {/* Mode Indicator Chip */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-arena-muted">DEPLOYMENT:</span>
            <span className={`text-xs font-mono font-bold uppercase px-3 py-1 rounded-full border ${
              mode === 'solo' 
                ? 'bg-player/10 border-player/40 text-player shadow-sm shadow-player/20' 
                : 'bg-opponent/10 border-opponent/40 text-opponent shadow-sm shadow-opponent/20'
            }`}>
              {mode === 'solo' ? '⚡ 1V1 SOLO DUEL' : '🔥 2V2 SQUAD CLASH'}
            </span>
          </div>
        </div>

        {/* Section 1: Target Company Grid */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-player" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                STEP 1: SELECT TARGET TECH GIANT
              </h2>
            </div>
            <span className="text-xs font-mono text-arena-muted">
              {selectedCompany ? `SELECTED: ${selectedCompany.name.toUpperCase()}` : 'PICK 1 COMPANY'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {companiesList.map((company) => {
              const isSelected = selectedCompany?.id === company.id;
              return (
                <div
                  key={company.id}
                  onClick={() => handleSelectCompany(company)}
                  className={`relative p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-arena-cardHover border-player glow-player scale-[1.02]'
                      : 'bg-arena-panel border-arena-border hover:border-slate-600 hover:bg-arena-card'
                  }`}
                >
                  {/* Selection Checkmark */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-player text-arena-bg flex items-center justify-center font-black">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div>
                    {/* Logo Box & Tier */}
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-black font-mono text-base text-white shadow-md"
                        style={{ backgroundColor: `${company.accentColor}33`, borderColor: company.accentColor, borderWidth: 1 }}
                      >
                        {company.logoText}
                      </div>
                      <span className="text-[10px] font-mono text-arena-muted bg-arena-card px-1.5 py-0.5 rounded border border-arena-border">
                        {company.difficulty}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white font-mono">
                      {company.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                      {company.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-arena-border/60 text-[10px] font-mono text-player truncate">
                    {company.perk}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Topic Selection Grid */}
        <div className="space-y-3 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-opponent" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                STEP 2: SELECT DSA BATTLE DOMAIN
              </h2>
            </div>
            <span className="text-xs font-mono text-arena-muted">
              {selectedTopic ? `SELECTED: ${selectedTopic.name.toUpperCase()}` : 'PICK 1 TOPIC'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {topicsList.map((topic) => {
              const isSelected = selectedTopic?.id === topic.id;
              return (
                <div
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className={`relative p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-arena-cardHover border-opponent glow-opponent scale-[1.02]'
                      : 'bg-arena-panel border-arena-border hover:border-slate-600 hover:bg-arena-card'
                  }`}
                >
                  {/* Selection Checkmark */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-opponent text-arena-bg flex items-center justify-center font-black">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                      isSelected ? 'bg-opponent/20 text-opponent' : 'bg-arena-card text-slate-400'
                    }`}>
                      {getTopicIcon(topic.icon)}
                    </div>

                    <h4 className="text-xs font-bold text-white font-mono leading-snug">
                      {topic.name}
                    </h4>
                    <p className="text-[10px] text-arena-muted mt-1 line-clamp-2 leading-tight">
                      {topic.summary}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-arena-border/60 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">{topic.difficulty}</span>
                    <span className="text-emerald-400">{topic.popularity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="mt-8 pt-4 pb-2 border-t border-arena-border bg-arena-panel/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        
        {/* Selection Summary */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="text-arena-muted">MATCH MATRIX:</span>
          <span className="bg-arena-card px-2.5 py-1 rounded border border-arena-border text-white flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-player" />
            <span>{selectedCompany ? selectedCompany.name : 'Choose Company'}</span>
          </span>
          <span className="text-arena-muted">+</span>
          <span className="bg-arena-card px-2.5 py-1 rounded border border-arena-border text-white flex items-center gap-1.5">
            <BrainCircuit className="w-3.5 h-3.5 text-opponent" />
            <span>{selectedTopic ? selectedTopic.name : 'Choose Topic'}</span>
          </span>
        </div>

        {/* Find Match Button */}
        <button
          disabled={!isReady}
          onClick={handleStartMatchmaking}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
            isReady
              ? 'bg-player text-arena-bg hover:bg-player-light glow-player-lg shadow-lg shadow-player/30 hover:scale-105 cursor-pointer'
              : 'bg-arena-card text-arena-muted border border-arena-border cursor-not-allowed opacity-60'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>{isReady ? 'ENTER ARENA / FIND MATCH' : 'SELECT COMPANY & TOPIC'}</span>
        </button>

      </div>

    </div>
  );
};
