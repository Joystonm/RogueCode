import { v4 as uuidv4 } from 'uuid';
import { applyGlitchEffect } from './glitchText';
import soundManager from './soundManager';

/**
 * Parse and process user commands
 * @param {string} input - The command input from the user
 * @returns {object} The parsed command with action and arguments
 */
const parseCommand = (input) => {
  if (!input || input.trim() === '') {
    return { action: null, args: [] };
  }

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
};

/**
 * Process a command and return the appropriate response
 * @param {object} command - The parsed command object
 * @returns {object} The response object with text and type
 */
const processCommand = async (command) => {
  const { action, args, flags } = command;

  // Basic command handling
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
      return handleScanCommand(args, flags);
      
    case 'inject':
      return handleInjectCommand(args, flags);
      
    case 'download':
      return handleDownloadCommand(args, flags);
      
    case 'trace':
      return handleTraceCommand(args, flags);
      
    case 'upgrade':
      return handleUpgradeCommand(args, flags);
      
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
      return { 
        text: 'Available missions:', 
        type: 'info',
        action: 'LIST_MISSIONS'
      };
      
    case 'connect':
      return handleConnectCommand(args);
      
    case 'exit':
      return { 
        text: 'Disconnecting from current system...', 
        type: 'system',
        action: 'EXIT_SYSTEM'
      };
      
    case 'hack':
      return handleHackCommand(args, flags);
      
    case 'decrypt':
      return handleDecryptCommand(args, flags);
      
    case 'analyze':
      return handleAnalyzeCommand(args, flags);
      
    default:
      return {
        text: `Command not recognized: ${action}. Type 'help' for available commands.`,
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
Options:
  --stealth   Use stealth mode (slower but less detectable)
  --force     Force injection (may trigger alarms)
Examples:
  inject malware server
  inject keylogger workstation --stealth
  inject rootkit firewall --force`,
          type: 'info'
        };
        
      // Add more command-specific help here
        
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
  missions   - View available missions
  connect    - Connect to a remote system
  exit       - Exit the current system
  hack       - Attempt to hack a target
  decrypt    - Decrypt encrypted data
  analyze    - Analyze data or systems

Type 'help [command]' for more information on a specific command.`,
    type: 'info'
  };
};

/**
 * Handle the status command
 * @returns {object} Response object
 */
const handleStatusCommand = () => {
  return {
    text: `
System Status: Online
Connection: Secure
Trace Status: Clean
Active Processes: 3
Memory Usage: 42%
CPU Usage: 17%
Detected Threats: 0`,
    type: 'info'
  };
};

/**
 * Handle the scan command
 * @param {Array} args - Command arguments
 * @param {object} flags - Command flags
 * @returns {object} Response object
 */
const handleScanCommand = (args, flags) => {
  // Check if a target is specified
  if (args.length === 0) {
    return {
      text: 'Error: No target specified. Usage: scan [target]',
      type: 'error'
    };
  }
  
  const target = args[0];
  
  // Simulate scanning process
  if (flags.deep) {
    // Deep scan takes longer
    return {
      text: `Initiating deep scan of ${target}...\nThis may take a while...`,
      type: 'system',
      action: 'START_DEEP_SCAN',
      target
    };
  }
  
  // Generate random scan results
  const openPorts = [];
  const numPorts = Math.floor(Math.random() * 5) + 1;
  
  const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 3306, 3389, 5432, 8080];
  
  for (let i = 0; i < numPorts; i++) {
    const randomIndex = Math.floor(Math.random() * commonPorts.length);
    const port = commonPorts[randomIndex];
    
    if (!openPorts.includes(port)) {
      openPorts.push(port);
    }
  }
  
  // Sort ports
  openPorts.sort((a, b) => a - b);
  
  // Generate vulnerabilities if requested
  let vulnText = '';
  if (flags.vulns) {
    const vulnCount = Math.floor(Math.random() * 3);
    
    if (vulnCount > 0) {
      const vulns = [
        'Outdated OpenSSL (CVE-2023-0286)',
        'SQL Injection in login form',
        'Cross-Site Scripting in search function',
        'Default credentials (admin/admin)',
        'Directory traversal vulnerability',
        'Remote code execution in file upload'
      ];
      
      vulnText = '\n\nVulnerabilities detected:';
      
      for (let i = 0; i < vulnCount; i++) {
        const randomIndex = Math.floor(Math.random() * vulns.length);
        vulnText += `\n- ${vulns[randomIndex]}`;
        vulns.splice(randomIndex, 1);
      }
    } else {
      vulnText = '\n\nNo vulnerabilities detected.';
    }
  }
  
  // Generate response
  return {
    text: `Scan results for ${target}:
IP: 192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}
Status: ${Math.random() > 0.2 ? 'Online' : 'Offline'}
OS: ${['Linux 5.15', 'Windows Server 2019', 'FreeBSD 13.1', 'Ubuntu 22.04'][Math.floor(Math.random() * 4)]}
Open ports: ${openPorts.join(', ')}${vulnText}`,
    type: 'success'
  };
};

