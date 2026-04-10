const path = require('path');

require('@babel/register')({
  presets: ['@babel/preset-env'],
  plugins: ['@babel/plugin-proposal-optional-chaining']
});

// Get the script path from command line arguments
const scriptPath = process.argv[2];

// Resolve the path relative to the current working directory (where the script is called from)
// instead of relative to this script's location
require(path.resolve(process.cwd(), scriptPath)); 