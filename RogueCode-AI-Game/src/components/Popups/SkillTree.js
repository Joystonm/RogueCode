import React, { useEffect, useRef } from 'react';
import { useGameContext } from '../../context/GameContext';
import skillTreeData from '../../data/skillTree.json';
import soundManager from '../../utils/soundManager';
import { gsap } from 'gsap';

const SkillTree = () => {
  const { playerState, addSkill, toggleSkillTree } = useGameContext();
  const skillTreeRef = useRef(null);
  
  // Animate skill tree entrance
  useEffect(() => {
    // Play UI open sound
    soundManager.playSound('uiOpen');
    
    // Animate popup entrance
    gsap.fromTo(
      skillTreeRef.current,
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
    
    // Animate skill nodes entrance
    gsap.fromTo(
      '.skill-node',
      { 
        opacity: 0, 
        scale: 0.8
      },
      { 
        opacity: 1, 
        scale: 1,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.2
      }
    );
    
    // Animate skill connections
    gsap.fromTo(
      '.skill-connection',
      { 
        opacity: 0,
        drawSVG: '0%'
      },
      { 
        opacity: 1,
        drawSVG: '100%',
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.inOut',
        delay: 0.5
      }
    );
  }, []);
  
  // Handle skill tree close
  const handleClose = () => {
    // Play UI close sound
    soundManager.playSound('uiClose');
    
    // Animate popup exit
    gsap.to(skillTreeRef.current, { 
      opacity: 0, 
      scale: 0.95,
      duration: 0.2,
      onComplete: toggleSkillTree
    });
  };
  
  // Check if a skill is unlocked
  const isSkillUnlocked = (skill) => {
    return playerState.skills.some(s => s.id === skill.id);
  };
  
  // Check if a skill can be unlocked
  const canUnlockSkill = (skill) => {
    // If skill is already unlocked, return false
    if (isSkillUnlocked(skill)) return false;
    
    // If skill has no requirements, it can be unlocked
    if (!skill.requires || skill.requires.length === 0) return true;
    
    // Check if all required skills are unlocked
    return skill.requires.every(requiredSkillId => 
      playerState.skills.some(s => s.id === requiredSkillId)
    );
  };
  
  // Handle skill unlock
  const handleUnlockSkill = (skill) => {
    if (canUnlockSkill(skill)) {
      addSkill(skill);
      
      // Animate the newly unlocked skill
      gsap.fromTo(
        `#skill-${skill.id}`,
        { 
          backgroundColor: 'rgba(255, 255, 0, 0.5)',
          boxShadow: '0 0 20px rgba(255, 255, 0, 0.8)'
        },
        { 
          backgroundColor: 'rgba(0, 255, 0, 0.2)',
          boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
          duration: 1,
          ease: 'power2.out'
        }
      );
    }
  };

  return (
    <div className="skill-tree-container" ref={skillTreeRef}>
      <div className="skill-tree-header">
        <h2>Skill Tree</h2>
        <button className="close-button" onClick={handleClose}>×</button>
      </div>
      
      <div className="skill-tree-content">
        {skillTreeData.categories.map((category) => (
          <div key={category.id} className="skill-category">
            <h3 className="category-title">{category.name}</h3>
            
            <div className="skills-grid">
              {category.skills.map((skill) => {
                const isUnlocked = isSkillUnlocked(skill);
                const canUnlock = canUnlockSkill(skill);
                
                return (
                  <div 
                    key={skill.id}
                    id={`skill-${skill.id}`}
                    className={`skill-node ${isUnlocked ? 'unlocked' : ''} ${canUnlock ? 'available' : ''}`}
                    onClick={() => handleUnlockSkill(skill)}
                  >
                    <div className="skill-icon">
                      {/* Icon would go here */}
                      <span className="skill-level">{skill.level}</span>
                    </div>
                    <div className="skill-info">
                      <h4 className="skill-name">{skill.name}</h4>
                      <p className="skill-description">{skill.description}</p>
                    </div>
                    {canUnlock && !isUnlocked && (
                      <div className="unlock-indicator">UNLOCK</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillTree;
