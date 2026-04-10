const path = require('path');
const fs = require('fs').promises;  // Use fs.promises for asynchronous operations
const chalk = require('chalk');
const AppConfig = require('../../app-config');

const removeSourcemaps = async (sourceDir) => {
    if (AppConfig.bugsnag.useBugsnag && !AppConfig.bugsnag.retainSourceMaps) {
        try {
            const files = await fs.readdir(sourceDir);

            for (const file of files) {
                if (path.extname(file) === '.map') {
                    await fs.unlink(path.join(sourceDir, file));
                    console.log(chalk.yellow(`Sourcemap Deleted ${file}`));
                }
            }
        } catch (err) {
            console.error(chalk.red(`Error reading or deleting sourcemaps:`), err);
        }
    } else {
        console.log(chalk.yellow('Sourcemaps were not created, cleanup not required.'));
    }
};

(async () => {
    await removeSourcemaps(path.resolve(__dirname, '../../dist'));
})();
