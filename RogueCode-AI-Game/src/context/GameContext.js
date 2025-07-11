import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import soundManager from '../utils/soundManager';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  // Player stats and progression
  const [playerState, setPlayerState] = useState({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    credits: 500,
    reputation: 0,
    skills: [],
    inventory: [],
  });

  // Mission system
  const [missionState, setMissionState] = useState({
    currentMission: null,
    activeMissions: [],
    completedMissions: [],
    missionLog: [],
    missionTimer: null,
  });

  // Terminal state
  const [terminalState, setTerminalState] = useState({
    commandHistory: [],
    outputHistory: [
      { id: uuidv4(), text: 'RogueCode OS v1.0.3 [Build 20771225]', type: 'system' },
      { id: uuidv4(), text: 'Initializing secure connection...', type: 'system' },
      { id: uuidv4(), text: 'Connection established. Welcome back, Rogue.', type: 'success' },
      { id: uuidv4(), text: 'Type "help" to see available commands.', type: 'info' },
    ],
    isProcessing: false,
    lastCommand: '',
  });

  // Game settings
  const [gameSettings, setGameSettings] = useState({
    soundEnabled: true,
    musicEnabled: true,
    volume: 0.7,
    terminalTheme: 'green', // green, amber, blue
    typingSpeed: 50,
    glitchIntensity: 0.3,
  });

  // UI state
  const [uiState, setUiState] = useState({
    showSkillTree: false,
    showInventory: false,
    showMissionPopup: false,
    showAlertBox: false,
    showHelpPanel: false,
    showSettingsPanel: false,
    alertMessage: '',
    alertType: 'info',
  });

  // Add a command to the terminal
  const addTerminalCommand = (command) => {
    const newCommandEntry = { id: uuidv4(), text: `$ ${command}`, type: 'command' };
    
    setTerminalState(prev => ({
      ...prev,
      commandHistory: [...prev.commandHistory, command],
      outputHistory: [...prev.outputHistory, newCommandEntry],
      lastCommand: command,
      isProcessing: true,
    }));
    
    // Play typing sound
    soundManager.playSound('typewriter');
    
    return newCommandEntry.id;
  };

  // Add output to the terminal
  const addTerminalOutput = (text, type = 'system') => {
    const newOutput = { id: uuidv4(), text, type };
    
    setTerminalState(prev => ({
      ...prev,
      outputHistory: [...prev.outputHistory, newOutput],
      isProcessing: false,
    }));
    
    return newOutput.id;
  };

  // Set terminal processing state
  const setTerminalProcessing = (isProcessing) => {
    setTerminalState(prev => ({
      ...prev,
      isProcessing
    }));
  };

  // Clear terminal
  const clearTerminal = () => {
    setTerminalState(prev => ({
      ...prev,
      outputHistory: [
        { id: uuidv4(), text: 'Terminal cleared.', type: 'system' },
      ],
    }));
  };

  // Add XP to player
  const addXP = (amount) => {
    setPlayerState(prev => {
      const newXP = prev.xp + amount;
      
      // Check for level up
      if (newXP >= prev.xpToNextLevel) {
        const newLevel = prev.level + 1;
        const newXPToNextLevel = prev.xpToNextLevel * 1.5;
        
        // Play level up sound
        soundManager.playSound('levelUp');
        
        // Show level up alert
        setUiState(prev => ({
          ...prev,
          showAlertBox: true,
          alertMessage: `Level Up! You are now level ${newLevel}`,
          alertType: 'success',
        }));
        
        return {
          ...prev,
          level: newLevel,
          xp: newXP - prev.xpToNextLevel,
          xpToNextLevel: newXPToNextLevel,
        };
      }
      
      return {
        ...prev,
        xp: newXP,
      };
    });
  };

  // Add a skill to player
  const addSkill = (skill) => {
    setPlayerState(prev => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
    
    // Play skill unlock sound
    soundManager.playSound('unlock');
    
    // Show skill unlock alert
    setUiState(prev => ({
      ...prev,
      showAlertBox: true,
      alertMessage: `New skill unlocked: ${skill.name}`,
      alertType: 'success',
    }));
  };

  // Start a new mission
  const startMission = (mission) => {
    setMissionState(prev => ({
      ...prev,
      currentMission: mission,
      activeMissions: [...prev.activeMissions, mission],
      missionLog: [...prev.missionLog, { 
        timestamp: new Date().toISOString(),
        event: `Mission accepted: ${mission.title}`,
      }],
    }));
    
    // Play mission accept sound
    soundManager.playSound('missionAccept');
    
    // Hide mission popup
    setUiState(prev => ({
      ...prev,
      showMissionPopup: false,
    }));
    
    // Add mission start message to terminal
    addTerminalOutput(`Mission accepted: ${mission.title}`, 'success');
    addTerminalOutput(mission.description, 'info');
    addTerminalOutput(`Objective: ${mission.objective}`, 'info');
  };

  // Complete a mission
  const completeMission = (missionId) => {
    setMissionState(prev => {
      const mission = prev.activeMissions.find(m => m.id === missionId);
      
      if (!mission) return prev;
      
      const updatedActiveMissions = prev.activeMissions.filter(m => m.id !== missionId);
      
      return {
        ...prev,
        currentMission: updatedActiveMissions.length > 0 ? updatedActiveMissions[0] : null,
        activeMissions: updatedActiveMissions,
        completedMissions: [...prev.completedMissions, mission],
        missionLog: [...prev.missionLog, { 
          timestamp: new Date().toISOString(),
          event: `Mission completed: ${mission.title}`,
        }],
      };
    });
    
    // Add XP and credits
    const mission = missionState.activeMissions.find(m => m.id === missionId);
    addXP(mission.xpReward);
    
    setPlayerState(prev => ({
      ...prev,
      credits: prev.credits + mission.creditReward,
      reputation: prev.reputation + mission.reputationReward,
    }));
    
    // Play mission complete sound
    soundManager.playSound('missionComplete');
    
    // Show mission complete alert
    setUiState(prev => ({
      ...prev,
      showAlertBox: true,
      alertMessage: `Mission Complete! Rewards: ${mission.xpReward} XP, ${mission.creditReward} credits`,
      alertType: 'success',
    }));
    
    // Add mission complete message to terminal
    addTerminalOutput(`Mission complete: ${mission.title}`, 'success');
    addTerminalOutput(`Rewards: ${mission.xpReward} XP, ${mission.creditReward} credits`, 'success');
  };

  // Toggle UI elements
  const toggleSkillTree = () => {
    setUiState(prev => ({
      ...prev,
      showSkillTree: !prev.showSkillTree,
    }));
    
    // Play UI toggle sound
    soundManager.playSound('uiToggle');
  };

  const toggleInventory = () => {
    setUiState(prev => ({
      ...prev,
      showInventory: !prev.showInventory,
    }));
    
    // Play UI toggle sound
    soundManager.playSound('uiToggle');
  };

  // Close alert box
  const closeAlertBox = () => {
    setUiState(prev => ({
      ...prev,
      showAlertBox: false,
    }));
  };
  
  const toggleHelpPanel = () => {
    setUiState(prev => ({
      ...prev,
      showHelpPanel: !prev.showHelpPanel,
    }));
    
    // Play UI toggle sound
    soundManager.playSound('uiToggle');
  };
  
  const toggleSettingsPanel = () => {
    setUiState(prev => ({
      ...prev,
      showSettingsPanel: !prev.showSettingsPanel,
    }));
    
    // Play UI toggle sound
    soundManager.playSound('uiToggle');
  };

  // Update game settings
  const updateGameSettings = (settings) => {
    setGameSettings(prev => ({
      ...prev,
      ...settings,
    }));
    
    // Update sound manager volume
    if (settings.volume !== undefined) {
      soundManager.setVolume(settings.volume);
      soundManager.setMusicVolume(settings.volume);
    }
    
    // Toggle sound effects
    if (settings.soundEnabled !== undefined) {
      if (settings.soundEnabled !== gameSettings.soundEnabled) {
        soundManager.toggleMute();
      }
    }
    
    // Toggle music
    if (settings.musicEnabled !== undefined) {
      if (settings.musicEnabled !== gameSettings.musicEnabled) {
        soundManager.toggleMusicMute();
        
        // If enabling music and no music is playing, start it
        if (settings.musicEnabled && !gameSettings.musicEnabled) {
          soundManager.playMusic('ambient');
        }
      }
    }
  };

  // Initialize game
  useEffect(() => {
    // Load saved game if exists
    const savedGame = localStorage.getItem('rogueCodeGameSave');
    
    if (savedGame) {
      try {
        const parsedSave = JSON.parse(savedGame);
        
        // Load player state
        if (parsedSave.playerState) {
          setPlayerState(parsedSave.playerState);
        }
        
        // Load mission state
        if (parsedSave.missionState) {
          setMissionState(parsedSave.missionState);
        }
        
        // Load game settings
        if (parsedSave.gameSettings) {
          setGameSettings(parsedSave.gameSettings);
        }
        
        addTerminalOutput('Game save loaded successfully.', 'success');
      } catch (error) {
        console.error('Failed to load saved game:', error);
        addTerminalOutput('Error loading saved game data.', 'error');
      }
    }
    
    // Initialize sound manager
    soundManager.setVolume(gameSettings.volume);
    
    if (!gameSettings.soundEnabled) {
      soundManager.toggleMute();
    }
  }, []);

  // Save game when state changes
  useEffect(() => {
    const gameState = {
      playerState,
      missionState,
      gameSettings,
    };
    
    localStorage.setItem('rogueCodeGameSave', JSON.stringify(gameState));
  }, [playerState, missionState, gameSettings]);

  return (
    <GameContext.Provider value={{ 
      playerState,
      missionState,
      terminalState,
      gameSettings,
      uiState,
      addTerminalCommand,
      addTerminalOutput,
      clearTerminal,
      setTerminalProcessing,
      addXP,
      addSkill,
      startMission,
      completeMission,
      toggleSkillTree,
      toggleInventory,
      toggleHelpPanel,
      toggleSettingsPanel,
      closeAlertBox,
      updateGameSettings,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);

export default GameContext;
