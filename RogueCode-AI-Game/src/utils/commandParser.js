import { v4 as uuidv4 } from 'uuid';
import { applyGlitchEffect } from './glitchText';
import soundManager from './soundManager';
import groqService from '../services/groqService';
import tavilyService from '../services/tavilyService';
import randomUserService from '../services/randomUserService';
import uuidService from '../services/uuidService';
import memoryService from '../services/memoryService';

/**
 * Parse and process user commands
 * @param {string} input - The command input from the user
 * @returns {object} The parsed command with action and arguments
 */
const parseCommand = (input) => {
  if (!input || input.trim() === '') {
    return { action: null, args: [], flags: {} };
  }

  try {
    const parts = input.trim().split(' ');
    const action = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Parse flags (e.g. --verbose, -v)
    const flags = {};
    const cleanArgs = [];
    
    args.forEach(arg => {
      if (arg.startsWith('--')) {
        // Long flag (--flag)
        const flagName = arg.slice(2);
        flags[flagName] = true;
      } else if (arg.startsWith('-') && arg.length > 1) {
        // Short flag (-f)
        const flagName = arg.slice(1);
        flags[flagName] = true;
      } else {
        cleanArgs.push(arg);
      }
    });

    return { action, args: cleanArgs, flags };
  } catch (error) {
    console.error('Error parsing command:', error);
    return { action: input.trim().split(' ')[0].toLowerCase(), args: [], flags: {} };
  }
};

/**
 * Process a command and return the appropriate response
 * @param {object} command - The parsed command object
 * @returns {Promise<object>} The response object with text and type
 */
const processCommand = async (command) => {
  console.log('Processing command:', command);
  const { action, args, flags } = command;

  // Basic command handling
  try {
    switch (action) {
      case 'help':
        return handleHelpCommand(args);
        
      case 'clear':
        return { 
          text: 'CLEAR_TERMINAL', 
          type: 'system',
          action: 'CLEAR_TERMINAL'
        };
        
      case 'status':
        return handleStatusCommand();
        
      case 'scan':
        console.log('Executing scan command with args:', args, 'and flags:', flags);
        const scanResult = await handleScanCommand(args, flags);
        console.log('Scan result:', scanResult);
        return scanResult;
        
      case 'test':
        console.log('Executing test command with args:', args);
        const testResult = await handleTestCommand(args);
        console.log('Test result:', testResult);
        return testResult;
        
      case 'inject':
        return await handleInjectCommand(args, flags);
        
      case 'download':
        return await handleDownloadCommand(args, flags);
        
      case 'trace':
        return await handleTraceCommand(args, flags);
        
      case 'upgrade':
        return await handleUpgradeCommand(args, flags);
        
      case 'settings':
        return {
          text: 'Opening settings panel...',
          type: 'system',
          action: 'OPEN_SETTINGS_PANEL'
        };
        
      case 'skills':
        return { 
          text: 'Opening skill tree...', 
          type: 'system',
          action: 'OPEN_SKILL_TREE'
        };
        
      case 'inventory':
      case 'inv':
        return { 
          text: 'Opening inventory...', 
          type: 'system',
          action: 'OPEN_INVENTORY'
        };
        
      case 'missions':
      case 'mission':
        console.log('Executing mission command with args:', args);
        const missionResult = await handleMissionCommand(args, flags);
        console.log('Mission result:', missionResult);
        return missionResult;
        
      case 'connect':
        return await handleConnectCommand(args);
        
      case 'exit':
        return { 
          text: 'Disconnecting from current system...', 
          type: 'system',
          action: 'EXIT_SYSTEM'
        };
        
      case 'hack':
        return await handleHackCommand(args, flags);
        
      case 'decrypt':
        return await handleDecryptCommand(args, flags);
        
      case 'analyze':
        return await handleAnalyzeCommand(args, flags);
        
      case 'reset':
        return handleResetCommand(args);
        
      case 'fix':
        return handleFixCommand(args);
        
      case 'debug':
        return handleDebugCommand(args);
        
      default:
        return {
          text: `Command not recognized: ${action}. Type 'help' for available commands.`,
          type: 'error'
        };
    }
  } catch (error) {
    console.error(`Error processing command ${action}:`, error);
    return {
      text: `Error executing ${action}: ${error.message}`,
      type: 'error'
    };
  }
};
/**
 * Handle the help command
 * @param {Array} args - Command arguments
 * @returns {object} Response object
 */
const handleHelpCommand = (args) => {
  // If a specific command is specified, show help for that command
  if (args.length > 0) {
    const command = args[0].toLowerCase();
    
    switch (command) {
      case 'scan':
        return {
          text: `
scan - Scan a target system or network
Usage: scan [target] [options]
Options:
--ports     Scan for open ports
--vulns     Scan for vulnerabilities
--deep      Perform a deep scan (takes longer)
Examples:
scan 192.168.1.1
scan firewall --ports
scan network --deep`,
          type: 'info'
        };
        
      case 'inject':
        return {
          text: `
inject - Inject malware or payload into a target
Usage: inject [payload] [target] [options]

Available payloads:
  malware     - General purpose malware
  keylogger   - Records keystrokes on target system
  rootkit     - Advanced persistent threat
  ransomware  - Encrypts target files and demands payment
  trojan      - Disguised as legitimate software
  worm        - Self-replicating malware
  spyware     - Surveillance software

Options:
  --stealth   - Use stealth mode (harder to detect but lower success rate)
  --force     - Force injection (higher success rate but may trigger alarms)

Examples:
  inject malware server
  inject keylogger workstation --stealth
  inject rootkit firewall --force`,
          type: 'info'
        };
        
      case 'hack':
        return {
          text: `
hack - Attempt to hack a target system
Usage: hack [target] [options]

Common targets:
  server      - Central computing system (high security)
  workstation - Individual computer (low security)
  firewall    - Network security device (very high security)
  router      - Network routing device (medium security)
  database    - Data storage system (high security)
  mainframe   - High-performance computing system (very high security)
  iot         - Internet of Things device (low security)

Options:
  --bruteforce - Use brute force methods (higher success rate but noisy)
  --quiet      - Use quiet methods (lower success rate but stealthier)

Tips:
  - Inject a payload into the target first to increase success chance
  - Different targets have different security levels and rewards
  - Successful hacks earn credits and XP

Examples:
  hack server
  hack workstation --bruteforce
  hack firewall --quiet`,
          type: 'info'
        };
        
      case 'test':
        return {
          text: `
test - Test API connections and services
Usage: test [service]
Available services:
  groq    - Test the Groq AI API connection
  tavily  - Test the Tavily Search API connection
  memory  - Test the memory service
  uuid    - Test the UUID generation service
Examples:
test groq
test tavily`,
          type: 'info'
        };
        
      case 'help':
        // Check if we should open the help panel
        if (args.length === 0 || args[0] === 'panel' || args[0] === 'gui') {
          return {
            text: 'Opening help panel...',
            type: 'system',
            action: 'OPEN_HELP_PANEL'
          };
        }
        
        return {
          text: `
help - Show this help message
Usage: help [command]
Examples:
help scan
help inject

Terminal Tips:
- You can select text with your mouse and copy it using:
  • The Copy button that appears when text is selected
  • Right-click and select Copy from the context menu
  • Ctrl+C (or Cmd+C on Mac) keyboard shortcut`,
          type: 'info'
        };
        
      case 'mission':
      case 'missions':
        return {
          text: `
mission - Manage hacking missions
Usage: mission [subcommand] [options]

Subcommands:
  generate       - Generate a new mission
  accept [id]    - Accept a mission
  info [id]      - View mission details
  complete [id]  - Complete a mission

Examples:
  mission generate
  mission accept mission-1623456789
  mission info mission-1623456789
  mission complete mission-1623456789

Note: Missions provide credits, XP, and reputation rewards upon completion.`,
          type: 'info'
        };
        
      case 'reset':
        return {
          text: `
reset - Reset game progress or settings
Usage: reset [option]

Available options:
  stats    - Reset player statistics to default values
  all      - Reset entire game state (all progress will be lost)

Examples:
  reset stats   - Reset player level, XP, credits, and reputation
  reset all     - Complete game reset (missions, targets, stats, etc.)

Warning: This action cannot be undone.`,
          type: 'info'
        };
        
      case 'fix':
        return {
          text: `
fix - Fix inconsistent game state
Usage: fix [option]

Available options:
  stats    - Fix player statistics to be consistent with your progress

Examples:
  fix stats   - Recalculate player level based on accumulated XP

This command will adjust your stats to ensure they are consistent with your progress.`,
          type: 'info'
        };
        
      case 'debug':
        return {
          text: `
debug - Show debug information
Usage: debug [option]

Available options:
  xp      - Show detailed XP calculation information
  state   - Show current game state information

Examples:
  debug xp     - Display XP calculation details
  debug state  - Show overview of game state

This command provides technical information to help diagnose issues.`,
          type: 'info'
        };
        
      default:
        return {
          text: `No help available for '${command}'. Type 'help' for a list of commands.`,
          type: 'error'
        };
    }
  }
  
  // General help
  return {
    text: `
Available commands:
help       - Show this help message
clear      - Clear the terminal
status     - Show current status
scan       - Scan a target system or network
inject     - Inject malware or payload into a target
download   - Download files or data
trace      - Trace a target's location or activity
upgrade    - Upgrade your hacking tools or skills
skills     - View and manage your skill tree
inventory  - View and manage your inventory
mission    - Manage hacking missions
connect    - Connect to a remote system
exit       - Exit the current system
hack       - Attempt to hack a target
decrypt    - Decrypt encrypted data
analyze    - Analyze data or systems
test       - Test API connections and services
reset      - Reset game progress or settings
fix        - Fix inconsistent game state
debug      - Show debug information

Type 'help [command]' for more information on a specific command.`,
    type: 'info'
  };
};
/**
 * Handle the status command
 * @returns {object} Response object
 */
