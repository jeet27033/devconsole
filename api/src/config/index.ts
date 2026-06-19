import * as dotenv from 'dotenv';

dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'test',
  CLUSTER: process.env.CLUSTER || 'crm-nightly-new',
  INTOUCH_INTERNAL_API_URL: process.env.INTOUCH_INTERNAL_API_URL || '',
  INTOUCH_INTERNAL_API_KEY: process.env.INTOUCH_INTERNAL_API_KEY || '',
  ORG_SETTINGS_SERVICE_HOST: process.env.ORG_SETTINGS_SERVICE_HOST || '',
  VULCAN_SERVICE_HOST: process.env.VULCAN_SERVICE_HOST || '',
  INTOUCH_AUTH_TOKEN: process.env.INTOUCH_AUTH_TOKEN || '',
  API_GATEWAY_EXTENSIONS_HOST: process.env.API_GATEWAY_EXTENSIONS_HOST || '',
  API_GATEWAY_EXTENSIONS_AUTH: process.env.API_GATEWAY_EXTENSIONS_AUTH || '',
  NEWRELIC_API_KEY: process.env.NEWRELIC_API_KEY || '',
  MYSQL_META_HOST: process.env.MYSQL_META_HOST || '',
  MYSQL_META_USERNAME: process.env.MYSQL_META_USERNAME || '',
  MYSQL_META_PASSWORD: process.env.MYSQL_META_PASSWORD || '',
  MONGO_META_URI: process.env.MONGO_META_URI || '',
  MONGO_POOL_SIZE: parseInt(process.env.MONGO_POOL_SIZE || '', 10),
  MONGO_EXTENSIONS_URI: process.env.MONGO_EXTENSIONS_URI || '',
  JENKINS_URL: process.env.JENKINS_URL || '',
  JENKINS_AUTH: process.env.JENKINS_AUTH || '',
  JENKINS_USER: process.env.JENKINS_USER || '',
  JENKINS_API_TOKEN: process.env.JENKINS_API_TOKEN || '',
  SLAVE_APITESTER_KEY: process.env.SLAVE_APITESTER_KEY || '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  LOKI_URL: process.env.LOKI_URL || '',
  MASTER_APITESTER: process.env.MASTER_APITESTER || '',
  HOTSWAP_URL: process.env.HOTSWAP_URL || 'http://ptmysqlhotswap.default.svc.cluster.local',
  HOTSWAP_USER: process.env.HOTSWAP_USER || 'apitester',
  HOTSWAP_PASSWORD: process.env.HOTSWAP_PASSWORD || '',
  BUGSNAG_API_TOKEN: process.env.BUGSNAG_API_TOKEN || '',
  BUGSNAG_API_KEY: process.env.BUGSNAG_API_KEY || '',
  BUGSNAG_ORGANIZATION_ID: process.env.BUGSNAG_ORGANIZATION_ID || '',
  BUGSNAG_TEAM_ID: process.env.BUGSNAG_TEAM_ID || '',
};

export default config;
