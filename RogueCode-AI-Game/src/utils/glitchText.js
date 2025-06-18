import { gsap } from 'gsap';

/**
 * Apply a glitch effect to text
 * @param {string} text - The original text
 * @param {number} intensity - Glitch intensity (0-1)
 * @returns {string} The glitched text
 */
const applyGlitchEffect = (text, intensity = 0.3) => {
  if (!text) return '';
  
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`';
  let result = '';
  
  for (let i = 0; i < text.length; i++) {
    // Randomly decide whether to glitch this character
    if (Math.random() < intensity) {
      // Replace with a random glitch character
      const randomIndex = Math.floor(Math.random() * glitchChars.length);
      result += glitchChars[randomIndex];
    } else {
      result += text[i];
    }
  }
  
  return result;
};

/**
 * Create a glitch animation sequence for text
 * @param {string} text - The original text
 * @param {number} frames - Number of frames in the animation
 * @param {number} maxIntensity - Maximum glitch intensity
 * @returns {Array} Array of text frames for the animation
 */
const createGlitchSequence = (text, frames = 5, maxIntensity = 0.5) => {
  const sequence = [];
  
  // Create frames with varying intensity
  for (let i = 0; i < frames; i++) {
    const intensity = Math.random() * maxIntensity;
    sequence.push(applyGlitchEffect(text, intensity));
  }
  
  // Add the original text as the final frame
  sequence.push(text);
  
  return sequence;
};

/**
 * Apply a glitch animation to a DOM element
 * @param {HTMLElement} element - The element to animate
 * @param {object} options - Animation options
 */
const animateGlitchText = (element, options = {}) => {
  const {
    duration = 0.1,
    intensity = 0.5,
    frames = 5,
    delay = 0,
    onComplete = null
  } = options;
  
  // Store original text
  const originalText = element.textContent;
  
  // Create glitch sequence
  const sequence = createGlitchSequence(originalText, frames, intensity);
  
  // Set up GSAP timeline
  const timeline = gsap.timeline({
    delay,
    onComplete: () => {
      // Restore original text
      element.textContent = originalText;
      
      // Call onComplete callback if provided
      if (onComplete) onComplete();
    }
  });
  
  // Add frames to timeline
  sequence.forEach((frame, index) => {
    timeline.to(element, {
      duration: duration / frames,
      onStart: () => {
        element.textContent = frame;
      },
      ease: 'none'
    });
  });
  
  return timeline;
};

/**
 * Apply a text scramble effect
 * @param {HTMLElement} element - The element to animate
 * @param {string} newText - The new text to display
 * @param {object} options - Animation options
 */
const textScramble = (element, newText, options = {}) => {
  const {
    duration = 1.5,
    scrambleChars = '!<>-_\\/[]{}—=+*^?#________',
    delay = 0,
    onComplete = null
  } = options;
  
  // Store original and new text
  const originalText = element.textContent;
  const finalText = newText || originalText;
  
  // Calculate frames based on text length
  const frames = Math.max(finalText.length, 10);
  const frameTime = duration / frames;
  
  // Set up GSAP timeline
  const timeline = gsap.timeline({
    delay,
    onComplete: () => {
      // Ensure final text is set
      element.textContent = finalText;
      
      // Call onComplete callback if provided
      if (onComplete) onComplete();
    }
  });
  
  // Create scramble animation
  let currentText = originalText;
  let currentFrame = 0;
  
  const animate = () => {
    currentFrame++;
    
    // Calculate how many characters should be final
    const progress = currentFrame / frames;
    const finalCharCount = Math.floor(finalText.length * progress);
    
    // Build new text with mix of final and scrambled characters
    let newDisplayText = '';
    
    for (let i = 0; i < finalText.length; i++) {
      if (i < finalCharCount) {
        // Use final character
        newDisplayText += finalText[i];
      } else if (Math.random() < 0.1) {
        // Sometimes show the final character briefly
        newDisplayText += finalText[i];
      } else {
        // Use random scramble character
        const randomIndex = Math.floor(Math.random() * scrambleChars.length);
        newDisplayText += scrambleChars[randomIndex];
      }
    }
    
    // Update element text
    element.textContent = newDisplayText;
    
    // Continue animation if not complete
    if (currentFrame < frames) {
      timeline.to({}, {
        duration: frameTime,
        onComplete: animate,
        ease: 'none'
      });
    }
  };
  
  // Start animation
  timeline.to({}, {
    duration: 0,
    onComplete: animate,
    ease: 'none'
  });
  
  return timeline;
};

/**
 * Create a loading bar animation
 * @param {HTMLElement} element - The element to animate
 * @param {object} options - Animation options
 */
const createLoadingBar = (element, options = {}) => {
  const {
    duration = 3,
    width = 20,
    completeChar = '█',
    incompleteChar = '▒',
    prefix = 'Loading',
    suffix = '',
    onProgress = null,
    onComplete = null
  } = options;
  
  // Set up GSAP timeline
  const timeline = gsap.timeline({
    onComplete: () => {
      // Call onComplete callback if provided
      if (onComplete) onComplete();
    }
  });
  
  // Create progress variable
  const progress = { value: 0 };
  
  // Animate progress
  timeline.to(progress, {
    value: 100,
    duration,
    ease: options.ease || 'power1.inOut',
    onUpdate: () => {
      // Calculate filled and empty blocks
      const percent = Math.round(progress.value);
      const filledBlocks = Math.round((percent / 100) * width);
      const emptyBlocks = width - filledBlocks;
      
      // Create loading bar text
      const loadingBar = completeChar.repeat(filledBlocks) + incompleteChar.repeat(emptyBlocks);
      const percentText = ` ${percent}%`;
      
      // Update element text
      element.textContent = `${prefix} ${loadingBar}${percentText}${suffix}`;
      
      // Call onProgress callback if provided
      if (onProgress) onProgress(percent);
    }
  });
  
  return timeline;
};

export { 
  applyGlitchEffect, 
  createGlitchSequence, 
  animateGlitchText,
  textScramble,
  createLoadingBar
};
