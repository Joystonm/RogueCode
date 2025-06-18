import React, { useEffect, useRef } from 'react';
import { useGameContext } from '../../context/GameContext';
import soundManager from '../../utils/soundManager';
import { gsap } from 'gsap';

const AlertBox = ({ message, type = 'info', autoClose = true, duration = 5000 }) => {
  const { closeAlertBox } = useGameContext();
  const alertRef = useRef(null);
  
  // Play appropriate sound based on alert type
  useEffect(() => {
    switch (type) {
      case 'error':
        soundManager.playSound('error');
        break;
      case 'success':
        soundManager.playSound('success');
        break;
      case 'warning':
        soundManager.playSound('warning');
        break;
      default:
        soundManager.playSound('alert');
    }
    
    // Animate alert entrance
    gsap.fromTo(
      alertRef.current,
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
    
    // Auto-close alert after duration
    let timer;
    if (autoClose) {
      timer = setTimeout(() => {
        handleClose();
      }, duration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);
  
  // Handle alert close
  const handleClose = () => {
    // Animate alert exit
    gsap.to(alertRef.current, { 
      opacity: 0, 
      y: -20,
      scale: 0.95,
      duration: 0.2,
      onComplete: closeAlertBox
    });
  };
  
  // Apply glitch effect for error alerts
  useEffect(() => {
    if (type === 'error') {
      // Apply glitch animation
      gsap.to(alertRef.current, {
        skewX: 5,
        textShadow: '2px 0 #ff0066, -2px 0 #00ffff',
        duration: 0.1,
        repeat: 3,
        yoyo: true,
        ease: 'none',
        delay: 0.3
      });
    }
  }, [type]);

  return (
    <div 
      ref={alertRef}
      className={`alert-box ${type}`}
    >
      <div className="alert-icon">
        {type === 'error' && '✕'}
        {type === 'success' && '✓'}
        {type === 'warning' && '!'}
        {type === 'info' && 'i'}
      </div>
      
      <div className="alert-content">{message}</div>
      
      <button 
        className="alert-close" 
        onClick={handleClose}
        aria-label="Close alert"
      >
        ×
      </button>
      
      {autoClose && (
        <div className="alert-timer">
          <div 
            className="timer-bar"
            style={{
              animation: `timerCountdown ${duration / 1000}s linear forwards`
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default AlertBox;
