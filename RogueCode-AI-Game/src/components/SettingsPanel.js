import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import '../styles/settingsPanel.css';

const SettingsPanel = ({ onClose }) => {
  const { gameSettings, updateGameSettings } = useGameContext();
  const [settings, setSettings] = useState({...gameSettings});
  
  // Handle toggle changes
  const handleToggle = (setting) => {
    const newSettings = { ...settings };
    newSettings[setting] = !newSettings[setting];
    setSettings(newSettings);
    updateGameSettings({ [setting]: newSettings[setting] });
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const volume = parseFloat(e.target.value);
    setSettings({ ...settings, volume });
    updateGameSettings({ volume });
  };
  
  // Handle theme change
  const handleThemeChange = (theme) => {
    setSettings({ ...settings, terminalTheme: theme });
    updateGameSettings({ terminalTheme: theme });
  };
  
  // Handle typing speed change
  const handleTypingSpeedChange = (e) => {
    const typingSpeed = parseInt(e.target.value);
    setSettings({ ...settings, typingSpeed });
    updateGameSettings({ typingSpeed });
  };
  
  // Handle glitch intensity change
  const handleGlitchIntensityChange = (e) => {
    const glitchIntensity = parseFloat(e.target.value);
    setSettings({ ...settings, glitchIntensity });
    updateGameSettings({ glitchIntensity });
  };

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h2>Settings</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="settings-content">
        <div className="settings-section">
          <h3>Audio Settings</h3>
          
          <div className="setting-item">
            <label className="toggle-label">
              <span>Music</span>
              <div 
                className={`toggle-switch ${settings.musicEnabled ? 'active' : ''}`}
                onClick={() => handleToggle('musicEnabled')}
              >
                <div className="toggle-slider"></div>
              </div>
            </label>
          </div>
          
          <div className="setting-item">
            <label className="toggle-label">
              <span>Sound Effects</span>
              <div 
                className={`toggle-switch ${settings.soundEnabled ? 'active' : ''}`}
                onClick={() => handleToggle('soundEnabled')}
              >
                <div className="toggle-slider"></div>
              </div>
            </label>
          </div>
          
          <div className="setting-item">
            <label>
              <span>Volume: {Math.round(settings.volume * 100)}%</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={settings.volume}
                onChange={handleVolumeChange}
                className="slider"
              />
            </label>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Visual Settings</h3>
          
          <div className="setting-item">
            <span>Terminal Theme</span>
            <div className="theme-options">
              <div 
                className={`theme-option green ${settings.terminalTheme === 'green' ? 'active' : ''}`}
                onClick={() => handleThemeChange('green')}
              >
                Green
              </div>
              <div 
                className={`theme-option amber ${settings.terminalTheme === 'amber' ? 'active' : ''}`}
                onClick={() => handleThemeChange('amber')}
              >
                Amber
              </div>
              <div 
                className={`theme-option blue ${settings.terminalTheme === 'blue' ? 'active' : ''}`}
                onClick={() => handleThemeChange('blue')}
              >
                Blue
              </div>
            </div>
          </div>
          
          <div className="setting-item">
            <label className="toggle-label">
              <span>Scanlines Effect</span>
              <div 
                className={`toggle-switch ${settings.scanlines ? 'active' : ''}`}
                onClick={() => handleToggle('scanlines')}
              >
                <div className="toggle-slider"></div>
              </div>
            </label>
          </div>
          
          <div className="setting-item">
            <label>
              <span>Typing Speed: {settings.typingSpeed}ms</span>
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="5" 
                value={settings.typingSpeed}
                onChange={handleTypingSpeedChange}
                className="slider"
              />
            </label>
          </div>
          
          <div className="setting-item">
            <label>
              <span>Glitch Intensity: {settings.glitchIntensity.toFixed(1)}</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={settings.glitchIntensity}
                onChange={handleGlitchIntensityChange}
                className="slider"
              />
            </label>
          </div>
        </div>
        
        <div className="settings-section">
          <h3>Game Settings</h3>
          
          <div className="setting-item">
            <button className="reset-button" onClick={() => {
              if (window.confirm('Are you sure you want to reset all game progress? This cannot be undone.')) {
                // Reset game progress
                localStorage.removeItem('rogueCodeGameSave');
                window.location.reload();
              }
            }}>
              Reset Game Progress
            </button>
          </div>
        </div>
      </div>
      
      <div className="settings-footer">
        <p>Settings are automatically saved.</p>
      </div>
    </div>
  );
};

export default SettingsPanel;
