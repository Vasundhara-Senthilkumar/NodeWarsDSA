import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { StatsTicker } from './components/StatsTicker';
import { AuthModal } from './components/AuthModal';
import { LoginScreen } from './screens/LoginScreen';
import { LandingScreen } from './screens/LandingScreen';
import { SelectionScreen } from './screens/SelectionScreen';
import { MatchmakingScreen } from './screens/MatchmakingScreen';
import { BattleScreen } from './screens/BattleScreen';
import { ResultScreen } from './screens/ResultScreen';
import { CURRENT_USER } from './data/mockData';

export function App() {
  // Navigation & Screen State: 'login' | 'landing' | 'selection' | 'matchmaking' | 'battle' | 'result'
  const [currentScreen, setCurrentScreen] = useState('login');
  
  // Game & Match Configuration
  const [matchMode, setMatchMode] = useState('solo'); // 'solo' | 'team'
  const [matchConfig, setMatchConfig] = useState(null);
  const [activeMatchData, setActiveMatchData] = useState(null);
  const [battleResult, setBattleResult] = useState(null);

  // User Profile & Auth State
  const [currentUser, setCurrentUser] = useState({
    ...CURRENT_USER,
    isLoggedIn: false
  });
  const [userRating, setUserRating] = useState(CURRENT_USER.rating);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Handlers
  const handleSelectMode = (mode) => {
    setMatchMode(mode);
    setCurrentScreen('selection');
  };

  const handleFindMatch = (config) => {
    setMatchConfig(config);
    setCurrentScreen('matchmaking');
  };

  const handleMatchReady = (fullMatchData) => {
    setActiveMatchData({
      ...fullMatchData,
      player: currentUser
    });
    setCurrentScreen('battle');
  };

  const handleBattleComplete = (result) => {
    setBattleResult(result);
    if (result.didWin) {
      setUserRating((prev) => prev + (result.ratingChange || 42));
      setCurrentUser((prev) => ({
        ...prev,
        rating: prev.rating + (result.ratingChange || 42),
        winStreak: prev.winStreak + 1,
        duelsFought: prev.duelsFought + 1
      }));
    } else {
      setUserRating((prev) => Math.max(1200, prev + (result.ratingChange || -15)));
      setCurrentUser((prev) => ({
        ...prev,
        rating: Math.max(1200, prev.rating + (result.ratingChange || -15)),
        winStreak: 0,
        duelsFought: prev.duelsFought + 1
      }));
    }
    setCurrentScreen('result');
  };

  const handlePlayAgain = () => {
    setCurrentScreen('selection');
  };

  const handleNavigateHome = () => {
    setCurrentScreen('landing');
  };

  const handleAuthSuccess = (userProfile) => {
    setCurrentUser({ ...userProfile, isLoggedIn: true });
    setUserRating(userProfile.rating);
  };

  return (
    <div className="min-h-screen bg-arena-bg text-arena-text flex flex-col antialiased selection:bg-player/20 selection:text-player">
      
      {/* Top Cyber Navigation Bar (Only after login) */}
      {currentScreen !== 'login' && (
        <Navbar 
          onNavigateHome={handleNavigateHome} 
          activeScreen={currentScreen}
          currentUser={currentUser}
          currentRating={currentUser.rating}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      )}

      {/* Screen Routing */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'login' && (
          <LoginScreen 
            onLoginSuccess={(userProfile) => {
              handleAuthSuccess(userProfile);
              setCurrentScreen('landing');
            }}
          />
        )}

        {currentScreen === 'landing' && (
          <LandingScreen 
            onSelectMode={handleSelectMode} 
            currentUser={currentUser}
          />
        )}

        {currentScreen === 'selection' && (
          <SelectionScreen 
            mode={matchMode} 
            onBack={handleNavigateHome} 
            onFindMatch={handleFindMatch} 
          />
        )}

        {currentScreen === 'matchmaking' && (
          <MatchmakingScreen 
            matchConfig={matchConfig} 
            currentUser={currentUser}
            onMatchReady={handleMatchReady} 
          />
        )}

        {currentScreen === 'battle' && (
          <BattleScreen 
            matchData={activeMatchData} 
            onBattleComplete={handleBattleComplete} 
            onForfeit={handleNavigateHome}
          />
        )}

        {currentScreen === 'result' && (
          <ResultScreen 
            battleResult={battleResult} 
            currentUser={currentUser}
            onPlayAgain={handlePlayAgain} 
            onHome={handleNavigateHome} 
          />
        )}
      </main>

      {/* Login & Sign Up Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

    </div>
  );
}

export default App;
