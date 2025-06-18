/**
 * Service for generating UUIDs and other unique identifiers
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a UUID
 * @returns {string} - A UUID
 */
export const generateUUID = () => {
  return uuidv4();
};

/**
 * Generate a device ID
 * @param {string} type - Type of device
 * @returns {string} - A device ID
 */
export const generateDeviceID = (type = 'generic') => {
  const prefix = {
    server: 'SRV',
    router: 'RTR',
    firewall: 'FWL',
    workstation: 'WKS',
    mobile: 'MOB',
    iot: 'IOT',
    generic: 'DEV'
  }[type] || 'DEV';
  
  const uuid = uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase();
  return `${prefix}-${uuid}`;
};

/**
 * Generate an access token
 * @param {number} length - Length of the token
 * @returns {string} - An access token
 */
export const generateAccessToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return token;
};

/**
 * Generate an IP address
 * @param {string} subnet - Subnet prefix (e.g. '192.168.1')
 * @returns {string} - An IP address
 */
export const generateIPAddress = (subnet = null) => {
  if (subnet) {
    const lastOctet = Math.floor(Math.random() * 254) + 1;
    return `${subnet}.${lastOctet}`;
  }
  
  const octet1 = Math.floor(Math.random() * 223) + 1;
  const octet2 = Math.floor(Math.random() * 256);
  const octet3 = Math.floor(Math.random() * 256);
  const octet4 = Math.floor(Math.random() * 254) + 1;
  
  return `${octet1}.${octet2}.${octet3}.${octet4}`;
};

/**
 * Generate a MAC address
 * @returns {string} - A MAC address
 */
export const generateMACAddress = () => {
  const hexDigits = '0123456789ABCDEF';
  let mac = '';
  
  for (let i = 0; i < 6; i++) {
    const hex1 = hexDigits.charAt(Math.floor(Math.random() * 16));
    const hex2 = hexDigits.charAt(Math.floor(Math.random() * 16));
    mac += hex1 + hex2;
    
    if (i < 5) {
      mac += ':';
    }
  }
  
  return mac;
};

export default {
  generateUUID,
  generateDeviceID,
  generateAccessToken,
  generateIPAddress,
  generateMACAddress
};
