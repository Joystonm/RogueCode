import React, { useEffect, useRef } from 'react';
import { useGameContext } from '../../context/GameContext';
import soundManager from '../../utils/soundManager';
import { gsap } from 'gsap';

const Inventory = () => {
  const { playerState, toggleInventory } = useGameContext();
  const inventoryRef = useRef(null);
  
  // Sample inventory items (will come from context in real implementation)
  const inventoryItems = [
    {
      id: 'item1',
      name: 'Basic Decryptor',
      type: 'tool',
      description: 'A simple decryption tool for breaking weak encryption.',
      rarity: 'common',
      stats: {
        decryption: 10,
        speed: 5
      }
    },
    {
      id: 'item2',
      name: 'Stealth Module v1',
      type: 'module',
      description: 'Reduces trace detection by 15%.',
      rarity: 'uncommon',
      stats: {
        stealth: 15
      }
    },
    {
      id: 'item3',
      name: 'Neural Booster',
      type: 'consumable',
      description: 'Temporarily increases hacking speed by 25% for 10 minutes.',
      rarity: 'rare',
      stats: {
        duration: 600,
        speedBoost: 25
      }
    }
  ];
  
  // Animate inventory entrance
  useEffect(() => {
    // Play UI open sound
    soundManager.playSound('uiOpen');
    
    // Animate popup entrance
    gsap.fromTo(
      inventoryRef.current,
      { 
        opacity: 0, 
        scale: 0.95
      },
      { 
        opacity: 1, 
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      }
    );
    
    // Animate inventory items entrance
    gsap.fromTo(
      '.inventory-item',
      { 
        opacity: 0, 
        y: 10
      },
      { 
        opacity: 1, 
        y: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.2
      }
    );
  }, []);
  
  // Handle inventory close
  const handleClose = () => {
    // Play UI close sound
    soundManager.playSound('uiClose');
    
    // Animate popup exit
    gsap.to(inventoryRef.current, { 
      opacity: 0, 
      scale: 0.95,
      duration: 0.2,
      onComplete: toggleInventory
    });
  };
  
  // Handle item use
  const handleUseItem = (item) => {
    console.log('Using item:', item);
    // Item use logic would go here
    
    // Play item use sound
    soundManager.playSound('itemUse');
    
    // Animate item use
    gsap.fromTo(
      `#item-${item.id}`,
      { 
        backgroundColor: 'rgba(0, 255, 255, 0.3)',
        boxShadow: '0 0 15px rgba(0, 255, 255, 0.8)'
      },
      { 
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        boxShadow: 'none',
        duration: 0.5,
        ease: 'power2.out'
      }
    );
  };

  return (
    <div className="inventory-container" ref={inventoryRef}>
      <div className="inventory-header">
        <h2>Inventory</h2>
        <div className="inventory-stats">
          <span className="inventory-stat">
            Items: {inventoryItems.length}/20
          </span>
          <span className="inventory-stat">
            Credits: {playerState.credits}
          </span>
        </div>
        <button className="close-button" onClick={handleClose}>×</button>
      </div>
      
      <div className="inventory-content">
        <div className="inventory-categories">
          <button className="category-button active">All</button>
          <button className="category-button">Tools</button>
          <button className="category-button">Modules</button>
          <button className="category-button">Consumables</button>
        </div>
        
        <div className="inventory-items">
          {inventoryItems.map((item) => (
            <div 
              key={item.id}
              id={`item-${item.id}`}
              className={`inventory-item ${item.rarity}`}
            >
              <div className="item-icon">
                {/* Icon would go here */}
                <span className="item-type-indicator">{item.type.charAt(0).toUpperCase()}</span>
              </div>
              
              <div className="item-info">
                <h4 className="item-name">{item.name}</h4>
                <p className="item-description">{item.description}</p>
                
                <div className="item-stats">
                  {Object.entries(item.stats).map(([stat, value]) => (
                    <span key={stat} className="item-stat">
                      {stat}: {value}{stat === 'speedBoost' ? '%' : ''}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="item-actions">
                <button 
                  className="item-action-button use-button"
                  onClick={() => handleUseItem(item)}
                >
                  USE
                </button>
                <button className="item-action-button info-button">INFO</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
