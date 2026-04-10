/**
 * generator/index.js
 *
 * Exports the generators so plop knows them
 */

const componentGenerator = require('./component/index.js');
const containerGenerator = require('./container/index.js');

module.exports = plop => {
  plop.setGenerator('Stateless Functional Component: Atoms (or) Molecules', componentGenerator);
  plop.setGenerator('Stateful Functional Component: organisms (or) pages (or) templates', containerGenerator);
  plop.addHelper('curly', (object, open) => (open ? '{' : '}'));
};
