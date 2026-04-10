const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const NATIVE_APP_TYPE = 'native';
const GLOBAL_APP_TYPE = 'global';
const EXTERNAL_APP_TYPE = 'external';
const SUPPORTED_APP_TYPES = [
  NATIVE_APP_TYPE,
  EXTERNAL_APP_TYPE,
  GLOBAL_APP_TYPE,
];
const SUPPORTED_APP_CLUSTERS = {
  'DEV': 'dev.intouch.capillarytech.com',
  'NIGHTLY': 'nightly.intouch.capillarytech.com',
  'STAGING': 'staging.intouch.capillarytech.com',
  'IN': 'apac.intouch.capillarytech.com',
  'SG': 'apac2.intouch.capillarytech.com',
  'EU': 'eu.intouch.capillarytech.com',
  'ASIA': 'apac2.intouch.capillarytech.com',
  'TATA': 'tata.intouch.capillarytech.com',
  'US': 'north-america.intouch.capillarytech.com',
  'USHC': 'ushc.intouch.capillarytech.com',
  'SEA': 'sea.intouch.capillarytech.com',
};

const setup = async (appName, projectDir, useTDD = false) => {
  try {
    let existingConfig = {};

    // Check if app-config.js file already exists and has the appType field
    const appConfigFileName = 'app-config.js';
    const configPath = projectDir
      ? `${projectDir}/${appConfigFileName}`
      : appConfigFileName;
    if (fs.existsSync(configPath)) {
      console.log(
        chalk.green(
          'Configuration already exists!, You can still modify certain fields.',
        ),
      );
      let existingPath = path.resolve(__dirname, `../../${appConfigFileName}`);
      existingConfig = require(existingPath);
    }

    if (!appName) {
      ({ appName } = await inquirer.prompt([
        {
          type: 'input',
          name: 'appName',
          message: 'Enter your app name (without spaces):',
          validate: input => {
            const nameCheckRegex = /^[a-zA-Z]([a-zA-Z0-9-_]){0,29}$/;
            if (!nameCheckRegex.test(input)) {
              return 'App name should start with an alphabet, can have lowercase or uppercase alphabets, numbers, hyphens, and underscores, and should be between 1 and 30 characters long';
            }
            return true;
          },
        },
      ]));
    }

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'isHostedOnPlatform',
        message: 'Do you want to host this app on the Vulcan UI platform?',
        default: true,
      },
      {
        type: 'input',
        name: 'appId',
        message:
          'Provide Vulcan application ID (this is generated when you create the app on Vulcan UI platform, it\'s used for making API calls for the app hosted on the platform, you can update this later also)',
        default: '',
        when: answers => answers.isHostedOnPlatform,
      },
      {
        type: 'input',
        name: 'cluster',
        message:
          `Which cluster is this application created in? (${Object.keys(SUPPORTED_APP_CLUSTERS).join(', ')})`,
        default: 'NIGHTLY',
        when: answers => answers.isHostedOnPlatform && answers.appId,
      },
      {
        type: 'input',
        name: 'appType',
        message: `Is this a ${NATIVE_APP_TYPE} or ${GLOBAL_APP_TYPE} or ${EXTERNAL_APP_TYPE} app? (This selection cannot be changed once app is created, choose native / global for Capillary apps and external for other micro-sites)`,
        default: NATIVE_APP_TYPE,
        when: !existingConfig.appType, // Skip if appType is already available
        validate: input => {
          const allowedValues = SUPPORTED_APP_TYPES;
          if (!allowedValues.includes(input)) {
            return `Invalid input. Please enter any of ${SUPPORTED_APP_TYPES.join(
              ', ',
            )}`;
          }
          return true;
        },
      },
      {
        type: 'confirm',
        name: 'useBugsnag',
        message: 'Do you want to use Bugsnag?',
        default: false,
      },
      {
        type: 'input',
        name: 'bugsnagApiKey',
        message: 'Enter your Bugsnag API key (this should be a public key with push-metrics permission)',
        when: answers => answers.useBugsnag,
      },
      {
        type: 'confirm',
        name: 'retainSourceMaps',
        message: 'Do you want to retain sourcemaps after uploading to Bugsnag?',
        default: false,
        when: answers => answers.useBugsnag,
      },
      {
        type: 'confirm',
        name: 'useSourceMaps',
        message: 'Do you want to use sourcemaps? (helps in debugging but increases bundle size, recommended for UAT)',
        default: false,
        when: answers => !answers.useBugsnag,
      },
      {
        type: 'confirm',
        name: 'useI18n',
        message: 'Do you want to have internationalization support? (I18N)',
        default: false,
      },
      {
        type: 'input',
        name: 'appNames',
        message: 'Since this app is not hosted on Vulcan UI platform, please enter the Locize app names to be used in your app for I18N (comma separated):',
        when: answers =>
          answers.useI18n &&
          !answers.isHostedOnPlatform &&
          (answers.appType || existingConfig.appType) === NATIVE_APP_TYPE,
        filter: input => input.replace(/\s/g, ''),
      },
      {
        type: 'confirm',
        name: 'customI18n',
        message:
          'Do you want custom API integration for I18N instead of Locize?',
        default: false,
        when: answers => answers.useI18n && answers.isHostedOnPlatform,
      },
      {
        type: 'confirm',
        name: 'localI18n',
        message:
          'Do you want to configure I18N messages from the application code itself? (locale specific JSON files in app/translations folder of the code)',
        default: false,
        when: answers => answers.useI18n && answers.isHostedOnPlatform && !answers.customI18n,
      },
      {
        type: 'input',
        name: 'locales',
        message: 'Enter the locales supported for your app (comma separated):',
        when: answers => answers.isHostedOnPlatform && (answers.customI18n || answers.localI18n),
        default: 'en-US,ja-JP',
        filter: input => input.replace(/\s/g, ''),
        validate: input => {
          const locales = input.split(',').map(locale => locale.trim());
          // Check if all elements are in the format of language code followed by country code (e.g., en-US)
          const isValid = locales.every(locale =>
            /^[a-z]{2}-[A-Z]{2}$/.test(locale),
          );
          if (!isValid) {
            return 'Invalid input. Please enter locales in the format of language code followed by country code (e.g., en-US), separated by commas.';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'defaultLocale',
        message: 'Enter the default locale for your app:',
        when: answers => answers.isHostedOnPlatform && (answers.customI18n || answers.localI18n),
        default: 'en-US',
        filter: input => input.replace(/\s/g, ''),
        validate: (input, answers) => {
          const defaultLocale = input.trim();
          // Check if the defaultLocale is in the format of language code followed by country code (e.g., en-US)
          const isValid = /^[a-z]{2}-[A-Z]{2}$/.test(defaultLocale);
          if (!isValid) {
            return 'Invalid input. Please enter the default locale in the format of language code followed by country code (e.g., en-US).';
          }
          // Check if the defaultLocale is included in the list of supported locales
          let allLocales = answers.locales.split(',');
          for (let i = 0; i < allLocales.length; i++) {
            let tempLocale = allLocales[i] ? allLocales[i].trim() : '';
            if (tempLocale === defaultLocale) {
              return true;
            }
          }
          return 'Invalid input. The default locale must be one of the supported locales.';
        },
      },
      {
        type: 'confirm',
        name: 'useGTM',
        message: 'Do you want to use Google Tag Manager for observability?',
        default: false,
      },
      {
        type: 'input',
        name: 'gtmTrackingId',
        message: 'Enter your Google Analytics Tracking ID:',
        when: (answers) => answers.useGTM,
        default: null,
      },
      {
        type: 'input',
        name: 'gtmProjectId',
        message: 'Enter your Google Tag Manager Project ID:',
        when: answers => answers.useGTM,
      },
      {
        type: 'confirm',
        name: 'useNavigationComponent',
        message: 'Do you want to use Capillary Navigation Component in your project? (Top navbar with org switcher and other default blocks)',
        default: true,
        when: answers =>
          answers.appType !== EXTERNAL_APP_TYPE ||
          existingConfig.appType !== EXTERNAL_APP_TYPE,
      },
    ]);

    // Create a config object with the user's answers, including appName
    const config = {
      appName,
      appId: answers.appId,
      intouchBaseUrl: SUPPORTED_APP_CLUSTERS[answers.cluster ? answers.cluster.toUpperCase() : 'NIGHTLY'],
      prefix: `/${appName}/ui`,
      isHostedOnPlatform: answers.isHostedOnPlatform,
      appType: answers.appType || existingConfig.appType,
      bugsnag: {
        useBugsnag: answers.useBugsnag,
        apiKey: answers.bugsnagApiKey || null,
        retainSourceMaps: answers.retainSourceMaps !== undefined ? answers.retainSourceMaps : false,
      },
      useSourceMaps: (answers.useBugsnag || answers.useSourceMaps) !== undefined ? (answers.useBugsnag || answers.useSourceMaps) : false,
      i18n: {
        useI18n: answers.useI18n,
        customI18n: answers.customI18n !== undefined ? answers.customI18n : false,
        localI18n: answers.localI18n !== undefined ? answers.localI18n : false,
        appNames: answers.appNames ? answers.appNames.split(',') : [],
        locales: answers.locales ? answers.locales.split(',') : [],
        defaultLocale: answers.defaultLocale || null,
      },
      gtm: {
        useGTM: answers.useGTM,
        trackingId: answers.gtmTrackingId || null,
        projectId: answers.gtmProjectId || null,
      },
      useNavigationComponent: answers.useNavigationComponent,
      useTestSetup: useTDD,
    };

    // Convert config object to JavaScript object syntax
    const configJS = `module.exports = ${JSON.stringify(config, null, 2)};`;

    // Write the config to a file (e.g., config.js)
    fs.writeFileSync(configPath, configJS);

    // create locale translation message files in project if locale I18n is being used
    if (config.i18n.localI18n && config.i18n.locales && config.i18n.locales.length > 0) {
      config.i18n.locales.forEach(locale => {
        const localeFileName = `${projectDir}/app/translations/${locale.split('-')[0]}.json`;
        if (!fs.existsSync(localeFileName)) {
          fs.writeFileSync(localeFileName, '{}');
          console.log(
            chalk.green(`Locale translations file created: ${localeFileName}  ✅`),
          );
        }
      });
    }

    console.log(
      chalk.green('Configuration saved successfully to app-config.js!  ✅'),
    );
    return config;
  } catch (error) {
    console.error(chalk.red('Error occurred during setup:', error));
  }
};

function runSetup() {
  const [, , projectName] = process.argv;
  if (!projectName) {
    console.log(chalk.yellow('No project name passed!'));
    setup();
  } else {
    console.log(chalk.yellow('Project name passed, using it in setup'));
    setup(projectName);
  }
}

if (require.main === module) {
  runSetup();
} else {
  module.exports = setup;
}
