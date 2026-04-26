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
  API_GATEWAY_EXTENSIONS_HOST: process.env.API_GATEWAY_EXTENSIONS_HOST || '',
  API_GATEWAY_EXTENSIONS_AUTH: process.env.API_GATEWAY_EXTENSIONS_AUTH || '',
  NEWRELIC_API_KEY: process.env.NEWRELIC_API_KEY || '',
  MYSQL_HOST: process.env.MYSQL_HOST || '',
  MYSQL_PORT: parseInt(process.env.MYSQL_PORT || '', 10),
  MYSQL_USERNAME: process.env.MYSQL_USERNAME || '',
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
  MYSQL_DATABASE: process.env.MYSQL_DATABASE || '',
  MONGO_URI: process.env.MONGO_URI || '',
  MONGO_POOL_SIZE: parseInt(process.env.MONGO_POOL_SIZE || '', 10),
  JENKINS_URL: process.env.JENKINS_URL || '',
  JENKINS_AUTH: process.env.JENKINS_AUTH || '',
  JENKINS_USER: process.env.JENKINS_USER || '',
  JENKINS_API_TOKEN: process.env.JENKINS_API_TOKEN || '',
  SLAVE_APITESTER_KEY: process.env.SLAVE_APITESTER_KEY || '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  LOKI_URL: process.env.LOKI_URL || '',
};

export default config;
