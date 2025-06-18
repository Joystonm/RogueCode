/**
 * Service for interacting with the Tavily Search API
 */

const TAVILY_API_KEY = process.env.REACT_APP_TAVILY_API_KEY;
const TAVILY_API_URL = process.env.REACT_APP_TAVILY_API_URL || 'https://api.tavily.com/v1';

/**
 * Search for information using Tavily
 * @param {string} query - The search query
 * @param {object} options - Search options
 * @returns {Promise<object>} - Search results
 */
export const search = async (query, options = {}) => {
  try {
    const defaultOptions = {
      search_depth: 'basic',
      include_domains: [],
      exclude_domains: [],
      max_results: 5
    };

    const mergedOptions = { ...defaultOptions, ...options };
    
    const response = await fetch(`${TAVILY_API_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': TAVILY_API_KEY
      },
      body: JSON.stringify({
        query,
        search_depth: mergedOptions.search_depth,
        include_domains: mergedOptions.include_domains,
        exclude_domains: mergedOptions.exclude_domains,
        max_results: mergedOptions.max_results
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Tavily API error:', errorData);
      throw new Error(`Tavily API error: ${errorData.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Tavily API:', error);
    return { results: [], error: error.message };
  }
};

/**
 * Get hacker jargon or technical information
 * @param {string} term - The term to search for
 * @returns {Promise<string>} - Information about the term
 */
export const getHackerJargon = async (term) => {
  try {
    const results = await search(`hacker term ${term} cybersecurity definition`, {
      search_depth: 'advanced',
      max_results: 3
    });
    
    if (results.results && results.results.length > 0) {
      // Extract relevant information from search results
      const relevantInfo = results.results
        .map(result => result.content)
        .join('\n\n');
      
      return relevantInfo;
    }
    
    return `No information found for "${term}"`;
  } catch (error) {
    console.error('Error getting hacker jargon:', error);
    return `Information unavailable: ${error.message}`;
  }
};

/**
 * Get mission context information
 * @param {string} target - The mission target
 * @returns {Promise<string>} - Context information
 */
export const getMissionContext = async (target) => {
  try {
    const results = await search(`${target} company information cybersecurity`, {
      search_depth: 'advanced',
      max_results: 3
    });
    
    if (results.results && results.results.length > 0) {
      // Extract relevant information from search results
      const relevantInfo = results.results
        .map(result => result.content)
        .join('\n\n');
      
      return relevantInfo;
    }
    
    return `No information found for "${target}"`;
  } catch (error) {
    console.error('Error getting mission context:', error);
    return `Information unavailable: ${error.message}`;
  }
};

export default {
  search,
  getHackerJargon,
  getMissionContext
};
