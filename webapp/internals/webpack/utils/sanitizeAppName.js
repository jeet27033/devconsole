function sanitizeAppName(appName) {
  return appName.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
}

module.exports = sanitizeAppName;