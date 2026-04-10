const chalk = require('chalk');
let appConfig;
// Print a message indicating the start of validations
console.log(chalk.blue("Running validations before starting webpack..."));

// Constants for error messages
const ERROR_MESSAGES = {
    CONFIG_FILE_MISSING: `app-config.js validation: app-config.js file does not exist. ❌`,
    INVALID_APP_NAME_OR_PREFIX: `app-config.js validation: You have not provided a valid app name or prefix. ❌`,
    MISSING_BUGSNAG_API_KEY: `app-config.js validation: You have opted to use Bugsnag but API key is not specified. ❌`,
    MISSING_GTM_PROJECT_ID: `app-config.js validation: You have opted to use Google Tag Manager but Project Id is not specified. ❌`
};

// Function to exit the process with an error message
function exitWithHint(errorMessage) {
    console.log(chalk.blue(errorMessage));
    process.exit();
}

// Validation rules
const validationRules = [
    {
        name: 'app-config File',
        validate: () => {
            try {
                // Attempt to load the app configuration
                appConfig = require('../../../app-config');
                console.log(chalk.green("app-config.js file exists. ✅"));
            } catch (e) {
                // If the config file doesn't exist, exit with a hint
                exitWithHint(ERROR_MESSAGES.CONFIG_FILE_MISSING);
            }
        }
    },
    {
        name: 'App Name & Prefix',
        validate: () => {
            if (!appConfig.appName || !appConfig.prefix) {
                exitWithHint(ERROR_MESSAGES.INVALID_APP_NAME_OR_PREFIX);
            } else {
                console.log(chalk.green("app-config.js validation: appname and prefix is valid. ✅"));
            }
        }
    },
    {
        name: 'Bugsnag Config',
        validate: () => {
            if (appConfig.bugsnag.useBugsnag) {
                if (!appConfig.bugsnag.apiKey) {
                    exitWithHint(ERROR_MESSAGES.MISSING_BUGSNAG_API_KEY);
                } else {
                    console.log(chalk.green("app-config.js validation: you have opted to use Bugsnag and apiKey is provided. ✅"));
                }
            } else {
                console.log(chalk.green("app-config.js validation: you have not opted to use Bugsnag. ✅"));
            }
        }
    },
    {
        name: 'GTM Config',
        validate: () => {
            if (appConfig.gtm.useGTM) {
                if (!appConfig.gtm.projectId) {
                    exitWithHint(ERROR_MESSAGES.MISSING_GTM_PROJECT_ID);
                } else {
                    console.log(chalk.green("app-config.js validation: you have opted to use Google Tag Manager and project Id is provided. ✅"));
                }
            } else {
                console.log(chalk.green("app-config.js validation: you have not opted to use Google Tag Manager. ✅"));
            }
        }
    }
];

// Run the validations
function runValidations() {
    validationRules.forEach(rule => {
        console.log(chalk.magenta(`Validating ${rule.name}...`));
        rule.validate();
    });
}

// Exported function responsible for validating the app configuration
module.exports = runValidations;
