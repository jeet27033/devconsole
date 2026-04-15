import mongoose from 'mongoose';
import config from '../config';
import logger from '../helpers/logger';

export const connectMongo = async (): Promise<void> => {
  try {
    logger.info('Connecting to MongoDB...');
    logger.info(`MongoDB URI: ${config.MONGO_URI}`);
    await mongoose.connect(config.MONGO_URI, {
      maxPoolSize: config.MONGO_POOL_SIZE,
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed:', (error as Error).message);
    throw error;
  }
};

export const closeMongoConnection = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('MongoDB connection closed');
};
