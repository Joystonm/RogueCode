import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from '../context/GameContext';
import { parseCommand, processCommand } from '../utils/commandParser';
import soundManager from '../utils/soundManager';

const CommandInput = () => {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  
  const { 
    addTerminalCommand, 
    addTerminalOutput, 
    terminalState,
    gameSettings
  } = useGameContext();

  // Focus input on mount and when terminal is clicked
  useEffect(() => {
    inputRef.current.focus();
    
    const handleTerminalClick = () => {
      inputRef.current.focus();
    };
    
    document.querySelector('.terminal').addEventListener('click', handleTerminalClick);
    
    return () => {
      document.querySelector('.terminal').removeEventListener('click', handleTerminalClick);
    };
  }, []);

  // Handle command submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!command.trim()) return;
    
    // Add command to terminal output
    addTerminalCommand(command);
    
    // Add to command history
    const newHistory = [command, ...commandHistory].slice(0, 50);
    setCommandHistory(newHistory);
    setHistoryIndex(-1);
    
    // Parse and process command
    const parsedCommand = parseCommand(command);
    
    // Process command with delay for realistic effect
    setTimeout(async () => {
      try {
        const response = await processCommand(parsedCommand);
        
        // Handle special commands
        if (response.action === 'CLEAR_TERMINAL') {
          // Clear terminal handled by context
        } else {
          // Add response to terminal
          addTerminalOutput(response.text, response.type);
          
          // Play sound based on response type
          if (response.type === 'error') {
            soundManager.playSound('error');
          } else if (response.type === 'success') {
            soundManager.playSound('success');
          }
        }
      } catch (error) {
        console.error('Error processing command:', error);
        addTerminalOutput(`Error: ${error.message}`, 'error');
        soundManager.playSound('error');
      }
    }, 300); // Slight delay for realism
    
    // Clear input
    setCommand('');
  };

  // Handle keyboard navigation through command history
  const handleKeyDown = (e) => {
    // Play typing sound
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
      soundManager.playSound('typewriter');
    }
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Command auto-completion would go here
      // For now, just a placeholder
      if (command.startsWith('s')) {
        setCommand('scan');
      } else if (command.startsWith('i')) {
        setCommand('inject');
      } else if (command.startsWith('h')) {
        setCommand('help');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="command-input">
      <span className="prompt">$</span>
      <input
        ref={inputRef}
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={terminalState.isProcessing}
        autoComplete="off"
        spellCheck="false"
        className={gameSettings.terminalTheme}
      />
      {terminalState.isProcessing && (
        <span className="processing-indicator">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </span>
      )}
    </form>
  );
};

export default CommandInput;
