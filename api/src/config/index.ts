import * as dotenv from 'dotenv';

dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'test',
  cluster: process.env.CLUSTER || 'crm-nightly-new',
  INTOUCH_INTERNAL_API_URL: process.env.INTOUCH_INTERNAL_API_URL || '',
  INTOUCH_INTERNAL_API_KEY: process.env.INTOUCH_INTERNAL_API_KEY || '',
  ORG_SETTINGS_SERVICE_HOST: process.env.ORG_SETTINGS_SERVICE_HOST || '',
  VULCAN_SERVICE_HOST: process.env.VULCAN_SERVICE_HOST || '',
  API_GATEWAY_EXTENSIONS_HOST: process.env.API_GATEWAY_EXTENSIONS_HOST || '',
  API_GATEWAY_EXTENSIONS_AUTH: process.env.API_GATEWAY_EXTENSIONS_AUTH || '',
  NEWRELIC_API_KEY: process.env.NEWRELIC_API_KEY || '',

  // MySQL
  MYSQL_HOST: process.env.MYSQL_HOST || '',
  MYSQL_PORT: parseInt(process.env.MYSQL_PORT || '', 10),
  MYSQL_USERNAME: process.env.MYSQL_USERNAME || '',
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
  MYSQL_DATABASE: process.env.MYSQL_DATABASE || '',

  // MongoDB
  MONGO_URI: process.env.MONGO_URI || '',
  MONGO_POOL_SIZE: parseInt(process.env.MONGO_POOL_SIZE || '', 10),

  JENKINS_URL: process.env.JENKINS_URL || '',
  JENKINS_AUTH: process.env.JENKINS_AUTH || '',
};

export default config;
