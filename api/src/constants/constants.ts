export const REDIS_SERVICE_DELIMETER = 'redis-';
export const DEFAULT_STR_DELIMETER = '.default';
export const DEFAULT_RETRY_INTERVAL = 5000;
export const DEFAULT_SENTINEL_RETRY_INTERVAL = 60000;
export const DEFAULT_SENTINEL_RECONNECT_INTERVAL = 60000;
export const DEFAULT_SENTINEL_NODE_COUNT = 3;
export const DEFAULT_REDIS_PORT = 6379;
export const DEFAULT_REDIS_HOST = 'localhost';
export const DEFAULT_SENTINEL_PORT = 26379;
export const DEFAULT_SENTINEL_NODE_PATTERN = '-sentinel-node-';
export const DEFAULT_SENTINEL_HOST_SUB_PATTERN = '-sentinel-headless';
export const DEFAULT_SENTINEL_NAME = 'mymaster';
export const MODULE_NAME = 'redis-module';
export const DEFAULT_SCAN_COUNT= 25;
export const GLUE_INTERNAL_API_URL = 'http://glue.default:8080';
export const CACHE_OPTIONS ={
    redisOptions: {
        db: process.env.DB_NUMBER && parseInt(process.env.DB_NUMBER) || 0,
    },
    sentinelOptions: {
        sentinelMaxConnections: process.env.SENTINEL_MAX_CONNECTIONS && parseInt(process.env.SENTINEL_MAX_CONNECTIONS) || 10,
    },
}
export const IN_PROGRESS = 'IN PROGRESS';