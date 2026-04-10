const path = require('path');
const chalk = require('chalk');
const AdmZip = require('adm-zip');
const AppConfig = require('../../app-config');

const zipDirectory = async (sourceDir, outputFilePath) => {
  if (AppConfig.isHostedOnPlatform) {
    const zip = new AdmZip();
    zip.addLocalFolder(sourceDir);
    await zip.writeZipPromise(outputFilePath);
    console.log(chalk.green(`Zip file created: ${outputFilePath}`));
    console.log(chalk.green('You can now upload the build.zip file to the Vulcan UI for deployment!!'));
  } else {
    console.log(chalk.yellow('You have chosen not to host this app on Vulcan UI, so zip creation is being skipped'));
  }
};

(async () => {
  await zipDirectory(path.resolve(__dirname + '../../../dist'), path.resolve(__dirname + '../../../build.zip'));
})();
