/**
 * Application configuration
 */
const config = {
  // API endpoints
  api: {
    groq: process.env.REACT_APP_GROQ_API_URL || 'https://api.groq.com/v1',
    tavily: process.env.REACT_APP_TAVILY_API_URL || 'https://api.tavily.com/v1'
  },
  
  // Game settings
  game: {
    initialLevel: 1,
    maxLevel: 10,
    typingSpeed: 50, // ms per character
    glitchProbability: 0.05
  },
  
  // Sound settings
  sound: {
    defaultVolume: 0.7,
    enabledByDefault: true
  },
  
  // Debug mode
  debug: process.env.NODE_ENV === 'development'
};

export default config;
