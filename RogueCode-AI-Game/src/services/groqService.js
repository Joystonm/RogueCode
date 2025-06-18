/**
 * Service for interacting with the Groq API for AI responses
 */

const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_API_URL = process.env.REACT_APP_GROQ_API_URL || 'https://api.groq.com/openai/v1';

// Debug logging for API keys
console.log('Groq API Key available:', !!GROQ_API_KEY);
console.log('Groq API URL:', GROQ_API_URL);

/**
 * Get an AI response from Groq
 * @param {string} prompt - The prompt to send to the AI
 * @param {object} options - Additional options
 * @returns {Promise<string>} - The AI response
 */
export const getAIResponse = async (prompt, options = {}) => {
  console.log('Calling Groq API with prompt:', prompt);
  console.log('Options:', options);
  
  try {
    if (!GROQ_API_KEY) {
      console.error('Groq API key is missing');
      return 'AI response unavailable: API key is missing';
    }
    
    const defaultOptions = {
      model: 'llama3-70b-8192',
      temperature: 0.7,
      max_tokens: 500,
      system_prompt: 'You are an AI assistant in a hacking game called RogueCode. Respond in character as a hacking assistant.'
    };

    const mergedOptions = { ...defaultOptions, ...options };
    
    console.log('Making API request to:', `${GROQ_API_URL}/chat/completions`);
    console.log('With model:', mergedOptions.model);
    
    const response = await fetch(`${GROQ_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: mergedOptions.model,
        messages: [
          {
            role: 'system',
            content: mergedOptions.system_prompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: mergedOptions.temperature,
        max_tokens: mergedOptions.max_tokens
      })
    });

    console.log('API response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      throw new Error(`Groq API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('API response received successfully');
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return `AI response unavailable: ${error.message}`;
  }
};

/**
 * Get mission briefing from AI
 * @param {string} missionType - Type of mission
 * @param {string} difficulty - Mission difficulty
 * @returns {Promise<string>} - Mission briefing
 */
export const getMissionBriefing = async (missionType, difficulty) => {
  const prompt = `Generate a mission briefing for a ${difficulty} difficulty ${missionType} mission in a cyberpunk hacking game. Include a target, objective, and potential rewards.`;
  
  const systemPrompt = `You are an AI mission handler in a cyberpunk hacking game called RogueCode. 
  Generate a detailed mission briefing with the following sections:
  - Mission Name (creative and thematic)
  - Target (company or system)
  - Objective (what the player needs to accomplish)
  - Difficulty: ${difficulty}/5
  - Potential Rewards (credits, reputation, items)
  - Background (2-3 sentences of context)
  
  Keep the tone serious but with cyberpunk flair. Use technical jargon where appropriate.`;
  
  return getAIResponse(prompt, { 
    system_prompt: systemPrompt,
    temperature: 0.8
  });
};

/**
 * Get AI response for scan results
 * @param {string} target - The target being scanned
 * @param {object} options - Scan options
 * @returns {Promise<string>} - Scan results
 */
export const getScanResults = async (target, options = {}) => {
  const scanType = options.deep ? 'deep' : 'standard';
  const scanForVulns = options.vulns ? 'with vulnerability assessment' : 'without vulnerability assessment';
  
  const prompt = `Generate realistic scan results for target "${target}" using a ${scanType} scan ${scanForVulns}.`;
  
  const systemPrompt = `You are a network scanning tool in a cyberpunk hacking game.
  Generate realistic scan results with the following information:
  - IP Address (fictional)
  - Status (Online/Offline/Firewalled)
  - Operating System
  - Open ports (if any)
  - Services running on those ports
  - Vulnerabilities (if requested)
  
  Format the output like a terminal scan result. Be technical but concise.
  If the scan is "deep", provide more detailed information.`;
  
  return getAIResponse(prompt, { 
    system_prompt: systemPrompt,
    temperature: 0.7
  });
};

export default {
  getAIResponse,
  getMissionBriefing,
  getScanResults
};
