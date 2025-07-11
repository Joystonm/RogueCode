# RogueCode: AI Hacke Adventure Game

An immersive cyberpunk hacking simulation game built with React.js and AI integration.

## Project Overview

RogueCode is an interactive terminal-based game that simulates the experience of being a rogue hacker in a dystopian cyberpunk future. Players complete missions, solve puzzles, and advance through a skill tree while interacting with an AI-powered game environment.

## Features

- **Command-based Gameplay**: Type commands like `scan`, `inject`, `hack`, `trace`, and more to interact with the game world.
- **Dynamic Mission System**: AI-generated missions with varying difficulty levels and rewards.
- **AI Integration**: AI-powered responses that adapt to your gameplay style via Tavily API and Groq
- **Skill Progression**: Unlock new hacking abilities and tools as you gain experience.
- **Immersive UI**: Authentic terminal experience with CRT effects, glitch animations, and typing sounds.
- **Sound Effects**: Ambient cyberpunk soundtrack and interactive audio feedback.
- **Comprehensive Help System**: Interactive help panel with detailed command documentation.
- **Copy-Paste Functionality**: Easy text selection and copying from the terminal.

## Tech Stack

- **Frontend**: React.js
- **Animation**: GSAP for advanced animations and transitions
- **Typography**: Custom typewriter effect for realistic typing
- **Audio**: Sound management with custom audio system
- **Styling**: CSS with custom animations and effects
- **AI Integration**:
  - Groq API for fast, in-character AI responses
- **Search & Data**:
  - Tavily API for intelligent search capabilities
  - RandomUser API for generating realistic user profiles
