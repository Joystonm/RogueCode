/**
 * Service for generating fake system logs
 */
class LogsService {
  constructor() {
    this.logTypes = ['INFO', 'WARNING', 'ERROR', 'DEBUG', 'SYSTEM', 'AUTH', 'NETWORK', 'SECURITY'];
    
    this.users = ['admin', 'system', 'root', 'service', 'daemon', 'user', 'guest', 'www-data', 'postgres', 'apache'];
    
    this.processes = ['httpd', 'nginx', 'mysqld', 'sshd', 'cron', 'systemd', 'kernel', 'firewall', 'backup', 'monitor'];
    
    this.actions = {
      'INFO': [
        'Service started',
        'Connection established',
        'User login successful',
        'Database query executed',
        'File accessed',
        'Configuration loaded',
        'Scheduled task completed',
        'Cache updated',
        'API request processed',
        'Data synchronized'
      ],
      'WARNING': [
        'High CPU usage detected',
        'Low disk space warning',
        'Connection timeout',
        'Slow query performance',
        'Rate limit approaching',
        'Certificate expiring soon',
        'Memory usage above threshold',
        'Service restart required',
        'Deprecated API call',
        'Configuration inconsistency detected'
      ],
      'ERROR': [
        'Connection refused',
        'Authentication failed',
        'Permission denied',
        'File not found',
        'Database query failed',
        'Memory allocation error',
        'Service crashed',
        'API request failed',
        'Invalid configuration',
        'Dependency missing'
      ],
      'DEBUG': [
        'Function call trace',
        'Variable state dump',
        'Performance metrics',
        'Cache hit ratio',
        'Query execution plan',
        'Memory allocation details',
        'Thread synchronization',
        'API payload contents',
        'Configuration parameters',
        'Resource utilization stats'
      ],
      'SYSTEM': [
        'System startup completed',
        'Shutdown initiated',
        'Service dependency resolved',
        'Resource allocation updated',
        'Kernel module loaded',
        'System time synchronized',
        'Hardware status check',
        'Power state changed',
        'Temperature threshold adjusted',
        'System update available'
      ],
      'AUTH': [
        'User authentication attempt',
        'Password change',
        'Session created',
        'Session expired',
        'Permission granted',
        'Access token issued',
        'Two-factor authentication',
        'Account locked',
        'Privilege escalation',
        'Authorization policy updated'
      ],
      'NETWORK': [
        'Connection established',
        'Packet loss detected',
        'Bandwidth usage spike',
        'DNS resolution failed',
        'Firewall rule triggered',
        'Proxy configuration updated',
        'VPN tunnel established',
        'Network interface down',
        'Routing table updated',
        'Traffic shaping applied'
      ],
      'SECURITY': [
        'Intrusion attempt detected',
        'Malicious IP blocked',
        'Vulnerability scan completed',
        'File integrity check',
        'Unusual login pattern',
        'Encryption key rotation',
        'Security patch applied',
        'Brute force attempt',
        'Data exfiltration prevented',
        'Security policy violation'
      ]
    };
    
    this.ipAddresses = [
      '192.168.1.1', '10.0.0.1', '172.16.0.1', 
      '8.8.8.8', '1.1.1.1', '104.18.2.55',
      '203.0.113.42', '198.51.100.23', '192.0.2.15'
    ];
    
    this.ports = [22, 80, 443, 3306, 5432, 27017, 6379, 9200, 8080, 21];
    
    this.paths = [
      '/var/log/syslog',
      '/etc/passwd',
      '/var/www/html/index.php',
      '/home/user/documents/secret.txt',
      '/opt/app/config.json',
      '/usr/local/bin/script.sh',
      '/tmp/cache.dat',
      '/var/lib/mysql/data',
      '/etc/nginx/sites-available/default',
      '/root/.ssh/id_rsa'
    ];
  }

  /**
   * Generate a random timestamp within the last 24 hours
   * @returns {string} ISO timestamp
   */
  generateTimestamp() {
    const now = new Date();
    const pastTime = new Date(now.getTime() - Math.random() * 86400000); // Last 24 hours
    return pastTime.toISOString();
  }

