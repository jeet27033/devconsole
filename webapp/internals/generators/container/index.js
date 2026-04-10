/**
 * Container Generator
 */

const componentExists = require('../utils/componentExists');
const { useTestSetup } = require('../../../app-config');

module.exports = {
  description: 'Add a Stateful functional component',
  prompts: [
    {
      type: 'list',
      name: 'type',
      message: 'Select the type of component',
      default: 'organisms',
      choices: () => ['organisms', 'templates', 'pages'],
    },
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'Form',
      validate: value => {
        if (/.+/.test(value)) {
          return componentExists(value)
            ? 'A container with this name already exists'
            : true;
        }

        return 'The name is required';
      },
    },
    {
      type: 'confirm',
      name: 'wantHeaders',
      default: false,
      message: 'Do you want headers?',
    },
    {
      type: 'confirm',
      name: 'wantActionsAndReducer',
      default: true,
      message:
        'Do you want an actions/constants/selectors/reducer tuple for this container?',
    },
    {
      type: 'confirm',
      name: 'wantSaga',
      default: true,
      message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
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
      default: true,
      message: 'Do you want to load resources asynchronously?',
    },
  ],
  actions: data => {
    // Generate index.js and index.test.js
    const componentTemplate = './container/container.js.hbs';
    const pageComponentTemplate = './container/pageContainer.js.hbs';
    const path = '../../app/components/{{type}}/{{properCase name}}';
    const indexTemplate = './utils/index-withCustomAuthAndTranslationsHOC.js.hbs';
    const testTemplate = './utils/test.js.hbs';
    // const storiesTemplate = './utils/stories.js.hbs';
    const messageTemplate = './utils/messages.js.hbs';
    const loadablesTemplate = './utils/loadable.js.hbs';
    const constantsTemplate = './utils/constants.js.hbs';
    const actionsTemplate = './container/actions.js.hbs';
    const actionsTestTemplate = './container/actions.test.js.hbs';
    const selectorsTemplate = './container/selectors.js.hbs';
    const selectorsTestTemplate = './container/selectors.test.js.hbs';
    const reducerTemplate = './container/reducer.js.hbs';
    const reducerTestTemplate = './container/reducer.test.js.hbs';
    const sagaTemplete = './container/saga.js.hbs';
    const sagaTestTemplate = './container/saga.test.js.hbs';
    const stylesTemplate = './container/styles.js.hbs';

    const actions = [
      {
        type: 'add',
        path: `${path}/{{properCase name}}.js`,
        templateFile: data.type === 'pages' ? pageComponentTemplate: componentTemplate,
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${path}/index.js`,
        templateFile: indexTemplate,
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${path}/styles.js`,
        templateFile: stylesTemplate,
        abortOnFail: true,
      },
    ];

    if (useTestSetup) {
      actions.push({
        type: 'add',
        path: `${path}/tests/index.test.js`,
        templateFile: testTemplate,
        abortOnFail: true,
      });
    }

    // If component wants messages
    if (data.wantMessages) {
      actions.push({
        type: 'add',
        path: `${path}/messages.js`,
        templateFile: messageTemplate,
        abortOnFail: true,
      });
    }

    // If they want actions and a reducer, generate actions.js, constants.js,
    // reducer.js and the corresponding tests for actions and the reducer
    if (data.wantActionsAndReducer) {
      // Actions
      actions.push({
        type: 'add',
        path: `${path}/actions.js`,
        templateFile: actionsTemplate,
        abortOnFail: true,
      });
      if (useTestSetup) {
        actions.push({
          type: 'add',
          path: `${path}/tests/actions.test.js`,
          templateFile: actionsTestTemplate,
          abortOnFail: true,
        });
      }

      // Constants
      actions.push({
        type: 'add',
        path: `${path}/constants.js`,
        templateFile: constantsTemplate,
        abortOnFail: true,
      });

      // Selectors
      actions.push({
        type: 'add',
        path: `${path}/selectors.js`,
        templateFile: selectorsTemplate,
        abortOnFail: true,
      });
      if (useTestSetup) {
        actions.push({
          type: 'add',
          path: `${path}/tests/selectors.test.js`,
          templateFile: selectorsTestTemplate,
          abortOnFail: true,
        });
      }

      // Reducer
      actions.push({
        type: 'add',
        path: `${path}/reducer.js`,
        templateFile: reducerTemplate,
        abortOnFail: true,
      });
      if (useTestSetup) {
        actions.push({
          type: 'add',
          path: `${path}/tests/reducer.test.js`,
          templateFile: reducerTestTemplate,
          abortOnFail: true,
        });
      }
    }

    // Sagas
    if (data.wantSaga) {
      actions.push({
        type: 'add',
        path: `${path}/saga.js`,
        templateFile: sagaTemplete,
        abortOnFail: true,
      });
      if (useTestSetup) {
        actions.push({
          type: 'add',
          path: `${path}/tests/saga.test.js`,
          templateFile: sagaTestTemplate,
          abortOnFail: true,
        });
      }
    }

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
