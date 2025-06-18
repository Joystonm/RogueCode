import React, { useEffect, useState } from 'react';
import Terminal from './components/Terminal';
import StatusBar from './components/StatusBar';
import MissionPopup from './components/Popups/MissionPopup';
import AlertBox from './components/Popups/AlertBox';
import SkillTree from './components/Popups/SkillTree';
import Inventory from './components/Popups/Inventory';
import { GameProvider, useGameContext } from './context/GameContext';
import soundManager from './utils/soundManager';
import { gsap } from 'gsap';
import './styles/App.css';
import './styles/animations.css';

// Main App component
function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize game
  useEffect(() => {
    // Initialize sound manager
    soundManager.init();
    
    // Simulate loading time
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      
      // Play ambient music when loading completes
      soundManager.playMusic('ambient');
    }, 2000);
    
    return () => {
      clearTimeout(loadingTimer);
      
      // Stop all sounds when component unmounts
      soundManager.stopMusic();
    };
  }, []);

  return (
    <GameProvider>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <GameScreen />
      )}
    </GameProvider>
  );
}

// Loading screen component
const LoadingScreen = () => {
  const [loadingText, setLoadingText] = useState('Initializing system');
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);
  
  // Animate loading text
  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '');
    }, 500);
    
    // Simulate loading progress
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const increment = Math.floor(Math.random() * 5) + 1;
        return Math.min(prev + increment, 100);
      });
    }, 200);
    
    // Change loading text based on progress
    const textTimer = setInterval(() => {
      if (progress < 30) {
        setLoadingText('Initializing system');
      } else if (progress < 60) {
        setLoadingText('Loading resources');
      } else if (progress < 90) {
        setLoadingText('Establishing connection');
      } else {
        setLoadingText('Launching RogueCode');
      }
    }, 1000);
    
    return () => {
      clearInterval(dotTimer);
      clearInterval(progressTimer);
      clearInterval(textTimer);
    };
  }, [progress]);
  
  // Calculate filled and empty blocks for loading bar
  const totalBlocks = 20;
  const filledBlocks = Math.floor((progress / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <h1 className="loading-title">RogueCode</h1>
        <div className="loading-subtitle">AI Hacker Adventure</div>
        
        <div className="loading-bar-container">
          <div className="loading-bar-text">
            {loadingText}{dots}
          </div>
          <div className="loading-bar">
            <div 
              className="loading-bar-progress" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="loading-percentage">
            <span className="loading-blocks">
              {`${'█'.repeat(filledBlocks)}${'▒'.repeat(emptyBlocks)}`}
            </span>
            <span className="loading-percent">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main game screen component
const GameScreen = () => {
  const { uiState } = useGameContext();
  
  // Sample mission for demonstration
  const sampleMission = {
    id: 'mission-1',
    title: 'Corporate Infiltration',
    type: 'INFILTRATION',
    description: 'Gain access to MegaCorp's internal network and locate sensitive financial documents. Their security system has been recently upgraded, so proceed with caution.',
    objective: 'Download quarterly financial reports',
    target: 'MegaCorp HQ',
    difficulty: 3,
    xpReward: 250,
    creditReward: 1000,
    reputationReward: 5
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">RogueCode: AI Hacker Adventure</div>
        <div className="app-controls">
          <button className="control-button">Settings</button>
          <button className="control-button">Help</button>
        </div>
      </header>
      
      <div className="app-content">
        <StatusBar />
        <Terminal />
      </div>
      
      <footer className="app-footer">
        <div>© 2025 RogueCode</div>
      </footer>
      
      {/* Popups */}
      {uiState.showMissionPopup && (
        <div className="popup-overlay">
          <MissionPopup mission={sampleMission} />
        </div>
      )}
      
      {uiState.showAlertBox && (
        <div className="alert-overlay">
          <AlertBox 
            message={uiState.alertMessage} 
            type={uiState.alertType} 
          />
        </div>
      )}
      
      {uiState.showSkillTree && (
        <div className="popup-overlay">
          <SkillTree />
        </div>
      )}
      
      {uiState.showInventory && (
        <div className="popup-overlay">
          <Inventory />
        </div>
      )}
    </div>
  );
};

export default App;
