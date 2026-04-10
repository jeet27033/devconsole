(() => {
  'use strict';
  const fs = require('fs');
  const path = require('path');
  const chalk = require('chalk');

  console.log(chalk.cyan('Starting to sync code with app-config...'));

  const packageJson = require('../../package.json');
  const appConfig = require('../../app-config');

  console.log(chalk.cyan('App name from config:', appConfig.appName));

  let indexHtml = fs.readFileSync(path.join(__dirname, '../../app/index.html'), 'utf8');
  let globalStyles = fs.readFileSync(path.join(__dirname, '../../app/global-styles.js'), 'utf8');

  const REGEX_MATCH_TITLE = /<title>([a-z\-_0-9]{1,30})<\/title>/;
  const REGEX_MATCH_BODY_CLASS = /class="([a-z\-_0-9]{1,30})-body"/;
  const REGEX_MATCH_CONTAINER_ID = /id="([a-z\-_0-9]{1,30})-container"/;

  // match and replace name in package.json
  const nameMatchesWithConfig = packageJson.name === appConfig.appName;
  console.log(chalk.cyan('Name in package.json matches with app-config?', nameMatchesWithConfig));
  if (nameMatchesWithConfig) {
    console.log(chalk.green('Name in package.json is already in sync with app-config ✅'));
  } else {
    console.log(chalk.yellow('Syncing the name in package.json with app-config'));
    packageJson.name = appConfig.appName;
    fs.writeFileSync(path.join(__dirname, '../../package.json'), JSON.stringify(packageJson, null, 2));
    console.log(chalk.green('Name in package.json is now in sync with app-config ✅'));
  }

  // match and replace title in index.html
  const matchTitle = indexHtml.match(REGEX_MATCH_TITLE);
  const titleMatchesWithConfig = matchTitle?.[1] === appConfig.appName;
  console.log(chalk.cyan('Title tag in index.html matches with app-config?', titleMatchesWithConfig));
  if (matchTitle) {
    if (titleMatchesWithConfig) {
      console.log(chalk.green('Title tag in index.html is already in sync with app-config ✅'));
    } else {
      console.log(chalk.yellow('Syncing the title tag in index.html with app-config'));
      indexHtml = indexHtml.replace(REGEX_MATCH_TITLE, `<title>${appConfig.appName}</title>`);
      console.log(chalk.green('Title tag in index.html is now in sync with app-config ✅'));
    }
  } else {
    console.log(chalk.yellow('Title tag pattern in index.html not matching vulcan boilerplate!'));
  }

  // match and replace body class in index.html
  const matchBodyClass = indexHtml.match(REGEX_MATCH_BODY_CLASS);
  const bodyClassMatchesWithConfig = matchBodyClass?.[1] === appConfig.appName;
  console.log(chalk.cyan('Body class in index.html matches with app-config?', bodyClassMatchesWithConfig));
  if (matchBodyClass) {
    if (bodyClassMatchesWithConfig) {
      console.log(chalk.green('Body class in index.html is already in sync with app-config ✅'));
    } else {
      console.log(chalk.yellow('Syncing the body class in index.html with app-config'));
      indexHtml = indexHtml.replace(REGEX_MATCH_BODY_CLASS, `class="${appConfig.appName}-body"`);
      console.log(chalk.green('Body class in index.html is now in sync with app-config ✅'));
    }
  } else {
    console.log(chalk.yellow('Body class pattern in index.html not matching vulcan boilerplate!'));
  }

  // match and replace container id in index.html
  const matchContainerId = indexHtml.match(REGEX_MATCH_CONTAINER_ID);
  const containerIdMatchesWithConfig = matchContainerId?.[1] === appConfig.appName;
  console.log(chalk.cyan('Container ID in index.html matches with app-config?', containerIdMatchesWithConfig));
  if (matchContainerId) {
    if (containerIdMatchesWithConfig) {
      console.log(chalk.green('Container ID in index.html is already in sync with app-config ✅'));
    } else {
      console.log(chalk.yellow('Syncing the container ID in index.html with app-config'));
      indexHtml = indexHtml.replace(REGEX_MATCH_CONTAINER_ID, `id="${appConfig.appName}-container"`);
      console.log(chalk.green('Container ID in index.html is now in sync with app-config ✅'));
    }
  } else {
    console.log(chalk.yellow('Container ID pattern in index.html not matching vulcan boilerplate!'));
  }

  if (!titleMatchesWithConfig || !bodyClassMatchesWithConfig || !containerIdMatchesWithConfig) {
    fs.writeFileSync(path.join(__dirname, '../../app/index.html'), indexHtml);
  }

  const REGEX_MATCH_BODY_CLASS_STYLES = /\.([a-z\-_0-9]{1,30})-body/;
  const REGEX_MATCH_CONTAINER_ID_STYLES = /#([a-z\-_0-9]{1,30})-container/;

  // match and replace body class in global-styles.js
  const matchBodyClassStyles = globalStyles.match(REGEX_MATCH_BODY_CLASS_STYLES);
  const bodyClassStylesMatchesWithConfig = matchBodyClassStyles?.[1] === appConfig.appName;
  console.log(chalk.cyan('Body class in global-styles.js matches with app-config?', bodyClassStylesMatchesWithConfig));
  if (matchBodyClassStyles) {
    if (bodyClassStylesMatchesWithConfig) {
      console.log(chalk.green('Body class in global-styles.js is already in sync with app-config ✅'));
    } else {
      console.log(chalk.yellow('Syncing the body class in global-styles.js with app-config'));
      globalStyles = globalStyles.replace(REGEX_MATCH_BODY_CLASS_STYLES, `.${appConfig.appName}-body`);
      console.log(chalk.green('Body class in global-styles.js is now in sync with app-config ✅'));
    }
  } else {
    console.log(chalk.yellow('Body class pattern in global-styles.js not matching vulcan boilerplate!'));
  }

  // match and replace container id in global-styles.js
  const matchContainerIdStyles = globalStyles.match(REGEX_MATCH_CONTAINER_ID_STYLES);
  const containerIdStylesMatchesWithConfig = matchContainerIdStyles?.[1] === appConfig.appName;
  console.log(chalk.cyan('Container ID in global-styles.js matches with app-config?', containerIdStylesMatchesWithConfig));
  if (matchContainerIdStyles) {
    if (containerIdStylesMatchesWithConfig) {
      console.log(chalk.green('Container ID in global-styles.js is already in sync with app-config ✅'));
    } else {
      console.log(chalk.yellow('Syncing the container ID in global-styles.js with app-config'));
      globalStyles = globalStyles.replace(REGEX_MATCH_CONTAINER_ID_STYLES, `#${appConfig.appName}-container`);
      console.log(chalk.green('Container ID in global-styles.js is now in sync with app-config ✅'));
    }
  } else {
    console.log(chalk.yellow('Container ID pattern in global-styles.js not matching vulcan boilerplate!'));
  }

  if (!bodyClassStylesMatchesWithConfig || !containerIdStylesMatchesWithConfig) {
    fs.writeFileSync(path.join(__dirname, '../../app/global-styles.js'), globalStyles);
  }

  console.log(chalk.green('Syncing code with app-config is complete!! ✅'));
})();
