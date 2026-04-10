/**
 * 
 * @param {string} input 
 * @returns {string} - this is to be run during build time only when node env is available. Not supported for browsers.
 */
function generateHash(input, len=-1) {
  try {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256'); // Specify the hash algorithm here (e.g., 'md5', 'sha1', 'sha256', etc.)
    hash.update(input); // Add the input string to the hash
    return hash.digest('hex').slice(0,len); // Get the hashed output in hexadecimal format
  } catch (e) {
    console.log('this is not supported to run on browser');
  }
}

module.exports = generateHash;