  /**
   * Generate a single log entry
   * @param {string} type - Optional log type
   * @returns {object} Log entry object
   */
  generateLogEntry(type = null) {
    // Select random log type if not specified
    const logType = type || this.logTypes[Math.floor(Math.random() * this.logTypes.length)];
    
    // Select random user
    const user = this.users[Math.floor(Math.random() * this.users.length)];
    
    // Select random process
    const process = this.processes[Math.floor(Math.random() * this.processes.length)];
    
    // Select random action for the log type
    const actions = this.actions[logType] || this.actions['INFO'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    // Generate additional details based on log type
    let details = '';
    
    switch (logType) {
      case 'NETWORK':
        const ip = this.ipAddresses[Math.floor(Math.random() * this.ipAddresses.length)];
        const port = this.ports[Math.floor(Math.random() * this.ports.length)];
        details = ` src=${ip}:${port}`;
        break;
        
      case 'AUTH':
        const authIp = this.ipAddresses[Math.floor(Math.random() * this.ipAddresses.length)];
        details = ` ip=${authIp}`;
        break;
        
      case 'SYSTEM':
        const pid = Math.floor(Math.random() * 10000) + 1;
        details = ` pid=${pid}`;
        break;
        
      case 'ERROR':
      case 'WARNING':
        const path = this.paths[Math.floor(Math.random() * this.paths.length)];
        details = ` path="${path}"`;
        break;
    }
    
    // Generate timestamp
    const timestamp = this.generateTimestamp();
    
    // Construct log message
    const message = `${action}${details}`;
    
    // Return log entry object
    return {
      timestamp,
      type: logType,
      process,
      user,
      message
    };
  }

  /**
   * Format a log entry as a string
   * @param {object} logEntry - Log entry object
   * @returns {string} Formatted log entry
   */
  formatLogEntry(logEntry) {
    return `[${logEntry.timestamp}] [${logEntry.type}] [${logEntry.process}] [${logEntry.user}] ${logEntry.message}`;
  }

  /**
   * Generate multiple log entries
   * @param {number} count - Number of log entries to generate
   * @param {string} type - Optional log type filter
   * @returns {Array} Array of log entry objects
   */
  generateLogEntries(count = 10, type = null) {
    const logs = [];
    
    for (let i = 0; i < count; i++) {
      logs.push(this.generateLogEntry(type));
    }
    
    // Sort by timestamp
    logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    return logs;
  }

  /**
   * Generate formatted log entries as a string
   * @param {number} count - Number of log entries to generate
   * @param {string} type - Optional log type filter
   * @returns {string} Formatted log entries
   */
  generateFormattedLogs(count = 10, type = null) {
    const logs = this.generateLogEntries(count, type);
    return logs.map(log => this.formatLogEntry(log)).join('\n');
  }

  /**
   * Generate a breach log scenario
   * @param {string} target - Target system name
   * @returns {string} Formatted breach logs
   */
  generateBreachLogs(target = 'server') {
    const logs = [];
    
    // Initial connection attempts
    logs.push({
      timestamp: this.generateTimestamp(),
      type: 'NETWORK',
      process: 'sshd',
      user: 'system',
      message: `Connection attempt from ${this.ipAddresses[Math.floor(Math.random() * this.ipAddresses.length)]}`
    });
    
    // Failed authentication attempts
    for (let i = 0; i < 3; i++) {
      logs.push({
        timestamp: this.generateTimestamp(),
        type: 'AUTH',
        process: 'sshd',
        user: 'root',
        message: `Failed authentication attempt from ${this.ipAddresses[Math.floor(Math.random() * this.ipAddresses.length)]}`
      });
    }
    
    // Successful authentication
    logs.push({
      timestamp: this.generateTimestamp(),
      type: 'AUTH',
      process: 'sshd',
      user: 'admin',
      message: `Successful login from ${this.ipAddresses[Math.floor(Math.random() * this.ipAddresses.length)]}`
    });
    
    // File access
    logs.push({
      timestamp: this.generateTimestamp(),
      type: 'SECURITY',
      process: 'audit',
      user: 'admin',
      message: `File access: /etc/shadow`
    });
    
    // Privilege escalation
    logs.push({
      timestamp: this.generateTimestamp(),
      type: 'SECURITY',
      process: 'sudo',
      user: 'admin',
      message: `Privilege escalation to root`
    });
    
    // Configuration changes
    logs.push({
      timestamp: this.generateTimestamp(),
      type: 'SYSTEM',
      process: 'systemd',
      user: 'root',
      message: `Service configuration modified: firewall`
    });
    
    // Data exfiltration
    logs.push({
      timestamp: this.generateTimestamp(),
      type: 'NETWORK',
      process: 'kernel',
      user: 'root',
      message: `Large data transfer to external IP ${this.ipAddresses[Math.floor(Math.random() * this.ipAddresses.length)]}`
    });
    
    // Cleanup attempt
    logs.push({
      timestamp: this.generateTimestamp(),
      type: 'SECURITY',
      process: 'audit',
      user: 'root',
      message: `Log file deletion attempt: /var/log/auth.log`
    });
    
    // Sort by timestamp
    logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    return logs.map(log => this.formatLogEntry(log)).join('\n');
  }
}

// Create and export a singleton instance
const logsService = new LogsService();
export default logsService;