const handleStatusCommand = () => {
  // Get current timestamp
  const now = new Date();
  const timestamp = now.toISOString().split('T')[1].split('.')[0];
  
  // Generate random system stats
  const memoryUsage = Math.floor(Math.random() * 30) + 30; // 30-60%
  const cpuUsage = Math.floor(Math.random() * 20) + 10; // 10-30%
  const activeProcesses = Math.floor(Math.random() * 5) + 2; // 2-7
  
  // Get player data if available
  let playerStats = '';
  try {
    if (memoryService && typeof memoryService.getPlayerData === 'function') {
      const player = memoryService.getPlayerData();
      
      // Fix player stats if they're inconsistent
      if (player.xp >= player.xpToNextLevel) {
        console.log('Fixing inconsistent player stats...');
        // Reset player stats to consistent values
        memoryService.updatePlayerData({
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          credits: 1000,
          reputation: 0
        });
        
        playerStats = `
Player Stats:
- Level: 1
- XP: 0/100
- Credits: 1000
- Reputation: 0
NOTE: Player stats have been reset due to inconsistency.`;
      } else {
        playerStats = `
Player Stats:
- Level: ${player.level || 1}
- XP: ${player.xp || 0}/${player.xpToNextLevel || 100}
- Credits: ${player.credits || 0}
- Reputation: ${player.reputation || 0}`;
      }
    }
  } catch (error) {
    console.error('Error getting player data:', error);
  }
  
  // Get active payloads if available
  let activePayloads = '';
  try {
    if (memoryService && typeof memoryService.getAllViruses === 'function') {
      const viruses = memoryService.getAllViruses();
      const virusList = Object.values(viruses);
      
      if (virusList.length > 0) {
        activePayloads = `
Active Payloads:
${virusList.map(v => `- ${v.type} on ${v.target} (ID: 0x${v.id.substring(0, 8)})${v.stealth ? ' [STEALTH]' : ''}`).join('\n')}`;
      }
    }
  } catch (error) {
    console.error('Error getting active payloads:', error);
  }
  
  // Get hacked systems if available
  let hackedSystems = '';
  try {
    if (memoryService && typeof memoryService.getAllTargets === 'function') {
      const targets = memoryService.getAllTargets();
      const hackedList = Object.values(targets).filter(t => t.hacked);
      
      if (hackedList.length > 0) {
        hackedSystems = `
Hacked Systems:
${hackedList.map(t => `- ${t.name} (${t.ip})`).join('\n')}`;
      }
    }
  } catch (error) {
    console.error('Error getting hacked systems:', error);
  }
  
  return {
    text: `
System Status: Online
Timestamp: ${timestamp}
Connection: Secure
Trace Status: Clean
Active Processes: ${activeProcesses}
Memory Usage: ${memoryUsage}%
CPU Usage: ${cpuUsage}%
Detected Threats: 0${playerStats}${activePayloads}${hackedSystems}`,
    type: 'info'
  };
};
/**
 * Generate fallback scan results without using API
 * @param {string} target - Target to scan
 * @param {object} flags - Scan flags
 * @returns {string} - Scan results text
 */
const generateFallbackScanResults = (target, flags) => {
  console.log('Generating fallback scan results for target:', target);
  
  // Generate IP address based on target name for consistency
  const targetSum = target.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const ip = `192.168.${targetSum % 255}.${(targetSum * 2) % 255}`;
  
  // Generate MAC address
  const mac = uuidService.generateMACAddress();
  
  // Determine status based on target name
  const status = target.length % 2 === 0 ? 'Online' : 'Offline';
  
  // Determine OS based on target
  const operatingSystems = [
    'Linux 5.15.0-generic',
    'Windows Server 2019',
    'FreeBSD 13.1-RELEASE',
    'Ubuntu 22.04 LTS',
    'CentOS 8.5',
    'Debian 11.3'
  ];
  const osIndex = targetSum % operatingSystems.length;
  const os = operatingSystems[osIndex];
  
  // Generate open ports based on target
  const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 3306, 3389, 5432, 8080];
  const openPorts = [];
  const numPorts = (targetSum % 5) + 1; // 1-5 ports
  
  for (let i = 0; i < numPorts; i++) {
    const portIndex = (targetSum + i) % commonPorts.length;
    openPorts.push(commonPorts[portIndex]);
  }
  
  // Sort ports
  openPorts.sort((a, b) => a - b);
  
  // Generate services for ports
  const portServices = {
    21: 'FTP',
    22: 'SSH',
    23: 'Telnet',
    25: 'SMTP',
    53: 'DNS',
    80: 'HTTP',
    110: 'POP3',
    143: 'IMAP',
    443: 'HTTPS',
    3306: 'MySQL',
    3389: 'RDP',
    5432: 'PostgreSQL',
    8080: 'HTTP-ALT'
  };
  
  const portInfo = openPorts.map(port => {
    const service = portServices[port] || 'Unknown';
    return `${port}/tcp - ${service}`;
  }).join('\n');
  
  // Generate vulnerabilities if requested
  let vulnText = '';
  if (flags.vulns) {
    const vulnerabilities = [
      'Outdated OpenSSL (CVE-2023-0286)',
      'SQL Injection in login form',
      'Cross-Site Scripting in search function',
      'Default credentials (admin/admin)',
      'Directory traversal vulnerability',
      'Remote code execution in file upload',
      'Outdated Apache (CVE-2022-31813)',
      'Weak SSH configuration',
      'Unpatched Log4j vulnerability (CVE-2021-44228)',
      'Insecure cookie settings'
    ];
    
    const vulnCount = (targetSum % 3); // 0-2 vulnerabilities
    
    if (vulnCount > 0) {
      vulnText = '\n\nVulnerabilities detected:';
      
      for (let i = 0; i < vulnCount; i++) {
        const vulnIndex = (targetSum + i) % vulnerabilities.length;
        vulnText += `\n- ${vulnerabilities[vulnIndex]}`;
      }
    } else {
      vulnText = '\n\nNo vulnerabilities detected.';
    }
  }
  
  // Generate additional info for deep scan
  let deepInfo = '';
  if (flags.deep) {
    const uptime = `${(targetSum % 30) + 1} days, ${(targetSum % 24)} hours, ${(targetSum % 60)} minutes`;
    const lastBoot = new Date(Date.now() - ((targetSum % 30) + 1) * 86400000).toISOString().split('T')[0];
    
    deepInfo = `\n\nAdditional Information:
System uptime: ${uptime}
Last boot: ${lastBoot}
Hostname: ${target}-server
Domain: ${target.toLowerCase()}.local`;
  }
  
  // Generate final scan results
  return `Scan results for ${target}:
IP: ${ip}
MAC: ${mac}
Status: ${status}
OS: ${os}

Open ports:
${portInfo}${vulnText}${deepInfo}

Scan completed in ${(Math.random() * 2 + 0.5).toFixed(2)} seconds.`;
};
/**
 * Handle the scan command
 * @param {Array} args - Command arguments
 * @param {object} flags - Command flags
 * @returns {object} Response object
 */
