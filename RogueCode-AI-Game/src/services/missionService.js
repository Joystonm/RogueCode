import { v4 as uuidv4 } from 'uuid';

/**
 * Mission generation service
 */
class MissionService {
  constructor() {
    this.missionTypes = [
      'INFILTRATION',
      'DATA_THEFT',
      'SABOTAGE',
      'SURVEILLANCE',
      'EXTRACTION',
      'DEFENSE',
      'RECOVERY'
    ];
    
    this.missionTargets = [
      'MegaCorp HQ',
      'NeoBank Systems',
      'Quantum Research Lab',
      'SynthTech Industries',
      'Global Defense Network',
      'Darkweb Server Cluster',
      'CyberSec Solutions',
      'Nexus Data Center',
      'Orbital Communications Array',
      'BlackMesa Research Facility'
    ];
    
    this.missionObjectives = {
      'INFILTRATION': [
        'Gain access to the internal network',
        'Bypass security systems',
        'Plant a backdoor in the system',
        'Establish persistent access'
      ],
      'DATA_THEFT': [
        'Download confidential documents',
        'Extract customer database',
        'Retrieve encryption keys',
        'Copy proprietary algorithms'
      ],
      'SABOTAGE': [
        'Corrupt system files',
        'Disable security protocols',
        'Plant false information',
        'Trigger system failures'
      ],
      'SURVEILLANCE': [
        'Monitor network traffic',
        'Intercept communications',
        'Track target activities',
        'Gather intelligence'
      ],
      'EXTRACTION': [
        'Retrieve compromised agent data',
        'Recover stolen technology',
        'Extract undercover operative',
        'Secure sensitive information'
      ],
      'DEFENSE': [
        'Protect critical infrastructure',
        'Counter incoming cyber attacks',
        'Secure vulnerable systems',
        'Eliminate security breaches'
      ],
      'RECOVERY': [
        'Recover deleted files',
        'Restore corrupted data',
        'Retrieve backup archives',
        'Salvage damaged systems'
      ]
    };
  }

  /**
   * Generate a random mission
   * @param {number} playerLevel - Current player level
   * @returns {object} Mission object
   */
  generateMission(playerLevel = 1) {
    // Select random mission type
    const missionType = this.missionTypes[Math.floor(Math.random() * this.missionTypes.length)];
    
    // Select random target
    const target = this.missionTargets[Math.floor(Math.random() * this.missionTargets.length)];
    
    // Select random objective for the mission type
    const objectives = this.missionObjectives[missionType];
    const objective = objectives[Math.floor(Math.random() * objectives.length)];
    
    // Calculate difficulty based on player level (1-5)
    const baseDifficulty = Math.min(Math.max(Math.floor(playerLevel / 2), 1), 5);
    const difficulty = Math.min(Math.max(baseDifficulty + Math.floor(Math.random() * 3) - 1, 1), 5);
    
    // Calculate rewards based on difficulty
    const baseXP = 100;
    const xpReward = Math.floor(baseXP * difficulty * (0.8 + Math.random() * 0.4));
    
    const baseCredits = 200;
    const creditReward = Math.floor(baseCredits * difficulty * (0.8 + Math.random() * 0.4));
    
    const baseReputation = 1;
    const reputationReward = Math.floor(baseReputation * difficulty * (0.8 + Math.random() * 0.4));
    
    // Generate mission title
    const title = this.generateMissionTitle(missionType, target);
    
    // Generate mission description
    const description = this.generateMissionDescription(missionType, target, objective, difficulty);
    
    // Create mission object
    return {
      id: uuidv4(),
      title,
      type: missionType,
      description,
      objective,
      target,
      difficulty,
      xpReward,
      creditReward,
      reputationReward,
      timeLimit: difficulty * 10 * 60, // Time limit in seconds
      created: new Date().toISOString()
    };
  }

