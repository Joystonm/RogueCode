import React, { useEffect, useState } from 'react';
import Terminal from './components/Terminal';
import StatusBar from './components/StatusBar';
import MissionPopup from './components/Popups/MissionPopup';
import AlertBox from './components/Popups/AlertBox';
import SkillTree from './components/Popups/SkillTree';
import Inventory from './components/Popups/Inventory';
import HelpPanel from './components/HelpPanel';
import SettingsPanel from './components/SettingsPanel';
import { GameProvider, useGameContext } from './context/GameContext';
import soundManager from './utils/soundManager';
import { memoryService } from './services';
import { gsap } from 'gsap';
import './styles/App.css';
import './styles/animations.css';

// Main App component
function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize game
  useEffect(() => {
    // Initialize memory service
    try {
      const loaded = memoryService.loadFromLocalStorage();
      if (!loaded) {
        memoryService.initializeMemory();
      }
      console.log("Memory service initialized");
    } catch (error) {
      console.error("Failed to initialize memory service:", error);
      memoryService.initializeMemory(); // Initialize with defaults
    }
    
    // Initialize sound manager
    try {
      soundManager.init();
      console.log("Sound manager initialized successfully");
      
      // Simulate loading time
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
        
        // Play ambient music when loading completes
        try {
          soundManager.playMusic('ambient');
          console.log("Started playing ambient music");
        } catch (error) {
          console.error("Failed to play ambient music:", error);
        }
      }, 2000);
      
      return () => {
        clearTimeout(loadingTimer);
        
        // Stop all sounds when component unmounts
        try {
          soundManager.stopMusic();
          console.log("Stopped all music");
        } catch (error) {
          console.error("Failed to stop music:", error);
        }
      };
    } catch (error) {
      console.error("Failed to initialize sound manager:", error);
      setIsLoading(false);
    }
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
  const { uiState, toggleHelpPanel, toggleSettingsPanel } = useGameContext();
  
  // Sample mission for demonstration
  const sampleMission = {
    id: 'mission-1',
    title: 'Corporate Infiltration',
    type: 'INFILTRATION',
    description: "Gain access to MegaCorp's internal network and locate sensitive financial documents. Their security system has been recently upgraded, so proceed with caution.",
    objective: 'Download quarterly financial reports',
    target: 'MegaCorp HQ',
    difficulty: 3,
    xpReward: 250,
    creditReward: 1000,
    reputationReward: 5
  };
  
  // Add keyboard shortcut for help (F1 or H key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // F1 or Ctrl+H for help
      if (e.key === 'F1' || (e.key === 'h' && e.ctrlKey)) {
        e.preventDefault();
        toggleHelpPanel();
      }
      
      // S or Ctrl+S for settings
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        toggleSettingsPanel();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleHelpPanel, toggleSettingsPanel]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">RogueCode: AI Hacker Adventure</div>
        <div className="app-controls">
          <button className="control-button" onClick={toggleSettingsPanel} title="Settings (Ctrl+S)">Settings</button>
          <button className="control-button" onClick={toggleHelpPanel} title="Help (F1 or Ctrl+H)">Help</button>
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
      
      {/* Help Panel */}
      {uiState.showHelpPanel && (
        <HelpPanel onClose={toggleHelpPanel} />
      )}
      
      {/* Settings Panel */}
      {uiState.showSettingsPanel && (
        <SettingsPanel onClose={toggleSettingsPanel} />
      )}
    </div>
  );
};

export default App;