/**
 * Handle the inject command
 * @param {Array} args - Command arguments
 * @param {object} flags - Command flags
 * @returns {object} Response object
 */
const handleInjectCommand = (args, flags) => {
  // Check if payload and target are specified
  if (args.length < 2) {
    return {
      text: 'Error: Insufficient arguments. Usage: inject [payload] [target]',
      type: 'error'
    };
  }
  
  const payload = args[0];
  const target = args[1];
  
  // Generate a UUID for the payload
  const payloadId = uuidv4().substring(0, 8);
  
  // Determine success chance based on flags
  let successChance = 0.8; // 80% base chance
  
  if (flags.stealth) {
    successChance -= 0.1; // Stealth reduces success chance
  }
  
  if (flags.force) {
    successChance += 0.15; // Force increases success chance
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

Try using --force flag or a different payload.`,
      type: 'error'
    };
  }
  
  // Generate loading animation text
  const loadingText = `Injecting ${payload} into ${target} █████▒▒▒▒▒ 60%`;
  
  // Generate success message
  return {
    text: `${loadingText}

Injection successful!
Payload ID: 0x${payloadId}
Target: ${target}
Status: ${flags.stealth ? 'Hidden' : 'Active'}
Detection Risk: ${flags.stealth ? 'Low' : flags.force ? 'High' : 'Medium'}

${flags.stealth ? 'Stealth mode active: Payload is running with minimal footprint.' : ''}
${flags.force ? 'Warning: Force mode may have triggered security alerts.' : ''}`,
    type: 'success'
  };
};

/**
 * Handle the download command
 * @param {Array} args - Command arguments
 * @param {object} flags - Command flags
 * @returns {object} Response object
 */
const handleDownloadCommand = (args, flags) => {
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
const handleTraceCommand = (args, flags) => {
  // Check if a target is specified
  if (args.length === 0) {
    return {
      text: 'Error: No target specified. Usage: trace [target]',
      type: 'error'
    };
  }
  
  const target = args[0];
  
  // Generate random user data
  const firstName = ['John', 'Jane', 'Alex', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia'][Math.floor(Math.random() * 8)];
  const lastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia'][Math.floor(Math.random() * 8)];
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'][Math.floor(Math.random() * 4)]}`;
  const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
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
${target} → ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)} → ${ip}

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
const handleUpgradeCommand = (args, flags) => {
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
 * Handle the connect command
 * @param {Array} args - Command arguments
 * @returns {object} Response object
 */
const handleConnectCommand = (args) => {
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
 * Handle the hack command
 * @param {Array} args - Command arguments
 * @param {object} flags - Command flags
 * @returns {object} Response object
 */
const handleHackCommand = (args, flags) => {
  // Check if a target is specified
  if (args.length === 0) {
    return {
      text: 'Error: No target specified. Usage: hack [target]',
      type: 'error'
    };
  }
  
  const target = args[0];
  
  // Simulate hacking process with ASCII art
  const hackingArt = `
 _   _            _    _             
| | | | __ _  ___| | _(_)_ __   __ _ 
| |_| |/ _\` |/ __| |/ / | '_ \\ / _\` |
|  _  | (_| | (__|   <| | | | | (_| |
|_| |_|\\__,_|\\___|_|\\_\\_|_| |_|\\__, |
                               |___/ 
`;

  return {
    text: `${hackingArt}
Initiating hack on ${target}...
Bypassing firewall...
Exploiting vulnerabilities...
Gaining access...

${Math.random() > 0.3 ? 'Hack successful! You now have access to the system.' : 'Hack failed. Target security measures blocked the attempt.'}`,
    type: Math.random() > 0.3 ? 'success' : 'error',
    action: Math.random() > 0.3 ? 'HACK_SUCCESS' : 'HACK_FAILURE',
    target
  };
};

/**
 * Handle the decrypt command
 * @param {Array} args - Command arguments
 * @param {object} flags - Command flags
 * @returns {object} Response object
 */
const handleDecryptCommand = (args, flags) => {
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
 * Handle the analyze command
 * @param {Array} args - Command arguments
 * @param {object} flags - Command flags
 * @returns {object} Response object
 */
const handleAnalyzeCommand = (args, flags) => {
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
