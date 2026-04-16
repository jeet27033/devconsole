import mysql from 'mysql2/promise';
import config from '../config';
import logger from '../helpers/logger';

let pool: mysql.Pool | null = null;

export const connectMySQL = async (): Promise<void> => {
  logger.info('Connecting to MySQL...');
  logger.info(`MySQL URI: ${config.MYSQL_HOST}:${config.MYSQL_PORT}`);
  try {
    pool = mysql.createPool({
      host: config.MYSQL_HOST,
      port: config.MYSQL_PORT,
      user: config.MYSQL_USERNAME,
      password: config.MYSQL_PASSWORD,
      database: config.MYSQL_DATABASE,
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
