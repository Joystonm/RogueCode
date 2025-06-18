import React, { useRef, useEffect } from 'react';
import CommandInput from './CommandInput';
import OutputDisplay from './OutputDisplay';
import { useGameContext } from '../context/GameContext';
import '../styles/terminal.css';

const Terminal = () => {
  const terminalRef = useRef(null);
  const { terminalState, gameSettings } = useGameContext();
  
  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalState.outputHistory]);

  // Apply terminal theme
  const terminalThemeClass = `terminal-theme-${gameSettings.terminalTheme}`;
  
  // Apply scanline effect based on settings
  const scanlineClass = gameSettings.scanlines ? 'scanlines' : '';
  
  // Apply glitch effect based on settings
  const glitchClass = gameSettings.glitchIntensity > 0 ? 'glitch-effect' : '';

  return (
    <div 
      className={`terminal ${terminalThemeClass} ${scanlineClass} ${glitchClass}`}
      ref={terminalRef}
    >
      <div className="terminal-header">
        <div className="terminal-title">RogueCode OS v1.0.3</div>
        <div className="terminal-controls">
          <span className="control minimize"></span>
          <span className="control maximize"></span>
          <span className="control close"></span>
        </div>
      </div>
      
      <OutputDisplay />
      <CommandInput />
      
      <div className="terminal-status-line">
        <span className="status-item">User: Rogue</span>
        <span className="status-item">Status: Connected</span>
        <span className="status-item">Uptime: {formatUptime()}</span>
      </div>
    </div>
  );
};

// Helper function to format uptime
const formatUptime = () => {
  // Get a random uptime for now - in a real app this would track actual session time
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default Terminal;
