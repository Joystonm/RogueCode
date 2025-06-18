import React, { useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import useTypeWriter from '../../hooks/useTypeWriter';
import soundManager from '../../utils/soundManager';
import { gsap } from 'gsap';

const MissionPopup = ({ mission }) => {
  const { startMission, uiState } = useGameContext();
  
  // Apply typewriter effect to mission description
  const { displayedText: displayedDescription, isComplete } = useTypeWriter(
    mission.description,
    30
  );
  
  // Apply animation when component mounts
  useEffect(() => {
    // Play mission popup sound
    soundManager.playSound('alert');
    
    // Animate popup entrance
    gsap.fromTo(
      '.mission-popup',
      { 
        opacity: 0, 
        y: -20,
        scale: 0.95
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      }
    );
    
    // Apply glitch effect to title
    gsap.fromTo(
      '.mission-title',
      { 
        skewX: 0,
        textShadow: 'none'
      },
      { 
        skewX: 5,
        textShadow: '2px 0 #ff0066, -2px 0 #00ffff',
        duration: 0.1,
        repeat: 3,
        yoyo: true,
        ease: 'none',
        delay: 0.3
      }
    );
  }, []);
  
  // Handle mission acceptance
  const handleAccept = () => {
    // Animate popup exit
    gsap.to('.mission-popup', { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
      duration: 0.2,
      onComplete: () => {
        startMission(mission);
      }
    });
  };
  
  // Handle mission decline
  const handleDecline = () => {
    // Animate popup exit
    gsap.to('.mission-popup', { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
      duration: 0.2,
      onComplete: () => {
        // Close mission popup
        uiState.showMissionPopup = false;
      }
    });
  };

  return (
    <div className="mission-popup">
      <div className="mission-popup-header">
        <div className="mission-type">{mission.type}</div>
        <h2 className="mission-title">{mission.title}</h2>
      </div>
      
      <div className="mission-content">
        <div className="mission-description">
          {displayedDescription}
          {!isComplete && <span className="cursor"></span>}
        </div>
        
        <div className="mission-details">
          <div className="mission-detail">
            <span className="detail-label">Difficulty:</span>
            <span className="detail-value difficulty-level">
              {'■'.repeat(mission.difficulty)}{'□'.repeat(5 - mission.difficulty)}
            </span>
          </div>
          
          <div className="mission-detail">
            <span className="detail-label">Target:</span>
            <span className="detail-value">{mission.target}</span>
          </div>
          
          <div className="mission-detail">
            <span className="detail-label">Rewards:</span>
            <div className="rewards-list">
              <div className="reward">
                <span className="reward-value">{mission.xpReward}</span>
                <span className="reward-type">XP</span>
              </div>
              <div className="reward">
                <span className="reward-value">{mission.creditReward}</span>
                <span className="reward-type">CREDITS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mission-actions">
        <button 
          className="action-button accept-button" 
          onClick={handleAccept}
          disabled={!isComplete}
        >
          ACCEPT
        </button>
        <button 
          className="action-button decline-button" 
          onClick={handleDecline}
        >
          DECLINE
        </button>
      </div>
    </div>
  );
};

export default MissionPopup;