const handleScanCommand = async (args, flags) => {
  console.log('Scan command called with args:', args, 'and flags:', flags);
  
  // Check if a target is specified
  if (args.length === 0) {
    return {
      text: 'Error: No target specified. Usage: scan [target]',
      type: 'error'
    };
  }
  
  const target = args[0];
  console.log('Scanning target:', target);
  
  try {
    // Set terminal to processing state
    const scanOptions = {
      deep: flags.deep || false,
      vulns: flags.vulns || false
    };
    
    console.log('Scan options:', scanOptions);
    
    // Try to get AI-generated scan results
    let aiResults = null;
    let useAI = true;
    
    try {
      console.log('Attempting to get AI scan results...');
      aiResults = await groqService.getScanResults(target, scanOptions);
      console.log('AI scan results received:', aiResults ? 'yes' : 'no');
      
      // If we got results, return them
      if (aiResults && !aiResults.includes('unavailable')) {
        console.log('Using AI-generated scan results');
        return {
          text: aiResults,
          type: 'success'
        };
      } else {
        console.log('AI results unavailable or invalid, falling back to generated results');
        useAI = false;
      }
    } catch (aiError) {
      console.error('Error getting AI scan results:', aiError);
      console.log('Falling back to generated results');
      useAI = false;
    }
    
    // If AI failed, use our fallback function
    if (!useAI) {
      console.log('Using fallback scan results generator');
      const fallbackResults = generateFallbackScanResults(target, flags);
      
      // Store target in memory
      try {
        const ip = fallbackResults.match(/IP: ([^\n]+)/)?.[1] || '0.0.0.0';
        const mac = fallbackResults.match(/MAC: ([^\n]+)/)?.[1] || '00:00:00:00:00:00';
        const status = fallbackResults.match(/Status: ([^\n]+)/)?.[1] || 'Unknown';
        const os = fallbackResults.match(/OS: ([^\n]+)/)?.[1] || 'Unknown';
        
        const targetData = {
          id: uuidService.generateDeviceID(),
          name: target,
          ip: ip,
          mac: mac,
          status: status,
          os: os,
          lastScan: new Date().toISOString()
        };
        
        console.log('Storing target in memory:', targetData);
        memoryService.addTarget(targetData);
      } catch (memError) {
        console.error('Error storing target in memory:', memError);
      }
      
      return {
        text: fallbackResults,
        type: 'success'
      };
    }
    
    // This code should never be reached, but just in case
    return {
      text: `Scan results for ${target}:\nNo results available.`,
      type: 'warning'
    };
  } catch (error) {
    console.error('Error in scan command:', error);
    return {
      text: `Error scanning ${target}: ${error.message}`,
      type: 'error'
    };
  }
};
/**
 * Handle the test command (for testing API connections)
 * @param {Array} args - Command arguments
 * @returns {object} Response object
 */
const handleTestCommand = async (args) => {
  console.log('Test command called with args:', args);
  
  if (args.length === 0) {
    return {
      text: 'Error: No test specified. Usage: test [api]',
      type: 'error'
    };
  }
  
  const testType = args[0].toLowerCase();
  
  switch (testType) {
    case 'groq':
    case 'api':
      try {
        console.log('Testing Groq API connection...');
        const testPrompt = 'Respond with a short message confirming the API is working.';
        const response = await groqService.getAIResponse(testPrompt, {
          max_tokens: 50,
          temperature: 0.5
        });
        
        return {
          text: `Groq API Test Result:\n\n${response}\n\nAPI connection successful!`,
          type: 'success'
        };
      } catch (error) {
        console.error('Groq API test failed:', error);
        return {
          text: `Groq API Test Failed: ${error.message}`,
          type: 'error'
        };
      }
      
    case 'tavily':
      try {
        console.log('Testing Tavily API connection...');
        const results = await tavilyService.search('cyberpunk hacking test', { max_results: 1 });
        
        if (results && results.results && results.results.length > 0) {
          return {
            text: `Tavily API Test Result:\n\nQuery: "cyberpunk hacking test"\nResults: ${results.results.length}\nFirst result: ${results.results[0].title}\n\nAPI connection successful!`,
            type: 'success'
          };
        } else {
          return {
            text: `Tavily API Test: No results returned, but API responded.`,
            type: 'warning'
          };
        }
      } catch (error) {
        console.error('Tavily API test failed:', error);
        return {
          text: `Tavily API Test Failed: ${error.message}`,
          type: 'error'
        };
      }
      
    case 'memory':
      try {
        console.log('Testing memory service...');
        const testId = 'test-' + Date.now();
        const testData = {
          id: testId,
          name: 'Test Target',
          timestamp: new Date().toISOString()
        };
        
        memoryService.addTarget(testData);
        const retrieved = memoryService.getTarget(testId);
        
        if (retrieved && retrieved.id === testId) {
          return {
            text: `Memory Service Test Result:\n\nStored and retrieved test data successfully.\nTest ID: ${testId}\nTest Name: ${retrieved.name}\n\nMemory service is working!`,
            type: 'success'
          };
        } else {
          return {
            text: `Memory Service Test: Failed to retrieve stored data.`,
            type: 'error'
          };
        }
      } catch (error) {
        console.error('Memory service test failed:', error);
        return {
          text: `Memory Service Test Failed: ${error.message}`,
          type: 'error'
        };
      }
      
    case 'uuid':
      try {
        console.log('Testing UUID service...');
        const uuid = uuidService.generateUUID();
        const deviceId = uuidService.generateDeviceID('server');
        const ip = uuidService.generateIPAddress();
        const mac = uuidService.generateMACAddress();
        
        return {
          text: `UUID Service Test Result:\n\nUUID: ${uuid}\nDevice ID: ${deviceId}\nIP Address: ${ip}\nMAC Address: ${mac}\n\nUUID service is working!`,
          type: 'success'
        };
      } catch (error) {
        console.error('UUID service test failed:', error);
        return {
          text: `UUID Service Test Failed: ${error.message}`,
          type: 'error'
        };
      }
      
    default:
      return {
        text: `Unknown test type: ${testType}. Available tests: groq, tavily, memory, uuid`,
        type: 'error'
      };
  }
};
/**
 * Handle the connect command
 * @param {Array} args - Command arguments
 * @returns {object} Response object
 */
