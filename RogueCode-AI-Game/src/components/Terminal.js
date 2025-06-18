import React, { useRef, useEffect, useState } from 'react';
import CommandInput from './CommandInput';
import OutputDisplay from './OutputDisplay';
import ContextMenu from './ContextMenu';
import { useGameContext } from '../context/GameContext';
import '../styles/terminal.css';

const Terminal = () => {
  const terminalRef = useRef(null);
  const { terminalState, gameSettings } = useGameContext();
  const [selectedText, setSelectedText] = useState('');
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0
  });
  
  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalState.outputHistory]);

  // Handle text selection in the terminal
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection.toString()) {
      setSelectedText(selection.toString());
    }
  };

  // Handle right-click for context menu
  const handleContextMenu = (e) => {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection.toString()) {
      setSelectedText(selection.toString());
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    if (selectedText) {
      navigator.clipboard.writeText(selectedText)
        .then(() => {
          console.log('Text copied to clipboard');
          setShowCopyTooltip(true);
          setTimeout(() => setShowCopyTooltip(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Ctrl+C or Cmd+C to copy
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      handleCopy();
    }
  };

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

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
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >
      <div className="terminal-header">
        <div className="terminal-title">RogueCode OS v1.0.3</div>
        <div className="terminal-controls">
          {selectedText && (
            <button 
              className="copy-button" 
              onClick={handleCopy}
              title="Copy selected text"
            >
              Copy
            </button>
          )}
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
        {showCopyTooltip && <span className="copy-tooltip">Copied to clipboard!</span>}
      </div>

      {contextMenu.visible && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={closeContextMenu}
          onCopy={handleCopy}
        />
      )}
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
