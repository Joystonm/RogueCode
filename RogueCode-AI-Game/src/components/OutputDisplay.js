import React, { useEffect, useRef } from 'react';
import { useGameContext } from '../context/GameContext';
import useTypeWriter from '../hooks/useTypeWriter';
import { applyGlitchEffect } from '../utils/glitchText';

const OutputDisplay = () => {
  const { terminalState, gameSettings } = useGameContext();
  const outputRef = useRef(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [terminalState.outputHistory]);

  return (
    <div className="output-display" ref={outputRef}>
      {terminalState.outputHistory.map((line) => (
        <OutputLine 
          key={line.id} 
          line={line} 
          typingSpeed={gameSettings.typingSpeed}
          glitchIntensity={gameSettings.glitchIntensity}
        />
      ))}
    </div>
  );
};

// Individual output line component with typing effect
const OutputLine = ({ line, typingSpeed, glitchIntensity }) => {
  // Apply typing effect for system messages
  const shouldAnimate = line.type !== 'command' && line.text.length > 3;
  
  // Use typewriter effect for appropriate messages
  const { displayedText, isComplete } = useTypeWriter(
    line.text,
    shouldAnimate ? typingSpeed : 0
  );
  
  // Apply glitch effect for error messages or when specified
  const shouldGlitch = line.type === 'error' || line.type === 'glitch';
  const glitchedText = shouldGlitch && glitchIntensity > 0 
    ? applyGlitchEffect(displayedText, glitchIntensity)
    : displayedText;
  
  // Special formatting for loading bars
  if (line.text.includes('█') && line.text.includes('%')) {
    return <LoadingBar line={line} />;
  }
  
  // Special formatting for ASCII art
  if (line.type === 'ascii') {
    return (
      <pre className={`output-line ${line.type}`}>
        {displayedText}
      </pre>
    );
  }
  
  return (
    <div className={`output-line ${line.type}`}>
      {glitchedText}
      {!isComplete && shouldAnimate && <span className="cursor"></span>}
    </div>
  );
};

// Loading bar component
const LoadingBar = ({ line }) => {
  // Extract percentage from text (e.g., "Loading... █████▒▒▒▒▒ 50%")
  const percentMatch = line.text.match(/(\d+)%/);
  const percent = percentMatch ? parseInt(percentMatch[1]) : 0;
  
  // Split text into parts before and after the loading bar
  const textParts = line.text.split(/[█▒]+\s/);
  const beforeText = textParts[0];
  const afterText = textParts[1] || '';
  
  // Calculate filled and empty blocks
  const totalBlocks = 10;
  const filledBlocks = Math.round((percent / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  
  return (
    <div className={`output-line ${line.type} loading-bar`}>
      {beforeText}
      <span className="loading-bar-container">
        <span className="loading-bar-filled" style={{ width: `${percent}%` }}></span>
      </span>
      <span className="loading-blocks">
        {'█'.repeat(filledBlocks)}{'▒'.repeat(emptyBlocks)}
      </span>
      {' '}
      {afterText}
    </div>
  );
};

export default OutputDisplay;