const handleConnectCommand = async (args) => {
  // Check if a target is specified
  if (args.length === 0) {
    return {
      text: 'Error: No target specified. Usage: connect [target]',
      type: 'error'
    };
  }
  
  const target = args[0];
  
  // Simulate connection process
  return {
    text: `Establishing secure connection to ${target}...
Authenticating...
Bypassing security measures...
Connection established.

Welcome to ${target} system.
Security level: ${['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]}
Access level: ${['Guest', 'User', 'Admin'][Math.floor(Math.random() * 3)]}

Type 'help' for available commands.`,
    type: 'success',
    action: 'CONNECT_SYSTEM',
    target
  };
};
/**
 * Handle the inject command
 * @param {Array} args - Command arguments
 * @param {object} flags - Command flags
 * @returns {object} Response object
 */
const handleInjectCommand = async (args, flags) => {
  // Check if payload and target are specified
  if (args.length < 2) {
    return {
      text: 'Error: Insufficient arguments. Usage: inject [payload] [target]',
      type: 'error'
    };
  }
  
  const payload = args[0].toLowerCase();
  const target = args[1];
  
  // Generate a UUID for the payload
  const payloadId = uuidv4().substring(0, 8);
  
  // Define different payload types and their properties
  const payloadTypes = {
    malware: {
      description: 'General purpose malware',
      successRate: 0.8,
      stealthPenalty: 0.1,
      forceBonus: 0.15,
      detectionRisk: 'Medium',
      effect: 'Grants basic access to target system'
    },
    keylogger: {
      description: 'Records keystrokes on target system',
      successRate: 0.9,
      stealthPenalty: 0.05,
      forceBonus: 0.1,
      detectionRisk: 'Low',
      effect: 'Captures login credentials and user input'
    },
    rootkit: {
      description: 'Advanced persistent threat',
      successRate: 0.6,
      stealthPenalty: 0.2,
      forceBonus: 0.25,
      detectionRisk: 'High',
      effect: 'Grants elevated privileges and persistent access'
    },
    ransomware: {
      description: 'Encrypts target files and demands payment',
      successRate: 0.7,
      stealthPenalty: 0.3,
      forceBonus: 0.2,
      detectionRisk: 'Very High',
      effect: 'Encrypts target data and displays ransom message'
    },
    trojan: {
      description: 'Disguised as legitimate software',
      successRate: 0.85,
      stealthPenalty: 0.05,
      forceBonus: 0.1,
      detectionRisk: 'Low',
      effect: 'Creates a backdoor for future access'
    },
    worm: {
      description: 'Self-replicating malware',
      successRate: 0.75,
      stealthPenalty: 0.15,
      forceBonus: 0.15,
      detectionRisk: 'Medium',
      effect: 'Spreads to connected systems automatically'
    },
    spyware: {
      description: 'Surveillance software',
      successRate: 0.9,
      stealthPenalty: 0.05,
      forceBonus: 0.05,
      detectionRisk: 'Low',
      effect: 'Monitors target activities and data'
    }
  };
  
  // Check if payload type is valid
  const payloadInfo = payloadTypes[payload];
  if (!payloadInfo) {
    return {
      text: `Error: Unknown payload type '${payload}'.
Available payload types: ${Object.keys(payloadTypes).join(', ')}`,
      type: 'error'
    };
  }
  
  // Determine success chance based on payload type and flags
  let successChance = payloadInfo.successRate;
  
  if (flags.stealth) {
    successChance -= payloadInfo.stealthPenalty;
  }
  
  if (flags.force) {
    successChance += payloadInfo.forceBonus;
  }
  
  // Target-specific modifiers
  if (target === 'firewall') {
    successChance -= 0.2; // Firewalls are harder to inject
  } else if (target === 'workstation') {
    successChance += 0.1; // Workstations are easier to inject
  }
  
  // Determine if injection is successful
  const isSuccess = Math.random() < successChance;
  
  if (!isSuccess) {
    return {
      text: `Injection failed: Target ${target} has rejected the ${payload} payload.
Possible causes:
- Target system has advanced protection
- Payload is incompatible with target
- Connection instability

Technical details:
- Payload type: ${payloadInfo.description}
- Success chance: ${Math.round(successChance * 100)}%
- Target resistance: ${target === 'firewall' ? 'High' : target === 'workstation' ? 'Low' : 'Medium'}

Try using --force flag or a different payload.`,
      type: 'error'
    };
  }
  
  // Generate loading animation text
  const loadingText = `Injecting ${payload} into ${target} █████▒▒▒▒▒ 60%`;
  
  // Store injection in memory
  try {
    const injectionData = {
      id: payloadId,
      type: payload,
      target: target,
      timestamp: new Date().toISOString(),
      stealth: flags.stealth || false,
      force: flags.force || false,
      effect: payloadInfo.effect
    };
    
    // Add to memory if available
    if (memoryService && typeof memoryService.addVirus === 'function') {
      memoryService.addVirus(injectionData);
    }
  } catch (error) {
    console.error('Error storing injection data:', error);
  }
  
  // Generate success message
  return {
    text: `${loadingText}

Injection successful!
Payload ID: 0x${payloadId}
Type: ${payload} (${payloadInfo.description})
Target: ${target}
Status: ${flags.stealth ? 'Hidden' : 'Active'}
Detection Risk: ${flags.stealth ? 'Low' : flags.force ? 'High' : payloadInfo.detectionRisk}
Effect: ${payloadInfo.effect}

${flags.stealth ? 'Stealth mode active: Payload is running with minimal footprint.' : ''}
${flags.force ? 'Warning: Force mode may have triggered security alerts.' : ''}

Use 'status' command to check active payloads.`,
    type: 'success',
    action: 'INJECT_SUCCESS',
    payload: {
      id: payloadId,
      type: payload,
      target: target
    }
  };
};
/**
 * Handle the download command
 * @param {Array} args - Command arguments
 * @param {object} flags - Command flags
 * @returns {object} Response object
 */
const handleDownloadCommand = async (args, flags) => {
  // Check if a target is specified
  if (args.length === 0) {
    return {
      text: 'Error: No target specified. Usage: download [target]',
      type: 'error'
    };
  }
  
  const target = args[0];
  
  // Handle specific download targets
  if (target === 'logs') {
    // Generate fake system logs
    const logEntries = [];
    const numEntries = Math.floor(Math.random() * 5) + 3;
    
    const logTypes = ['INFO', 'WARNING', 'ERROR', 'SYSTEM', 'AUTH', 'NETWORK'];
    const logMessages = [
      'User login successful',
      'Failed authentication attempt',
      'Service started',
      'Connection established',
      'File access denied',
      'Memory allocation failed',
      'Database query executed',
      'Scheduled task completed',
      'Configuration updated',
      'Security scan completed'
    ];
    
    for (let i = 0; i < numEntries; i++) {
      const timestamp = new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString();
      const type = logTypes[Math.floor(Math.random() * logTypes.length)];
      const message = logMessages[Math.floor(Math.random() * logMessages.length)];
      const user = ['admin', 'system', 'root', 'user', 'service'][Math.floor(Math.random() * 5)];
      
      logEntries.push(`[${timestamp}] [${type}] [${user}] ${message}`);
    }
    
    return {
      text: `Downloaded system logs:

${logEntries.join('\n')}

Download complete. ${numEntries} log entries retrieved.`,
      type: 'success'
    };
  }
  
  // Generic download response
  const fileSize = Math.floor(Math.random() * 900) + 100;
  const downloadSpeed = Math.floor(Math.random() * 10) + 1;
  const downloadTime = Math.floor(fileSize / downloadSpeed);
  
  return {
    text: `Downloading ${target}...
File size: ${fileSize} MB
Speed: ${downloadSpeed} MB/s
Estimated time: ${downloadTime} seconds

Download complete. File saved to local storage.`,
    type: 'success'
  };
};
/**
 * Handle the trace command
 * @param {Array} args - Command arguments
 * @param {object} flags - Command flags
 * @returns {object} Response object
 */
