const { appName } = require('../../app-config');

import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
registerRequireContextHook();

HTMLCanvasElement.prototype.getContext = jest.fn(); // for this error : Not implemented: HTMLCanvasElement.prototype.getContext

global.CURRENT_APP_NAME = appName;
