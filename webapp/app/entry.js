import { prefix } from '../app-config';
__webpack_public_path__ = ((new URL(((document||{}).currentScript||{}).src||window.location)).origin) + `${prefix}/`

import {
  VulcanSDKSetup,
} from '@capillarytech/vulcan-react-sdk/utils';
import { publicPath } from './config/path';

import { getLocizeMessage, getUserData } from './services/api';

import { appName, i18n as i18nConfig, appType, isHostedOnPlatform } from '../app-config';

VulcanSDKSetup({
  publicPath,
  api:{
    translations: getLocizeMessage,
    auth: getUserData,
  },
  i18nConfig,
  appType,
  appName,
  isHostedOnPlatform,
});