const handleTraceCommand = async (args, flags) => {
  // Check if a target is specified
  if (args.length === 0) {
    return {
      text: 'Error: No target specified. Usage: trace [target]',
      type: 'error'
    };
  }
  
  const target = args[0];
  
  try {
    // Try to get a random user profile
    const profile = await randomUserService.generateTargetProfile();
    
    if (profile) {
      return {
        text: `Trace results for ${target}:

User Profile:
Name: ${profile.name}
Username: ${profile.username}
Email: ${profile.email}
Company: ${profile.company}
Job Title: ${profile.jobTitle}
IP Address: ${uuidService.generateIPAddress()}
Location: ${profile.location}
Last Active: ${Math.floor(Math.random() * 24)} hours ago

Connection Map:
${target} → ${uuidService.generateIPAddress()} → ${uuidService.generateIPAddress()}

Trace complete.`,
        type: 'success'
      };
    }
  } catch (error) {
    console.error('Error generating profile:', error);
    // Fall back to generated data
  }
  
  // Generate random user data as fallback
  const firstName = ['John', 'Jane', 'Alex', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia'][Math.floor(Math.random() * 8)];
  const lastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia'][Math.floor(Math.random() * 8)];
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'][Math.floor(Math.random() * 4)]}`;
  const ip = uuidService.generateIPAddress();
  const location = ['New York, USA', 'London, UK', 'Tokyo, Japan', 'Sydney, Australia', 'Berlin, Germany', 'Paris, France'][Math.floor(Math.random() * 6)];
  
  return {
    text: `Trace results for ${target}:

User Profile:
Name: ${firstName} ${lastName}
Email: ${email}
IP Address: ${ip}
Location: ${location}
Last Active: ${Math.floor(Math.random() * 24)} hours ago

Connection Map:
${target} → ${uuidService.generateIPAddress()} → ${ip}

Trace complete.`,
    type: 'success'
  };
};
/**
 * Handle the upgrade command
 * @param {Array} args - Command arguments
 * @param {object} flags - Command flags
 * @returns {object} Response object
 */
const handleUpgradeCommand = async (args, flags) => {
  // Check if a target is specified
  if (args.length === 0) {
    return {
      text: 'Error: No upgrade target specified. Usage: upgrade [target]',
      type: 'error'
    };
  }
  
  const target = args[0];
  
  // Handle different upgrade targets
  switch (target) {
    case 'ai':
      return {
        text: `Upgrading AI assistant...

Current version: 1.2.3
New version: 1.3.0

Changelog:
- Improved natural language processing
- Added support for advanced hacking techniques
- Enhanced pattern recognition algorithms
- Fixed memory leak issues

Upgrade complete. AI assistant is now at version 1.3.0.`,
        type: 'success',
        action: 'UPGRADE_AI'
      };
      
    case 'firewall':
      return {
        text: `Upgrading firewall...

Current version: 2.4.1
New version: 2.5.0

Changelog:
- Enhanced intrusion detection system
- Added deep packet inspection
- Improved zero-day vulnerability protection
- Reduced false positive rate

Upgrade complete. Firewall is now at version 2.5.0.`,
        type: 'success',
        action: 'UPGRADE_FIREWALL'
      };
      
    case 'toolkit':
      return {
        text: `Upgrading hacking toolkit...

Current version: 3.1.2
New version: 3.2.0

Changelog:
- Added new exploit frameworks
- Improved password cracking algorithms
- Enhanced stealth capabilities
- Added support for quantum encryption

Upgrade complete. Hacking toolkit is now at version 3.2.0.`,
        type: 'success',
        action: 'UPGRADE_TOOLKIT'
      };
      
    default:
      return {
        text: `Error: Unknown upgrade target '${target}'.
Available upgrade targets: ai, firewall, toolkit`,
        type: 'error'
      };
  }
};
/**
 * Handle the hack command
 * @param {Array} args - Command arguments
 * @param {object} flags - Command flags
 * @returns {object} Response object
 */
const handleHackCommand = async (args, flags) => {
  // Check if a target is specified
  if (args.length === 0) {
    return {
      text: 'Error: No target specified. Usage: hack [target]',
      type: 'error'
    };
  }
  
  const target = args[0];
  
  // Define target types and their security levels
  const targetTypes = {
    server: { security: 0.7, reward: 'high', description: 'Central computing system' },
    workstation: { security: 0.4, reward: 'low', description: 'Individual computer' },
    firewall: { security: 0.8, reward: 'medium', description: 'Network security device' },
    router: { security: 0.6, reward: 'medium', description: 'Network routing device' },
    database: { security: 0.75, reward: 'high', description: 'Data storage system' },
    mainframe: { security: 0.9, reward: 'very high', description: 'High-performance computing system' },
    iot: { security: 0.3, reward: 'low', description: 'Internet of Things device' },
    phone: { security: 0.5, reward: 'medium', description: 'Mobile communication device' },
    camera: { security: 0.4, reward: 'low', description: 'Surveillance device' },
    atm: { security: 0.85, reward: 'high', description: 'Automated Teller Machine' }
  };
  
  // Check if we have info about this target type
  const targetInfo = targetTypes[target.toLowerCase()];
  const securityLevel = targetInfo ? targetInfo.security : 0.6; // Default if unknown
  
  // Calculate success chance based on target and flags
  let successChance = 0.7 - securityLevel; // Base chance adjusted by security
  
  if (flags.bruteforce) {
    successChance += 0.2; // Brute force increases success chance
  }
  
  if (flags.quiet) {
    successChance -= 0.1; // Quiet mode reduces success chance
  }
  
  // Check if any payloads have been injected into this target
  let hasPayload = false;
  try {
    if (memoryService && typeof memoryService.getAllViruses === 'function') {
      const viruses = memoryService.getAllViruses();
      hasPayload = Object.values(viruses).some(v => v.target === target);
      
      if (hasPayload) {
        successChance += 0.3; // Having a payload significantly increases success chance
      }
    }
  } catch (error) {
    console.error('Error checking for payloads:', error);
  }
  
  // Ensure chance is within bounds
  successChance = Math.max(0.1, Math.min(0.95, successChance));
  
  // Determine if hack is successful
  const isSuccess = Math.random() < successChance;
  
  // Generate hack stages with timing
  const stages = [
    { text: 'Initiating connection to target...', time: 0.8 },
    { text: 'Bypassing firewall...', time: 1.2 },
    { text: 'Scanning for vulnerabilities...', time: 1.0 },
    { text: hasPayload ? 'Activating injected payload...' : 'Attempting exploit...', time: 1.5 },
    { text: 'Elevating privileges...', time: 1.3 },
    { text: 'Establishing persistent access...', time: 0.9 }
  ];
  
  // Format stages with timing
  const stagesText = stages.map(stage => 
    `[${(Math.random() * 0.5 + stage.time).toFixed(2)}s] ${stage.text}`
  ).join('\n');
  
  // Simulate hacking process with ASCII art
  const hackingArt = `
 _   _            _    _             
| | | | __ _  ___| | _(_)_ __   __ _ 
| |_| |/ _\` |/ __| |/ / | '_ \\ / _\` |
|  _  | (_| | (__|   <| | | | | (_| |
|_| |_|\\__,_|\\___|_|\\_\\_|_| |_|\\__, |
                               |___/ 
`;

  // Generate rewards if successful
  let rewardsText = '';
  if (isSuccess) {
    const creditsGained = Math.floor(Math.random() * 500) + 100;
    const xpGained = Math.floor(Math.random() * 200) + 50;
    
    // Update player stats if memory service is available
    try {
      if (memoryService && typeof memoryService.getPlayerData === 'function') {
        // Get current player data
        const player = memoryService.getPlayerData();
        console.log('[HACK] Current player stats before hack:', player);
        
        // Calculate new values precisely
        const oldCredits = player.credits;
        const newCredits = oldCredits + creditsGained;
        
        // Update credits directly with exact value
        memoryService.updatePlayerData({
          credits: newCredits
        });
        
        // Store the pre-hack XP for logging
        const oldXp = player.xp;
        const oldXpToNextLevel = player.xpToNextLevel;
        const oldLevel = player.level;
        
        // Add XP and handle level-ups
        const xpResult = memoryService.addPlayerXP(xpGained);
        console.log(`[HACK] Player stats after hack: Credits ${oldCredits} -> ${newCredits}, XP ${oldXp}/${oldXpToNextLevel} -> ${xpResult.xp}/${xpResult.xpToNextLevel}, Level ${oldLevel} -> ${xpResult.level}`);
        
        // Mark target as hacked in memory
        const targetData = memoryService.getTarget(target) || {};
        memoryService.addTarget({
          ...targetData,
          id: target,
          name: target,
          hacked: true,
          hackedAt: new Date().toISOString()
        });
        
        // Add level up message if player leveled up
        let levelUpText = '';
        if (xpResult.leveledUp) {
          levelUpText = `\n\nLEVEL UP! You are now level ${xpResult.level}!`;
        }
        
        // Format the XP change correctly
        let xpChangeText;
        if (xpResult.leveledUp) {
          // If leveled up, show the transition through levels
          xpChangeText = `${oldXp}/${oldXpToNextLevel} → ${xpResult.xp}/${xpResult.xpToNextLevel}`;
        } else {
          // If no level up, show simple addition
          xpChangeText = `${oldXp}/${oldXpToNextLevel} → ${xpResult.xp}/${oldXpToNextLevel}`;
        }
        
        rewardsText = `\nRewards:
- Credits: +${creditsGained} (${oldCredits} → ${newCredits})
- XP: +${xpGained} (${xpChangeText})
- Access to ${target} system${levelUpText}`;
      }
    } catch (error) {
      console.error('[HACK] Error updating player stats:', error);
    }

    // Add target-specific rewards
    if (targetInfo) {
      if (targetInfo.reward === 'high' || targetInfo.reward === 'very high') {
        rewardsText += '\n- Valuable data acquired';
      }
      if (target === 'database') {
        rewardsText += '\n- Database credentials acquired';
      }
      if (target === 'mainframe') {
        rewardsText += '\n- Advanced security bypass codes acquired';
      }
    }
  }

  return {
    text: `${hackingArt}
Target: ${target}${targetInfo ? ` (${targetInfo.description})` : ''}
Security Level: ${Math.round(securityLevel * 10)}/10
${hasPayload ? 'Advantage: Injected payload detected' : ''}

${stagesText}

${isSuccess 
  ? `HACK SUCCESSFUL!\nAccess granted to ${target} system.${rewardsText}` 
  : `HACK FAILED!\nTarget security measures blocked the attempt.\nTry injecting a payload first or using the --bruteforce flag.`}`,
    type: isSuccess ? 'success' : 'error',
    action: isSuccess ? 'HACK_SUCCESS' : 'HACK_FAILURE',
    target,
    result: {
      success: isSuccess,
      target: target,
      securityLevel: Math.round(securityLevel * 10)
    }
  };
};

/**
 * Handle the decrypt command
 * @param {Array} args - Command arguments
 * @param {object} flags - Command flags
 * @returns {object} Response object
 */
const handleDecryptCommand = async (args, flags) => {
  // Check if a target is specified
  if (args.length === 0) {
    return {
      text: 'Error: No target specified. Usage: decrypt [target]',
      type: 'error'
    };
  }
  
  const target = args[0];
  
  // Generate a random encrypted message
  const encryptedMessage = applyGlitchEffect('This is a secret message that has been encrypted.', 0.7);
  
  // Simulate decryption process
  return {
    text: `Decrypting ${target}...

Encrypted data:
${encryptedMessage}

Applying decryption algorithms...
Analyzing patterns...
Breaking encryption...

Decryption successful!

Decrypted data:
This is a secret message that has been encrypted.

Decryption complete.`,
    type: 'success',
    action: 'DECRYPT_SUCCESS',
    target
  };
};

/**
 * Handle the debug command
 * @param {Array} args - Command arguments
 * @returns {object} Response object
 */
const handleDebugCommand = (args) => {
  if (args.length > 0 && args[0] === 'xp') {
    try {
      // Get current player data
      if (memoryService && typeof memoryService.getPlayerData === 'function') {
        const player = memoryService.getPlayerData();
        
        // Calculate total XP earned
        let totalXp = 0;
        let xpToNextLevel = 100; // Base XP for level 1
        
        // Add XP from completed levels
        for (let i = 1; i < player.level; i++) {
          totalXp += xpToNextLevel;
          xpToNextLevel = Math.floor(xpToNextLevel * 1.5);
        }
        
        // Add current level's XP
        totalXp += player.xp;
        
        return {
          text: `XP Debug Information:
- Current Level: ${player.level}
- Current XP: ${player.xp}/${player.xpToNextLevel}
- Total XP Earned: ${totalXp}
- XP Required for Next Level: ${player.xpToNextLevel}
- XP Required for Level ${player.level + 1}: ${player.xpToNextLevel}
- XP Required for Level ${player.level + 2}: ${Math.floor(player.xpToNextLevel * 1.5)}

This information can help diagnose XP calculation issues.`,
          type: 'info'
        };
      }
    } catch (error) {
      console.error('Error in debug command:', error);
      return {
        text: `Error running debug command: ${error.message}`,
        type: 'error'
      };
    }
  } else if (args.length > 0 && args[0] === 'state') {
    try {
      // Get current game state
      if (memoryService) {
        const player = memoryService.getPlayerData();
        const missions = memoryService.getMissions();
        const targets = memoryService.getAllTargets();
        const viruses = memoryService.getAllViruses();
        
        return {
          text: `Game State Debug Information:
          
Player:
- Level: ${player.level}
- XP: ${player.xp}/${player.xpToNextLevel}
- Credits: ${player.credits}
- Reputation: ${player.reputation}

Missions: ${missions.length} total
- Active: ${missions.filter(m => m.status === 'active').length}
- Completed: ${missions.filter(m => m.status === 'completed').length}
- Available: ${missions.filter(m => m.status === 'available').length}

Targets: ${Object.keys(targets).length} total
- Hacked: ${Object.values(targets).filter(t => t.hacked).length}

Viruses: ${Object.keys(viruses).length} total

This information shows the current state of your game.`,
          type: 'info'
        };
      }
    } catch (error) {
      console.error('Error in debug command:', error);
      return {
        text: `Error running debug command: ${error.message}`,
        type: 'error'
      };
    }
  }
  
  return {
    text: `Usage: debug [option]
Available options:
- xp: Show detailed XP calculation information
- state: Show current game state information`,
    type: 'info'
  };
};

/**
 * Handle the fix command
 * @param {Array} args - Command arguments
 * @returns {object} Response object
 */
const handleFixCommand = (args) => {
  if (args.length > 0 && args[0] === 'stats') {
    try {
      // Get current player data
      if (memoryService && typeof memoryService.getPlayerData === 'function') {
        const player = memoryService.getPlayerData();
        console.log('[FIX] Current player stats before fix:', player);
        
        // Store original values for reporting
        const originalLevel = player.level;
        const originalXp = player.xp;
        const originalXpToNextLevel = player.xpToNextLevel;
        const originalCredits = player.credits;
        
        // Calculate correct level based on XP
        let totalXp = 0;
        let xp = player.xp;
        let level = player.level;
        let xpToNextLevel = 100; // Base XP for level 1
        
        // Calculate total XP based on current level and remaining XP
        for (let i = 1; i < level; i++) {
          totalXp += xpToNextLevel;
          xpToNextLevel = Math.floor(xpToNextLevel * 1.5);
        }
        totalXp += xp;
        
        console.log(`[FIX] Calculated total XP: ${totalXp}`);
        
        // Reset and recalculate level based on total XP
        level = 1;
        xp = totalXp;
        xpToNextLevel = 100;
        
        // Process level-ups based on accumulated XP
        while (xp >= xpToNextLevel) {
          level += 1;
          xp -= xpToNextLevel;
          xpToNextLevel = Math.floor(xpToNextLevel * 1.5);
        }
        
        // Update player stats with corrected values
        memoryService.updatePlayerData({
          level: level,
          xp: xp,
          xpToNextLevel: xpToNextLevel
        });
        
        const fixedPlayer = memoryService.getPlayerData();
        console.log('[FIX] Player stats after fix:', fixedPlayer);
        
        return {
          text: `Player stats have been fixed:
- Level: ${originalLevel} → ${fixedPlayer.level}
- XP: ${originalXp}/${originalXpToNextLevel} → ${fixedPlayer.xp}/${fixedPlayer.xpToNextLevel}
- Credits: ${fixedPlayer.credits}
- Reputation: ${fixedPlayer.reputation}

Your stats have been adjusted to be consistent with your progress.`,
          type: 'success',
          action: 'FIX_STATS'
        };
      }
    } catch (error) {
      console.error('[FIX] Error fixing player stats:', error);
      return {
        text: `Error fixing player stats: ${error.message}`,
        type: 'error'
      };
    }
  }
  
  return {
    text: `Usage: fix [option]
Available options:
- stats: Fix player statistics to be consistent with your progress`,
    type: 'info'
  };
};

/**
 * Handle the reset command
 * @param {Array} args - Command arguments
 * @returns {object} Response object
 */
const handleResetCommand = (args) => {
  if (args.length > 0 && args[0] === 'stats') {
    try {
      // Reset player stats
      if (memoryService && typeof memoryService.updatePlayerData === 'function') {
        // Get current credits for logging
        const currentPlayer = memoryService.getPlayerData();
        console.log('Player stats before reset:', currentPlayer);
        
        // Reset to default values
        memoryService.updatePlayerData({
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          credits: 500,  // Changed from 1000 to 500 to match your starting value
          reputation: 0
        });
        
        const resetPlayer = memoryService.getPlayerData();
        console.log('Player stats after reset:', resetPlayer);
        
        return {
          text: `Player stats have been reset to default values:
- Level: 1
- XP: 0/100
- Credits: 500
- Reputation: 0

Your game progress has been reset.`,
          type: 'success',
          action: 'RESET_STATS'
        };
      }
    } catch (error) {
      console.error('Error resetting player stats:', error);
      return {
        text: `Error resetting player stats: ${error.message}`,
        type: 'error'
      };
    }
  } else if (args.length > 0 && args[0] === 'all') {
    try {
      // Reset entire game state
      if (memoryService && typeof memoryService.resetMemory === 'function') {
        memoryService.resetMemory();
        
        return {
          text: `Complete game reset performed.
All progress, missions, targets, and player stats have been reset to default values.

Your game has been reset to its initial state.`,
          type: 'success',
          action: 'RESET_ALL'
        };
      }
    } catch (error) {
      console.error('Error performing complete reset:', error);
      return {
        text: `Error performing complete reset: ${error.message}`,
        type: 'error'
      };
    }
  }
  
  return {
    text: `Usage: reset [option]
Available options:
- stats: Reset player statistics to default values
- all: Reset entire game state (all progress will be lost)`,
    type: 'info'
  };
};

/**
 * Handle the analyze command
 * @param {Array} args - Command arguments
 * @param {object} flags - Command flags
 * @returns {object} Response object
 */
const handleAnalyzeCommand = async (args, flags) => {
  // Check if a target is specified
  if (args.length === 0) {
    return {
      text: 'Error: No target specified. Usage: analyze [target]',
      type: 'error'
    };
  }
  
  const target = args[0];
  
  // Generate analysis results
  return {
    text: `Analyzing ${target}...

Analysis complete.

Results:
- File type: ${['Executable', 'Document', 'Image', 'Audio', 'Video', 'Archive'][Math.floor(Math.random() * 6)]}
- Size: ${Math.floor(Math.random() * 1000) + 1} KB
- Created: ${new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString().split('T')[0]}
- Modified: ${new Date(Date.now() - Math.floor(Math.random() * 2592000000)).toISOString().split('T')[0]}
- Hash: ${uuidv4().replace(/-/g, '')}
- Threat level: ${['None', 'Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 5)]}

No malicious code detected.`,
    type: 'success',
    action: 'ANALYZE_COMPLETE',
    target
  };
};

export { parseCommand, processCommand };
/**
 * Handle the mission command
 * @param {Array} args - Command arguments
 * @param {object} flags - Command flags
 * @returns {object} Response object
 */
const handleMissionCommand = async (args, flags) => {
  // Check for subcommands
  if (args.length === 0) {
    // List available missions
    let missionList = '';
    try {
      if (memoryService && typeof memoryService.getMissions === 'function') {
        const missions = memoryService.getMissions('available');
        
        if (missions && missions.length > 0) {
          missionList = '\n\nAvailable Missions:\n' + missions.map((mission, index) => 
            `${index + 1}. ${mission.title} (Difficulty: ${mission.difficulty}, Reward: ${mission.creditReward} credits)`
          ).join('\n');
        } else {
          missionList = '\n\nNo missions currently available. Use "mission generate" to create a new mission.';
        }
      }
    } catch (error) {
      console.error('Error getting missions:', error);
      missionList = '\n\nError retrieving mission data.';
    }
    
    return {
      text: `Mission System
Use the following commands:
- mission generate - Generate a new mission
- mission accept [id] - Accept a mission
- mission info [id] - View mission details
- mission complete [id] - Complete a mission${missionList}`,
      type: 'info'
    };
  }
  
  const subcommand = args[0].toLowerCase();
  
  switch (subcommand) {
    case 'generate':
      // Generate a new mission using AI
      try {
        // Define mission types
        const missionTypes = [
          'data theft',
          'system infiltration',
          'ransomware deployment',
          'surveillance',
          'sabotage',
          'information retrieval',
          'backdoor installation'
        ];
        
        // Define difficulty levels
        const difficultyLevels = ['easy', 'medium', 'hard', 'expert'];
        
        // Randomly select mission type and difficulty
        const missionType = missionTypes[Math.floor(Math.random() * missionTypes.length)];
        const difficulty = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
        
        // Try to get AI-generated mission briefing
        let missionBriefing = null;
        try {
          console.log('Generating mission briefing with AI...');
          missionBriefing = await groqService.getMissionBriefing(missionType, difficulty);
        } catch (aiError) {
          console.error('Error generating mission briefing with AI:', aiError);
        }
        
        // If AI failed, generate a fallback mission
        if (!missionBriefing) {
          console.log('Using fallback mission generator');
          
          // Generate target
          const targets = [
            'MegaCorp Industries',
            'Nexus Dynamics',
            'Quantum Security',
            'CyberTech Solutions',
            'Global Financial Systems',
            'Helix Research',
            'Vertex Networks',
            'Synapse Medical',
            'Eclipse Energy',
            'Meridian Defense'
          ];
          
          const target = targets[Math.floor(Math.random() * targets.length)];
          
          // Generate mission name
          const missionNames = [
            'Shadow Protocol',
            'Digital Heist',
            'Silent Intrusion',
            'Data Breach',
            'Ghost Access',
            'System Override',
            'Cipher Break',
            'Network Phantom',
            'Binary Infiltration',
            'Quantum Breach'
          ];
          
          const missionName = missionNames[Math.floor(Math.random() * missionNames.length)];
          
          // Generate objectives based on mission type
          let objective = '';
          switch (missionType) {
            case 'data theft':
              objective = `Infiltrate ${target}'s database and extract sensitive files`;
              break;
            case 'system infiltration':
              objective = `Gain admin access to ${target}'s main server`;
              break;
            case 'ransomware deployment':
              objective = `Deploy ransomware to ${target}'s network and demand payment`;
              break;
            case 'surveillance':
              objective = `Install monitoring software on ${target}'s systems`;
              break;
            case 'sabotage':
              objective = `Disrupt ${target}'s operations by corrupting their systems`;
              break;
            case 'information retrieval':
              objective = `Extract specific information from ${target}'s secure database`;
              break;
            case 'backdoor installation':
              objective = `Install a persistent backdoor in ${target}'s security system`;
              break;
            default:
              objective = `Hack into ${target}'s systems and extract valuable data`;
          }
          
          // Generate rewards based on difficulty
          let creditReward = 0;
          let xpReward = 0;
          let reputationReward = 0;
          
          switch (difficulty) {
            case 'easy':
              creditReward = Math.floor(Math.random() * 300) + 200; // 200-500
              xpReward = Math.floor(Math.random() * 100) + 50; // 50-150
              reputationReward = 1;
              break;
            case 'medium':
              creditReward = Math.floor(Math.random() * 500) + 500; // 500-1000
              xpReward = Math.floor(Math.random() * 150) + 150; // 150-300
              reputationReward = 2;
              break;
            case 'hard':
              creditReward = Math.floor(Math.random() * 1000) + 1000; // 1000-2000
              xpReward = Math.floor(Math.random() * 250) + 250; // 250-500
              reputationReward = 3;
              break;
            case 'expert':
              creditReward = Math.floor(Math.random() * 2000) + 2000; // 2000-4000
              xpReward = Math.floor(Math.random() * 500) + 500; // 500-1000
              reputationReward = 5;
              break;
          }
          
          // Generate background
          const backgrounds = [
            `${target} has been involved in illegal activities and needs to be exposed.`,
            `A rival corporation has hired you to gather intelligence on ${target}.`,
            `${target} has valuable data that could be sold for a high price on the black market.`,
            `An insider at ${target} has provided initial access but needs your help to complete the job.`,
            `${target} has implemented new security measures that need to be tested.`,
            `A whistleblower needs evidence of corruption within ${target}.`,
            `${target} has been targeting your allies, and it's time for payback.`,
            `A security vulnerability has been discovered in ${target}'s systems that needs to be exploited quickly.`
          ];
          
          const background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
          
          // Create mission briefing
          missionBriefing = `Mission Name: ${missionName}
Target: ${target}
Objective: ${objective}
Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
Potential Rewards:
- Credits: ${creditReward}
- XP: ${xpReward}
- Reputation: +${reputationReward}

Background: ${background}`;
        }
        
        // Create mission object
        const missionId = `mission-${Date.now()}`;
        const difficultyRating = {
          'easy': 1,
          'medium': 2,
          'hard': 3,
          'expert': 4
        }[difficulty] || 2;
        
        const creditReward = difficultyRating * (Math.floor(Math.random() * 300) + 200);
        const xpReward = difficultyRating * (Math.floor(Math.random() * 50) + 50);
        const reputationReward = difficultyRating;
        
        const mission = {
          id: missionId,
          title: missionBriefing.split('\n')[0].replace('Mission Name: ', ''),
          description: missionBriefing,
          type: missionType,
          difficulty: difficultyRating,
          creditReward,
          xpReward,
          reputationReward,
          status: 'available',
          createdAt: new Date().toISOString()
        };
        
        // Store mission in memory
        try {
          if (memoryService && typeof memoryService.addMission === 'function') {
            memoryService.addMission(mission);
          }
        } catch (memError) {
          console.error('Error storing mission:', memError);
        }
        
        return {
          text: `New mission generated!

${missionBriefing}

Mission ID: ${missionId}
Use "mission accept ${missionId}" to accept this mission.`,
          type: 'success',
          action: 'MISSION_GENERATED',
          mission
        };
      } catch (error) {
        console.error('Error generating mission:', error);
        return {
          text: `Error generating mission: ${error.message}`,
          type: 'error'
        };
      }
      
    case 'accept':
      // Accept a mission
      if (args.length < 2) {
        return {
          text: 'Error: No mission ID specified. Usage: mission accept [id]',
          type: 'error'
        };
      }
      
      const acceptMissionId = args[1];
      
      try {
        if (memoryService && typeof memoryService.getMissions === 'function') {
          const missions = memoryService.getMissions();
          const mission = missions.find(m => m.id === acceptMissionId);
          
          if (!mission) {
            return {
              text: `Error: Mission ${acceptMissionId} not found.`,
              type: 'error'
            };
          }
          
          if (mission.status !== 'available') {
            return {
              text: `Error: Mission ${acceptMissionId} is already ${mission.status}.`,
              type: 'error'
            };
          }
          
          // Update mission status
          if (typeof memoryService.updateMissionStatus === 'function') {
            memoryService.updateMissionStatus(acceptMissionId, 'active');
          }
          
          return {
            text: `Mission accepted: ${mission.title}

${mission.description}

Use "mission complete ${acceptMissionId}" when you have completed the objective.`,
            type: 'success',
            action: 'MISSION_ACCEPTED',
            mission
          };
        }
      } catch (error) {
        console.error('Error accepting mission:', error);
      }
      
      return {
        text: `Error: Could not accept mission ${acceptMissionId}.`,
        type: 'error'
      };
      
    case 'info':
      // Show mission info
      if (args.length < 2) {
        return {
          text: 'Error: No mission ID specified. Usage: mission info [id]',
          type: 'error'
        };
      }
      
      const infoMissionId = args[1];
      
      try {
        if (memoryService && typeof memoryService.getMissions === 'function') {
          const missions = memoryService.getMissions();
          const mission = missions.find(m => m.id === infoMissionId);
          
          if (!mission) {
            return {
              text: `Error: Mission ${infoMissionId} not found.`,
              type: 'error'
            };
          }
          
          return {
            text: `Mission Information:

${mission.description}

Status: ${mission.status.charAt(0).toUpperCase() + mission.status.slice(1)}
ID: ${mission.id}`,
            type: 'info',
            mission
          };
        }
      } catch (error) {
        console.error('Error getting mission info:', error);
      }
      
      return {
        text: `Error: Could not retrieve information for mission ${infoMissionId}.`,
        type: 'error'
      };
      
    case 'complete':
      // Complete a mission
      if (args.length < 2) {
        return {
          text: 'Error: No mission ID specified. Usage: mission complete [id]',
          type: 'error'
        };
      }
      
      const completeMissionId = args[1];
      
      try {
        if (memoryService && typeof memoryService.getMissions === 'function') {
          const missions = memoryService.getMissions();
          const mission = missions.find(m => m.id === completeMissionId);
          
          if (!mission) {
            return {
              text: `Error: Mission ${completeMissionId} not found.`,
              type: 'error'
            };
          }
          
          if (mission.status !== 'active') {
            return {
              text: `Error: Mission ${completeMissionId} is not active.`,
              type: 'error'
            };
          }
          
          // Update mission status
          if (typeof memoryService.completeMission === 'function') {
            memoryService.completeMission(completeMissionId);
            
            return {
              text: `Mission completed: ${mission.title}

Rewards:
- Credits: +${mission.creditReward}
- XP: +${mission.xpReward}
- Reputation: +${mission.reputationReward}

Well done, hacker. Your reputation in the underground is growing.`,
              type: 'success',
              action: 'MISSION_COMPLETED',
              mission
            };
          }
        }
      } catch (error) {
        console.error('Error completing mission:', error);
      }
      
      return {
        text: `Error: Could not complete mission ${completeMissionId}.`,
        type: 'error'
      };
      
    default:
      return {
        text: `Unknown mission subcommand: ${subcommand}
Available subcommands: generate, accept, info, complete`,
        type: 'error'
      };
  }
};