- **Data Generation**: Custom services for generating missions, targets, and user profiles
- **Local Storage**: Persistent game state using browser storage
- **UUID Generation**: Custom UUID service for unique identifiers

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. ```
   cd roguecode-ai-game
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:

   ```
   REACT_APP_GROQ_API_KEY=your_groq_api_key_here
   REACT_APP_TAVILY_API_KEY=your_tavily_api_key_here


   # API URLs
   REACT_APP_GROQ_API_URL=https://api.groq.com/openai/v1
   REACT_APP_TAVILY_API_URL=https://api.tavily.com/v1
   ```

4. Start the development server:
   ```
   npm start
   ```

## Game Commands

| Command                     | Description                                 | Options                                  |
| --------------------------- | ------------------------------------------- | ---------------------------------------- |
| `help`                      | Display help information or open help panel | `help [command]`                         |
| `scan [target]`             | Scan a target system or network             | `--vulns`, `--deep`, `--ports`           |
| `inject [payload] [target]` | Inject malware or payload into a target     | `--stealth`, `--force`                   |
| `hack [target]`             | Attempt to hack a target                    | `--bruteforce`, `--quiet`                |
| `mission`                   | Manage hacking missions                     | `generate`, `accept`, `info`, `complete` |
| `download [target]`         | Download files or data                      |                                          |
| `trace [target]`            | Trace a target's location or activity       |                                          |
| `upgrade [component]`       | Upgrade your hacking tools or skills        |                                          |
| `skills`                    | View and manage your skill tree             |                                          |
| `inventory`                 | View and manage your inventory              |                                          |
| `connect [target]`          | Connect to a remote system                  |                                          |
| `decrypt [target]`          | Decrypt encrypted data                      |                                          |
| `analyze [target]`          | Analyze data or systems                     |                                          |
| `status`                    | Show current status and stats               |                                          |
| `test [service]`            | Test API connections and services           | `groq`, `tavily`, `memory`, `uuid`       |

## Payload Types

| Payload      | Description                               | Best Used Against  |
| ------------ | ----------------------------------------- | ------------------ |
| `malware`    | General purpose malware                   | All targets        |
| `keylogger`  | Records keystrokes on target system       | Workstations       |
| `rootkit`    | Advanced persistent threat                | Servers, Firewalls |
| `ransomware` | Encrypts target files and demands payment | Databases          |
| `trojan`     | Disguised as legitimate software          | Workstations       |
| `worm`       | Self-replicating malware                  | Networks           |
| `spyware`    | Surveillance software                     | All targets        |

## Target Types

| Target        | Security Level | Reward Level |
| ------------- | -------------- | ------------ |
| `server`      | High           | High         |
| `workstation` | Low            | Low          |
| `firewall`    | Very High      | Medium       |
| `router`      | Medium         | Medium       |
| `database`    | High           | High         |
| `mainframe`   | Very High      | Very High    |
| `iot`         | Low            | Low          |
| `phone`       | Medium         | Medium       |
| `camera`      | Low            | Low          |
| `atm`         | High           | High         |

## Help System

The game includes a comprehensive help system that can be accessed in multiple ways:

- Click the **Help** button in the top-right corner
- Press **F1** or **Ctrl+H** keyboard shortcuts
- Type `help` in the terminal

The help panel includes detailed information about:

- General commands
- Scanning systems
- Injecting payloads
- Hacking targets
- Completing missions
- Advanced commands

## Mission System

The mission system allows players to:

1. Generate new missions using `mission generate`
2. Accept missions using `mission accept [id]`
3. View mission details using `mission info [id]`
4. Complete missions using `mission complete [id]`

Missions provide objectives, context, and rewards for your hacking activities. Higher difficulty missions provide better rewards.

## Project Structure

```
RogueCode-AI-Game/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── sounds/
│       ├── typewriter.mp3
│       ├── glitch.mp3
│       └── alert.wav
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   └── logo.svg
│   │   └── audio/
│   │       ├── ambient.mp3
│   │       └── mission-complete.mp3
│   │
│   ├── components/
│   │   ├── Terminal.js
│   │   ├── CommandInput.js
│   │   ├── OutputDisplay.js
│   │   ├── StatusBar.js
│   │   ├── HelpPanel.js
│   │   ├── ContextMenu.js
│   │   └── Popups/
│   │       ├── MissionPopup.js
│   │       ├── AlertBox.js
│   │       ├── SkillTree.js
│   │       └── Inventory.js
│   │
│   ├── services/
│   │   ├── groqService.js
│   │   ├── tavilyService.js
│   │   ├── memoryService.js
│   │   ├── randomUserService.js
│   │   └── uuidService.js
│   │
│   ├── context/
│   │   └── GameContext.js
│   │
│   ├── hooks/
│   │   └── useTypeWriter.js
│   │
│   ├── styles/
│   │   ├── App.css
│   │   ├── terminal.css
│   │   ├── helpPanel.css
│   │   ├── contextMenu.css
│   │   ├── status-bar.css
│   │   ├── popups.css
│   │   └── animations.css
│   │
│   ├── utils/
│   │   ├── commandParser.js
│   │   ├── glitchText.js
│   │   └── soundManager.js
│   │
│   ├── App.js
│   ├── index.js
│   └── config.js
```

## AI Integration

RogueCode leverages multiple AI technologies to create a dynamic and immersive gameplay experience:

### Groq API

- Powers real-time terminal responses
- Generates scan results for different targets
- Provides fast, low-latency interactions

### OpenAI API

- Creates detailed mission briefings and objectives
- Generates complex hacking scenarios
- Powers advanced command responses

### Claude API

- Provides contextual storytelling elements
- Generates character dialogues and interactions
- Creates immersive world-building content

### Tavily API

- Powers the in-game search functionality
- Retrieves relevant information about targets
- Enhances the realism of the hacking experience

The game uses a sophisticated orchestration layer to route different types of requests to the most appropriate AI model, ensuring optimal performance and response quality for each game mechanic.

## Game Mechanics

### Hacking Process

The hacking process typically follows these steps:

1. **Scan** a target to gather information
2. **Inject** a payload to gain an advantage
3. **Hack** the target to gain access
4. **Download** or manipulate data

Different targets have different security levels, and different payloads are more effective against specific targets.

### Mission System

Missions are generated using AI with varying:

- Types (infiltration, data theft, sabotage, etc.)
- Difficulty levels (1-5)
- Targets (corporations, networks, individuals)
- Objectives (specific goals to accomplish)
- Rewards (XP, credits, reputation)

### Skill Tree

Players can unlock new abilities across different categories:

- Hacking (network infiltration, password cracking)
- Coding (scripting, automation)
- Security (stealth, anti-detection)
- Hardware (device manipulation, physical hacking)

### Inventory System

Players can acquire and use various items:

- Tools (decryptors, network scanners)
- Modules (stealth enhancers, processing boosters)
- Consumables (temporary buffs and abilities)

## Customization

### Terminal Themes

The game supports multiple terminal themes:

- Green (classic hacker aesthetic)
- Amber (retro terminal look)
- Blue (modern cyberpunk style)

### Sound Settings

Customize your audio experience:

- Enable/disable typing sounds
- Adjust volume levels
- Toggle ambient background music

## Keyboard Shortcuts

| Shortcut      | Action                               |
| ------------- | ------------------------------------ |
| F1            | Open help panel                      |
| Ctrl+H        | Open help panel                      |
| Ctrl+C        | Copy selected text                   |
| Up/Down Arrow | Navigate command history             |
| Tab           | Auto-complete commands (coming soon) |
| Escape        | Close active panel                   |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
