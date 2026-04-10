/**
 * Component Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../utils/componentExists');

module.exports = {
  description: 'Add an stateless functional component',
  prompts: [
    {
      type: 'list',
      name: 'type',
      message: 'Select the type of component',
      default: 'atoms',
      choices: () => ['atoms', 'molecules'],
    },
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'Button',
      validate: value => {
        if (/.+/.test(value)) {
          return componentExists(value)
            ? 'A component or container with this name already exists'
            : true;
        }

        return 'The name is required';
      },
    },
    {
      type: 'confirm',
      name: 'wantMessages',
      default: true,
      message: 'Do you want i18n messages (i.e. will this component use text)?',
    },
    {
      type: 'confirm',
      name: 'wantLoadable',
      default: false,
      message: 'Do you want to load the component asynchronously?',
    },
  ],
  actions: data => {
    // Generate index.js and index.test.js
    const path = '../../app/components/{{type}}/{{properCase name}}';
    const componentTemplate = './component/component.js.hbs';
    const indexTemplate = './utils/index.js.hbs';
    const testTemplate = './utils/test.js.hbs';
    // const storiesTemplate = './utils/stories.js.hbs';
    const messageTemplate = './utils/messages.js.hbs';
    const loadablesTemplate = './utils/loadable.js.hbs';
    const stylesTemplate = './component/styles.js.hbs';

    const actions = [
      {
        type: 'add',
        path: `${path}/index.js`,
        templateFile: indexTemplate,
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${path}/{{properCase name}}.js`,
        templateFile: componentTemplate,
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${path}/tests/index.test.js`,
        templateFile: testTemplate,
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${path}/styles.js`,
        templateFile: stylesTemplate,
        abortOnFail: true,
      },
    ];

    // If they want a i18n messages file
    if (data.wantMessages) {
      actions.push({
        type: 'add',
        path: `${path}/messages.js`,
        templateFile: messageTemplate,
        abortOnFail: true,
      });
    }

    // If want Loadable.js to load the component asynchronously
    if (data.wantLoadable) {
      actions.push({
        type: 'add',
        path: `${path}/Loadable.js`,
        templateFile: loadablesTemplate,
        abortOnFail: true,
      });
    }

    return actions;
  },
};
