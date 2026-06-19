import mysql from 'mysql2/promise';
import config from '../config';
import logger from '../helpers/logger';

let pool: mysql.Pool | null = null;

export const connectMySQL = async (): Promise<void> => {
  logger.info('Connecting to MySQL...');
  logger.info(`MySQL URI: ${config.MYSQL_META_HOST}:3306`);
  try {
    pool = mysql.createPool({
      host: config.MYSQL_META_HOST,
      port: 3306,
      user: config.MYSQL_META_USERNAME,
      password: config.MYSQL_META_PASSWORD,
      database: 'api_testing',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });


    // Test the connection
    const connection = await pool.getConnection();
    connection.release();
    logger.info('MySQL connected successfully');
  } catch (error) {
    logger.error('MySQL connection failed:', (error as Error).message);
    throw error;
  }
};

export const getMySQLPool = (): mysql.Pool => {
  if (!pool) {
    throw new Error('MySQL pool not initialized. Call connectMySQL() first.');
  }
  return pool;
};

export const closeMySQLConnection = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('MySQL connection closed');
  }
};
