const generateHash = require('./generateHash');
const { appName } = require('../../../app-config');
const appNameHash = () => `${appName}-${generateHash(appName, 6)}`;
module.exports = appNameHash;
