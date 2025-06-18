import React, { useEffect, useRef } from 'react';
import '../styles/contextMenu.css';

const ContextMenu = ({ x, y, onClose, onCopy }) => {
  const menuRef = useRef(null);
  
  // Close the context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Handle copy action
  const handleCopy = () => {
    onCopy();
    onClose();
  };
  
  return (
    <div 
      className="context-menu" 
      ref={menuRef}
      style={{ 
        top: `${y}px`, 
        left: `${x}px` 
      }}
    >
      <div className="context-menu-item" onClick={handleCopy}>
        Copy
      </div>
    </div>
  );
};

export default ContextMenu;
