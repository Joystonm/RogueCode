# RogueCode: AI Hacker Adventure Game

An immersive cyberpunk hacking simulation game built with React.js and AI integration.

![RogueCode Screenshot](screenshot.png)

## Project Overview

RogueCode is an interactive terminal-based game that simulates the experience of being a rogue hacker in a dystopian cyberpunk future. Players complete missions, solve puzzles, and advance through a skill tree while interacting with an AI-powered game environment.

## Features

- **Command-based Gameplay**: Type commands like `scan`, `inject`, `trace`, `download logs`, and `upgrade AI` to interact with the game world.
- **Dynamic Mission System**: Procedurally generated missions with varying difficulty levels and rewards.
- **Skill Progression**: Unlock new hacking abilities and tools as you gain experience.
- **Immersive UI**: Authentic terminal experience with CRT effects, glitch animations, and typing sounds.
- **AI Integration**: Responses powered by AI to create a dynamic and engaging experience.
- **Sound Effects**: Ambient cyberpunk soundtrack and interactive audio feedback.

## Tech Stack

- **Frontend**: React.js
- **Animation**: GSAP for advanced animations and transitions
- **Typography**: Typed.js for realistic typing effects
- **Audio**: Howler.js for sound management
- **State Management**: React Context API and custom hooks
- **Styling**: CSS with custom animations and effects
- **AI Integration**: Groq API for fast, in-character AI replies
- **Data Generation**: Custom services for generating missions, logs, and user profiles

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/roguecode-ai-game.git
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
   ```

4. Start the development server:
   ```
   npm start
   ```

## Game Commands

| Command | Description |
|---------|-------------|
| `help` | Display available commands |
| `scan [target]` | Scan a target system or network |
| `inject [payload] [target]` | Inject malware or payload into a target |
| `download [target]` | Download files or data |
| `trace [target]` | Trace a target's location or activity |
| `upgrade [component]` | Upgrade your hacking tools or skills |
| `skills` | View and manage your skill tree |
| `inventory` | View and manage your inventory |
| `missions` | View available missions |
| `connect [target]` | Connect to a remote system |
| `hack [target]` | Attempt to hack a target |
| `decrypt [target]` | Decrypt encrypted data |
| `analyze [target]` | Analyze data or systems |

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
│   │   └── Popups/
│   │       ├── MissionPopup.js
│   │       ├── AlertBox.js
│   │       ├── SkillTree.js
│   │       └── Inventory.js
│   │
│   ├── services/
│   │   ├── missionService.js
│   │   ├── logsService.js
│   │   └── userService.js
│   │
│   ├── context/
│   │   └── GameContext.js
│   │
│   ├── data/
│   │   └── skillTree.json
│   │
│   ├── hooks/
│   │   └── useTypeWriter.js
│   │
│   ├── styles/
│   │   ├── App.css
│   │   ├── terminal.css
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

## Game Mechanics

### Mission System

Missions are procedurally generated with varying:
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

## Development Roadmap

- [x] Core terminal interface
- [x] Command parsing system
- [x] Visual effects and animations
- [x] Sound integration
- [x] Mission generation
- [x] Skill tree implementation
- [ ] Full mission gameplay loop
- [ ] Advanced AI integration
- [ ] Storyline progression
- [ ] Achievement system
- [ ] Save/load functionality

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Acknowledgments

- Inspired by classic hacking games and cyberpunk fiction
- Built with modern web technologies and AI integration
