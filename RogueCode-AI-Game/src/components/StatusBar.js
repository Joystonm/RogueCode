import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';

const StatusBar = () => {
  const { playerState, missionState } = useGameContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time as HH:MM:SS
  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Calculate XP progress percentage
  const xpProgressPercent = Math.round((playerState.xp / playerState.xpToNextLevel) * 100);
  
  return (
    <div className="status-bar">
      <div className="status-section">
        <div className="status-item">
          <span className="status-label">LVL</span>
          <span className="status-value">{playerState.level}</span>
        </div>
        
        <div className="status-item xp-bar">
          <span className="status-label">XP</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${xpProgressPercent}%` }}
            ></div>
          </div>
          <span className="status-value xp-value">
            {playerState.xp}/{playerState.xpToNextLevel}
          </span>
        </div>
      </div>
      
      <div className="status-section">
        <div className="status-item">
          <span className="status-label">CREDITS</span>
          <span className="status-value">{playerState.credits}</span>
        </div>
        
        <div className="status-item">
          <span className="status-label">REP</span>
          <span className="status-value">{playerState.reputation}</span>
        </div>
      </div>
      
      <div className="status-section mission-status">
        <div className="status-item">
          <span className="status-label">MISSION</span>
          <span className="status-value">
            {missionState.currentMission 
              ? missionState.currentMission.title 
              : 'None'
            }
          </span>
        </div>
      </div>
      
      <div className="status-section time-section">
        <div className="status-item">
          <span className="status-value time">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
