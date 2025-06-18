/**
 * Service for managing game memory and state
 */

// In-memory storage
const gameMemory = {
  player: {
    level: 1,
    xp: 0,
    credits: 1000,
    reputation: 0,
    skills: {},
    inventory: [],
    completedMissions: []
  },
  missions: [],
  targets: {},
  viruses: {},
  exploits: {},
  currentSystem: null,
  gameState: 'idle'
};

/**
 * Initialize memory with default values
 * @param {object} initialState - Initial state to set
 * @returns {void}
 */
export const initializeMemory = (initialState = {}) => {
  Object.assign(gameMemory, initialState);
  
  // Save to localStorage for persistence
  saveToLocalStorage();
};

/**
 * Save current memory to localStorage
 * @returns {void}
 */
const saveToLocalStorage = () => {
  try {
    localStorage.setItem('rogueCodeGameState', JSON.stringify(gameMemory));
  } catch (error) {
    console.error('Error saving game state to localStorage:', error);
  }
};

/**
 * Load memory from localStorage
 * @returns {boolean} - Whether load was successful
 */
export const loadFromLocalStorage = () => {
  try {
    const savedState = localStorage.getItem('rogueCodeGameState');
    
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      Object.assign(gameMemory, parsedState);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error loading game state from localStorage:', error);
    return false;
  }
};

/**
 * Get player data
 * @returns {object} - Player data
 */
export const getPlayerData = () => {
  return { ...gameMemory.player };
};

/**
 * Update player data
 * @param {object} updates - Player data updates
 * @returns {object} - Updated player data
 */
export const updatePlayerData = (updates) => {
  Object.assign(gameMemory.player, updates);
  saveToLocalStorage();
  return { ...gameMemory.player };
};

/**
 * Add XP to player
 * @param {number} amount - Amount of XP to add
 * @returns {object} - Updated player data with level up info
 */
export const addPlayerXP = (amount) => {
  const player = gameMemory.player;
  const oldLevel = player.level;
  
  player.xp += amount;
  
  // Check for level up (simple formula: level = 1 + floor(xp/1000))
  player.level = 1 + Math.floor(player.xp / 1000);
  
  const leveledUp = player.level > oldLevel;
  
  saveToLocalStorage();
  
  return {
    ...player,
    leveledUp,
    levelsGained: leveledUp ? player.level - oldLevel : 0
  };
};

/**
 * Add mission to memory
 * @param {object} mission - Mission data
 * @returns {string} - Mission ID
 */
export const addMission = (mission) => {
  const missionWithId = {
    id: `mission-${gameMemory.missions.length + 1}`,
    status: 'available',
    ...mission
  };
  
  gameMemory.missions.push(missionWithId);
  saveToLocalStorage();
  
  return missionWithId.id;
};

/**
 * Get all missions
 * @param {string} status - Filter by status (optional)
 * @returns {Array} - Missions
 */
export const getMissions = (status = null) => {
  if (status) {
    return gameMemory.missions.filter(mission => mission.status === status);
  }
  
  return [...gameMemory.missions];
};

/**
 * Update mission status
 * @param {string} missionId - Mission ID
 * @param {string} status - New status
 * @returns {object} - Updated mission
 */
export const updateMissionStatus = (missionId, status) => {
  const mission = gameMemory.missions.find(m => m.id === missionId);
  
  if (mission) {
    mission.status = status;
    saveToLocalStorage();
    return { ...mission };
  }
  
  return null;
};

/**
 * Complete a mission
 * @param {string} missionId - Mission ID
 * @returns {object} - Completed mission with rewards
 */
export const completeMission = (missionId) => {
  const mission = gameMemory.missions.find(m => m.id === missionId);
  
  if (mission && mission.status === 'active') {
    // Update mission status
    mission.status = 'completed';
    mission.completedAt = new Date().toISOString();
    
    // Add to completed missions
    gameMemory.player.completedMissions.push(missionId);
    
    // Award rewards
    gameMemory.player.credits += mission.creditReward || 0;
    gameMemory.player.reputation += mission.reputationReward || 0;
    
    // Add XP
    if (mission.xpReward) {
      addPlayerXP(mission.xpReward);
    }
    
    saveToLocalStorage();
    
    return { ...mission };
  }
  
  return null;
};

/**
 * Add target to memory
 * @param {object} target - Target data
 * @returns {string} - Target ID
 */
export const addTarget = (target) => {
  const targetId = target.id || `target-${Object.keys(gameMemory.targets).length + 1}`;
  
  gameMemory.targets[targetId] = {
    discovered: new Date().toISOString(),
    ...target
  };
  
  saveToLocalStorage();
  
  return targetId;
};

/**
 * Get target by ID
 * @param {string} targetId - Target ID
 * @returns {object} - Target data
 */
export const getTarget = (targetId) => {
  return gameMemory.targets[targetId] ? { ...gameMemory.targets[targetId] } : null;
};

/**
 * Get all targets
 * @returns {object} - All targets
 */
export const getAllTargets = () => {
  return { ...gameMemory.targets };
};

/**
 * Add virus to memory
 * @param {object} virus - Virus data
 * @returns {string} - Virus ID
 */
export const addVirus = (virus) => {
  const virusId = virus.id || `virus-${Object.keys(gameMemory.viruses).length + 1}`;
  
  gameMemory.viruses[virusId] = {
    created: new Date().toISOString(),
    ...virus
  };
  
  saveToLocalStorage();
  
  return virusId;
};

/**
 * Get all viruses
 * @returns {object} - All viruses
 */
export const getAllViruses = () => {
  return { ...gameMemory.viruses };
};

/**
 * Set current system
 * @param {object} system - System data
 * @returns {void}
 */
export const setCurrentSystem = (system) => {
  gameMemory.currentSystem = system;
  saveToLocalStorage();
};

/**
 * Get current system
 * @returns {object} - Current system
 */
export const getCurrentSystem = () => {
  return gameMemory.currentSystem ? { ...gameMemory.currentSystem } : null;
};

/**
 * Set game state
 * @param {string} state - Game state
 * @returns {void}
 */
export const setGameState = (state) => {
  gameMemory.gameState = state;
  saveToLocalStorage();
};

/**
 * Get game state
 * @returns {string} - Game state
 */
export const getGameState = () => {
  return gameMemory.gameState;
};

/**
 * Reset game memory
 * @returns {void}
 */
export const resetMemory = () => {
  Object.keys(gameMemory).forEach(key => {
    if (typeof gameMemory[key] === 'object' && gameMemory[key] !== null) {
      if (Array.isArray(gameMemory[key])) {
        gameMemory[key] = [];
      } else {
        gameMemory[key] = {};
      }
    } else {
      gameMemory[key] = null;
    }
  });
  
  // Reset player to default
  gameMemory.player = {
    level: 1,
    xp: 0,
    credits: 1000,
    reputation: 0,
    skills: {},
    inventory: [],
    completedMissions: []
  };
  
  gameMemory.gameState = 'idle';
  
  saveToLocalStorage();
};

export default {
  initializeMemory,
  loadFromLocalStorage,
  getPlayerData,
  updatePlayerData,
  addPlayerXP,
  addMission,
  getMissions,
  updateMissionStatus,
  completeMission,
  addTarget,
  getTarget,
  getAllTargets,
  addVirus,
  getAllViruses,
  setCurrentSystem,
  getCurrentSystem,
  setGameState,
  getGameState,
  resetMemory
};
