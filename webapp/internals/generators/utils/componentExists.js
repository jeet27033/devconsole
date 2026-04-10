/**
 * componentExists
 *
 * Check whether the given component exist in either the components or containers directory
 */

const { readdirSync } = require('fs');
const { join } = require('path');

const components = [
  ...readdirSync(join(__dirname, '../../../app/components/atoms')), // get all the common atoms
  ...readdirSync(join(__dirname, '../../../app/components/molecules')), // get all the common molecules
  ...readdirSync(join(__dirname, '../../../app/components/organisms')), // get all the common organism
  ...readdirSync(join(__dirname, '../../../app/components/templates')), // get all the common templates
  ...readdirSync(join(__dirname, '../../../app/components/pages')), // get all the common pages
];

function componentExists(comp) {
  return components.indexOf(comp) >= 0;
}

module.exports = componentExists;