  /**
   * Generate a mission title
   * @param {string} type - Mission type
   * @param {string} target - Mission target
   * @returns {string} Mission title
   */
  generateMissionTitle(type, target) {
    const titleTemplates = {
      'INFILTRATION': [
        'Silent Entry: {target}',
        'Breach Protocol: {target}',
        'Ghost Access: {target}',
        'Shadow Infiltration: {target}'
      ],
      'DATA_THEFT': [
        'Data Extraction: {target}',
        'Memory Heist: {target}',
        'Digital Larceny: {target}',
        'Information Raid: {target}'
      ],
      'SABOTAGE': [
        'System Corruption: {target}',
        'Network Takedown: {target}',
        'Chaos Protocol: {target}',
        'Disrupt Operations: {target}'
      ],
      'SURVEILLANCE': [
        'Silent Observer: {target}',
        'Digital Shadows: {target}',
        'Watchful Eye: {target}',
        'Network Monitor: {target}'
      ],
      'EXTRACTION': [
        'Asset Recovery: {target}',
        'Secure Extraction: {target}',
        'Retrieval Operation: {target}',
        'Recovery Protocol: {target}'
      ],
      'DEFENSE': [
        'Digital Fortress: {target}',
        'Firewall Guardian: {target}',
        'System Defense: {target}',
        'Security Protocol: {target}'
      ],
      'RECOVERY': [
        'Data Salvage: {target}',
        'System Restoration: {target}',
        'Recovery Operation: {target}',
        'Digital Archaeology: {target}'
      ]
    };
    
    // Get templates for the mission type
    const templates = titleTemplates[type] || titleTemplates['INFILTRATION'];
    
    // Select random template
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Replace placeholders
    return template.replace('{target}', target);
  }

  /**
   * Generate a mission description
   * @param {string} type - Mission type
   * @param {string} target - Mission target
   * @param {string} objective - Mission objective
   * @param {number} difficulty - Mission difficulty
   * @returns {string} Mission description
   */
  generateMissionDescription(type, target, objective, difficulty) {
    // Description templates
    const introTemplates = [
      'We have intel on {target} that requires immediate action.',
      'A high-priority operation targeting {target} has been authorized.',
      'Your expertise is needed for a mission involving {target}.',
      'An opportunity has emerged to infiltrate {target}.'
    ];
    
    const difficultyDescriptions = [
      'This should be a straightforward operation with minimal security.',
      'Standard security measures are in place, but nothing you can\'t handle.',
      'Be prepared for enhanced security protocols and active monitoring.',
      'High-level security systems are in place. Proceed with extreme caution.',
      'Maximum security alert. Only our best operatives are assigned to this level of mission.'
    ];
    
    const objectiveIntros = [
      'Your primary objective is to {objective}.',
      'You are tasked with {objective}.',
      'Mission parameters require you to {objective}.',
      'Your assignment: {objective}.'
    ];
    
    const closingTemplates = [
      'Complete this mission with discretion. We can\'t afford any traces.',
      'Time is of the essence. Get in, complete the objective, and get out.',
      'Success in this mission will significantly advance our position.',
      'The data you acquire will be invaluable to our operations.'
    ];
    
    // Select random templates
    const intro = introTemplates[Math.floor(Math.random() * introTemplates.length)];
    const difficultyDesc = difficultyDescriptions[difficulty - 1];
    const objectiveIntro = objectiveIntros[Math.floor(Math.random() * objectiveIntros.length)];
    const closing = closingTemplates[Math.floor(Math.random() * closingTemplates.length)];
    
    // Construct description
    return `${intro.replace('{target}', target)} ${difficultyDesc} ${objectiveIntro.replace('{objective}', objective.toLowerCase())} ${closing}`;
  }

  /**
   * Generate multiple missions
   * @param {number} count - Number of missions to generate
   * @param {number} playerLevel - Current player level
   * @returns {Array} Array of mission objects
   */
  generateMissions(count = 3, playerLevel = 1) {
    const missions = [];
    
    for (let i = 0; i < count; i++) {
      missions.push(this.generateMission(playerLevel));
    }
    
    return missions;
  }
}

// Create and export a singleton instance
const missionService = new MissionService();
export default missionService;
