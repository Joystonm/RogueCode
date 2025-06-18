import React, { useState } from 'react';
import '../styles/helpPanel.css';

const HelpPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = {
    general: {
      title: 'General Commands',
      content: (
        <>
          <p>Welcome to RogueCode! Here are the basic commands to get you started:</p>
          <ul>
            <li><code>help</code> - Display this help information</li>
            <li><code>clear</code> - Clear the terminal screen</li>
            <li><code>status</code> - Show your current status and stats</li>
            <li><code>mission</code> - Manage hacking missions</li>
          </ul>
        </>
      )
    },
    scan: {
      title: 'Scanning',
      content: (
        <>
          <h3>How to Scan Systems</h3>
          <p>Scanning is the first step in any hack. Use it to gather information about your target.</p>
          
          <div className="command-example">
            <div className="syntax">
              <code>scan [target] [options]</code>
            </div>
            <div className="examples">
              <p><strong>Examples:</strong></p>
              <code>scan server</code>
              <p>Basic scan of a server</p>
              <code>scan network --vulns</code>
              <p>Scan a network and check for vulnerabilities</p>
              <code>scan firewall --deep</code>
              <p>Perform a deep scan on a firewall</p>
            </div>
            <div className="options">
              <p><strong>Options:</strong></p>
              <ul>
                <li><code>--vulns</code> - Check for vulnerabilities</li>
                <li><code>--deep</code> - Perform a more thorough scan</li>
                <li><code>--ports</code> - Focus on port scanning</li>
              </ul>
            </div>
          </div>
          
          <div className="tips">
            <p><strong>Tips:</strong></p>
            <ul>
              <li>Always scan a target before attempting to hack or inject</li>
              <li>Look for vulnerabilities that can be exploited</li>
              <li>Different targets have different security levels</li>
            </ul>
          </div>
        </>
      )
    },
    inject: {
      title: 'Injecting Payloads',
      content: (
        <>
          <h3>How to Inject Payloads</h3>
          <p>Injecting payloads allows you to gain an advantage when hacking systems.</p>
          
          <div className="command-example">
            <div className="syntax">
              <code>inject [payload] [target] [options]</code>
            </div>
            <div className="examples">
              <p><strong>Examples:</strong></p>
              <code>inject malware server</code>
              <p>Inject basic malware into a server</p>
              <code>inject keylogger workstation --stealth</code>
              <p>Stealthily inject a keylogger into a workstation</p>
              <code>inject rootkit firewall --force</code>
              <p>Forcefully inject a rootkit into a firewall</p>
            </div>
            <div className="options">
              <p><strong>Options:</strong></p>
              <ul>
                <li><code>--stealth</code> - Harder to detect but lower success rate</li>
                <li><code>--force</code> - Higher success rate but may trigger alarms</li>
              </ul>
            </div>
          </div>
          
          <div className="payload-types">
            <p><strong>Payload Types:</strong></p>
            <ul>
              <li><code>malware</code> - General purpose malware</li>
              <li><code>keylogger</code> - Records keystrokes on target system</li>
              <li><code>rootkit</code> - Advanced persistent threat</li>
              <li><code>ransomware</code> - Encrypts target files and demands payment</li>
              <li><code>trojan</code> - Disguised as legitimate software</li>
              <li><code>worm</code> - Self-replicating malware</li>
              <li><code>spyware</code> - Surveillance software</li>
            </ul>
          </div>
          
          <div className="tips">
            <p><strong>Tips:</strong></p>
            <ul>
              <li>Different payloads are more effective against different targets</li>
              <li>Stealth mode is useful for avoiding detection</li>
              <li>Force mode is useful when you need to ensure success</li>
            </ul>
          </div>
        </>
      )
    },
    hack: {
      title: 'Hacking',
      content: (
        <>
          <h3>How to Hack Systems</h3>
          <p>Hacking is the main way to gain access to systems and earn rewards.</p>
          
          <div className="command-example">
            <div className="syntax">
              <code>hack [target] [options]</code>
            </div>
            <div className="examples">
              <p><strong>Examples:</strong></p>
              <code>hack server</code>
              <p>Attempt to hack a server</p>
              <code>hack workstation --bruteforce</code>
              <p>Use brute force methods to hack a workstation</p>
              <code>hack firewall --quiet</code>
              <p>Quietly attempt to hack a firewall</p>
            </div>
            <div className="options">
              <p><strong>Options:</strong></p>
              <ul>
                <li><code>--bruteforce</code> - Higher success rate but noisy</li>
                <li><code>--quiet</code> - Lower success rate but stealthier</li>
              </ul>
            </div>
          </div>
          
          <div className="target-types">
            <p><strong>Common Targets:</strong></p>
            <ul>
              <li><code>server</code> - Central computing system (high security)</li>
              <li><code>workstation</code> - Individual computer (low security)</li>
              <li><code>firewall</code> - Network security device (very high security)</li>
              <li><code>router</code> - Network routing device (medium security)</li>
              <li><code>database</code> - Data storage system (high security)</li>
              <li><code>mainframe</code> - High-performance computing system (very high security)</li>
              <li><code>iot</code> - Internet of Things device (low security)</li>
            </ul>
          </div>
          
          <div className="tips">
            <p><strong>Tips:</strong></p>
            <ul>
              <li>Inject a payload into the target first to increase success chance</li>
              <li>Different targets have different security levels and rewards</li>
              <li>Successful hacks earn credits and XP</li>
            </ul>
          </div>
        </>
      )
    },
    mission: {
      title: 'Missions',
      content: (
        <>
          <h3>How to Complete Missions</h3>
          <p>Missions provide objectives, context, and rewards for your hacking activities.</p>
          
          <div className="command-example">
            <div className="syntax">
              <code>mission [subcommand] [options]</code>
            </div>
            <div className="examples">
              <p><strong>Examples:</strong></p>
              <code>mission generate</code>
              <p>Generate a new mission</p>
              <code>mission accept mission-1234</code>
              <p>Accept a specific mission</p>
              <code>mission info mission-1234</code>
              <p>View details about a mission</p>
              <code>mission complete mission-1234</code>
              <p>Mark a mission as complete</p>
            </div>
          </div>
          
          <div className="mission-flow">
            <p><strong>Mission Flow:</strong></p>
            <ol>
              <li>Generate a mission using <code>mission generate</code></li>
              <li>Accept the mission using <code>mission accept [id]</code></li>
              <li>Complete the mission objectives (scan, inject, hack, etc.)</li>
              <li>Mark the mission as complete using <code>mission complete [id]</code></li>
              <li>Collect your rewards (credits, XP, reputation)</li>
            </ol>
          </div>
          
          <div className="tips">
            <p><strong>Tips:</strong></p>
            <ul>
              <li>Higher difficulty missions provide better rewards</li>
              <li>You can have multiple active missions at once</li>
              <li>Missions help you progress through the game</li>
            </ul>
          </div>
        </>
      )
    },
    advanced: {
      title: 'Advanced Commands',
      content: (
        <>
          <h3>Advanced Commands</h3>
          <p>These commands provide additional functionality for experienced hackers.</p>
          
          <div className="command-list">
            <ul>
              <li><code>connect [target]</code> - Connect to a remote system</li>
              <li><code>download [target]</code> - Download files or data</li>
              <li><code>trace [target]</code> - Trace a target's location or activity</li>
              <li><code>decrypt [target]</code> - Decrypt encrypted data</li>
              <li><code>analyze [target]</code> - Analyze data or systems</li>
              <li><code>upgrade [component]</code> - Upgrade your hacking tools or skills</li>
            </ul>
          </div>
          
          <div className="tips">
            <p><strong>Tips:</strong></p>
            <ul>
              <li>Use <code>help [command]</code> to get detailed information about any command</li>
              <li>Combine commands for more effective hacking</li>
              <li>Check your <code>status</code> regularly to see your progress</li>
            </ul>
          </div>
        </>
      )
    }
  };

  return (
    <div className="help-panel">
      <div className="help-header">
        <h2>RogueCode Help</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="help-tabs">
        {Object.keys(tabs).map(tabKey => (
          <button 
            key={tabKey}
            className={`tab-button ${activeTab === tabKey ? 'active' : ''}`}
            onClick={() => setActiveTab(tabKey)}
          >
            {tabs[tabKey].title}
          </button>
        ))}
      </div>
      
      <div className="help-content">
        {tabs[activeTab].content}
      </div>
      
      <div className="help-footer">
        <p>Type <code>help</code> in the terminal for more information on specific commands. Press <code>F1</code> or <code>Ctrl+H</code> to toggle this help panel.</p>
      </div>
    </div>
  );
};

export default HelpPanel;
