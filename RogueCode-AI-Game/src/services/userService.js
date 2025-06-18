import { v4 as uuidv4 } from 'uuid';

/**
 * Service for generating random user profiles
 */
class UserService {
  constructor() {
    this.firstNames = [
      'John', 'Jane', 'Michael', 'Emma', 'David', 'Sarah', 'Robert', 'Lisa',
      'William', 'Emily', 'James', 'Olivia', 'Richard', 'Sophia', 'Thomas', 'Ava',
      'Daniel', 'Mia', 'Matthew', 'Isabella', 'Joseph', 'Charlotte', 'Christopher', 'Amelia',
      'Andrew', 'Harper', 'Joshua', 'Evelyn', 'Ryan', 'Abigail', 'Tyler', 'Elizabeth'
    ];
    
    this.lastNames = [
      'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson',
      'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
      'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee',
      'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez'
    ];
    
    this.domains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
      'aol.com', 'protonmail.com', 'mail.com', 'zoho.com', 'yandex.com',
      'megacorp.com', 'neobank.net', 'synthtech.org', 'quantumlab.io', 'cybersec.co'
    ];
    
    this.countries = [
      'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
      'France', 'Japan', 'China', 'Brazil', 'India', 'Russia', 'South Korea',
      'Italy', 'Spain', 'Mexico', 'Netherlands', 'Sweden', 'Singapore'
    ];
    
    this.cities = {
      'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'],
      'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Edinburgh', 'Bristol', 'Leeds'],
      'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa', 'Edmonton', 'Quebec City', 'Winnipeg'],
      'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle'],
      'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig'],
      'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier'],
      'Japan': ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto'],
      'China': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Tianjin', 'Wuhan', 'Dongguan'],
      'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba'],
      'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Pune'],
      'Russia': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Chelyabinsk', 'Omsk', 'Samara'],
      'South Korea': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan'],
      'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence'],
      'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma'],
      'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Juárez', 'Zapopan'],
      'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere'],
      'Sweden': ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg'],
      'Singapore': ['Singapore']
    };
    
    this.occupations = [
      'Software Developer', 'Data Analyst', 'Network Administrator', 'Cybersecurity Specialist',
      'Database Administrator', 'Systems Architect', 'IT Manager', 'Web Developer',
      'Cloud Engineer', 'DevOps Engineer', 'AI Researcher', 'Blockchain Developer',
      'UI/UX Designer', 'Product Manager', 'QA Engineer', 'Technical Writer',
      'Business Analyst', 'Project Manager', 'CTO', 'IT Consultant'
    ];
    
    this.companies = [
      'MegaCorp Industries', 'NeoBank Systems', 'Quantum Research Labs', 'SynthTech Inc.',
      'Global Defense Network', 'CyberSec Solutions', 'Nexus Data Systems', 'Orbital Communications',
      'Digital Frontier', 'Neural Networks Ltd.', 'Crypto Dynamics', 'Hyperion Technologies',
      'Vertex Software', 'Pulse Security', 'Echo Systems', 'Fusion Technologies',
      'Apex Innovations', 'Cipher Analytics', 'Radiant Computing', 'Horizon Data'
    ];
    
    this.skills = [
      'Python', 'JavaScript', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust',
      'SQL', 'NoSQL', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Linux', 'Windows Server',
      'Network Security', 'Penetration Testing', 'Cryptography', 'Machine Learning',
      'Data Science', 'Blockchain', 'IoT', 'Cloud Architecture', 'DevOps', 'CI/CD',
      'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring Boot', 'ASP.NET'
    ];
  }

  /**
   * Generate a random user profile
   * @returns {object} User profile object
   */
  generateUser() {
    // Generate basic info
    const firstName = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
    const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
    const username = (firstName.toLowerCase() + lastName.toLowerCase() + Math.floor(Math.random() * 1000)).substring(0, 15);
    
    // Generate email
    const domain = this.domains[Math.floor(Math.random() * this.domains.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
    
    // Generate location
    const country = this.countries[Math.floor(Math.random() * this.countries.length)];
    const cities = this.cities[country] || ['Unknown City'];
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    // Generate occupation and company
    const occupation = this.occupations[Math.floor(Math.random() * this.occupations.length)];
    const company = this.companies[Math.floor(Math.random() * this.companies.length)];
    
    // Generate IP address
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    
    // Generate skills
    const skillCount = Math.floor(Math.random() * 5) + 2; // 2-6 skills
    const userSkills = [];
    const skillsCopy = [...this.skills];
    
    for (let i = 0; i < skillCount; i++) {
      if (skillsCopy.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * skillsCopy.length);
      userSkills.push(skillsCopy[randomIndex]);
      skillsCopy.splice(randomIndex, 1);
    }
    
    // Generate social media handles
    const socialMedia = {
      twitter: `@${username}`,
      github: username,
      linkedin: `${firstName.toLowerCase()}-${lastName.toLowerCase()}`
    };
    
    // Generate account details
    const accountCreated = new Date(Date.now() - Math.random() * 94608000000); // Random date in the last 3 years
    const lastLogin = new Date(Date.now() - Math.random() * 2592000000); // Random date in the last month
    
    // Return user profile
    return {
      id: uuidv4(),
      firstName,
      lastName,
      username,
      email,
      location: {
        country,
        city
      },
      occupation,
      company,
      ip,
      skills: userSkills,
      socialMedia,
      account: {
        created: accountCreated.toISOString(),
        lastLogin: lastLogin.toISOString(),
        status: Math.random() > 0.2 ? 'active' : 'inactive'
      }
    };
  }

  /**
   * Format user profile as a string
   * @param {object} user - User profile object
   * @returns {string} Formatted user profile
   */
  formatUserProfile(user) {
    return `
User Profile: ${user.firstName} ${user.lastName}
Username: ${user.username}
Email: ${user.email}
Location: ${user.location.city}, ${user.location.country}
Occupation: ${user.occupation}
Company: ${user.company}
IP Address: ${user.ip}
Skills: ${user.skills.join(', ')}
Social Media:
  - Twitter: ${user.socialMedia.twitter}
  - GitHub: ${user.socialMedia.github}
  - LinkedIn: ${user.socialMedia.linkedin}
Account:
  - Created: ${new Date(user.account.created).toLocaleDateString()}
  - Last Login: ${new Date(user.account.lastLogin).toLocaleDateString()}
  - Status: ${user.account.status}
`;
  }

  /**
   * Generate multiple user profiles
   * @param {number} count - Number of profiles to generate
   * @returns {Array} Array of user profile objects
   */
  generateUsers(count = 1) {
    const users = [];
    
    for (let i = 0; i < count; i++) {
      users.push(this.generateUser());
    }
    
    return users;
  }
}

// Create and export a singleton instance
const userService = new UserService();
export default userService;
