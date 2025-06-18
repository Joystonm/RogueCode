/**
 * Service for generating random user profiles using the Random User API
 */

const RANDOM_USER_API_URL = 'https://randomuser.me/api/';

/**
 * Generate random user profiles
 * @param {object} options - Options for generating users
 * @returns {Promise<object>} - Random user data
 */
export const generateRandomUsers = async (options = {}) => {
  try {
    const defaultOptions = {
      results: 1,
      gender: null,
      nat: null
    };

    const mergedOptions = { ...defaultOptions, ...options };
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('results', mergedOptions.results);
    
    if (mergedOptions.gender) {
      queryParams.append('gender', mergedOptions.gender);
    }
    
    if (mergedOptions.nat) {
      queryParams.append('nat', mergedOptions.nat);
    }
    
    const response = await fetch(`${RANDOM_USER_API_URL}?${queryParams.toString()}`);

    if (!response.ok) {
      throw new Error(`Random User API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Random User API:', error);
    return { results: [], error: error.message };
  }
};

/**
 * Generate a target profile for missions
 * @returns {Promise<object>} - Target profile
 */
export const generateTargetProfile = async () => {
  try {
    const userData = await generateRandomUsers();
    
    if (userData.results && userData.results.length > 0) {
      const user = userData.results[0];
      
      // Generate a cyberpunk-style username
      const cyberpunkUsernames = [
        'NetRunner',
        'CyberSlice',
        'Hex0r',
        'DataJack',
        'BitShift',
        'NullByte',
        'ShadowCode',
        'CipherPunk',
        'VoidHack',
        'GlitchWire'
      ];
      
      const randomUsername = cyberpunkUsernames[Math.floor(Math.random() * cyberpunkUsernames.length)];
      const usernameWithNumbers = `${randomUsername}${Math.floor(Math.random() * 100)}`;
      
      // Generate a fictional company
      const companies = [
        'NeuraTech',
        'QuantumCore',
        'SynapseNet',
        'OmniCorp',
        'ByteShift Industries',
        'Nexus Dynamics',
        'CyberLink Systems',
        'Vertex Security',
        'Helix Data',
        'Cipher Solutions'
      ];
      
      const randomCompany = companies[Math.floor(Math.random() * companies.length)];
      
      // Generate a job title
      const jobTitles = [
        'Network Administrator',
        'Security Analyst',
        'Data Architect',
        'Systems Engineer',
        'Cloud Infrastructure Manager',
        'DevOps Specialist',
        'Quantum Computing Researcher',
        'AI Ethics Officer',
        'Blockchain Developer',
        'Neural Interface Designer'
      ];
      
      const randomJobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      
      // Create enhanced profile
      return {
        id: user.login.uuid,
        name: `${user.name.first} ${user.name.last}`,
        username: usernameWithNumbers,
        email: user.email,
        company: randomCompany,
        jobTitle: randomJobTitle,
        location: `${user.location.city}, ${user.location.country}`,
        picture: user.picture.large,
        phone: user.phone,
        securityLevel: Math.floor(Math.random() * 5) + 1,
        accessCodes: Array(3).fill().map(() => Math.random().toString(36).substring(2, 8).toUpperCase())
      };
    }
    
    throw new Error('No user data returned');
  } catch (error) {
    console.error('Error generating target profile:', error);
    
    // Return fallback profile if API fails
    return {
      id: 'offline-' + Math.random().toString(36).substring(2, 10),
      name: 'John Doe',
      username: 'OfflineUser42',
      email: 'offline@example.com',
      company: 'Fallback Systems',
      jobTitle: 'Network Administrator',
      location: 'Unknown',
      picture: null,
      phone: '555-0123',
      securityLevel: 3,
      accessCodes: ['OFFLINE']
    };
  }
};

export default {
  generateRandomUsers,
  generateTargetProfile
};
