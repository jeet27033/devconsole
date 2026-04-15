import express from 'express';
import config from './config';
import loaders from './loaders';
import { closeMySQLConnection } from './loaders/mysql';
import { closeMongoConnection } from './loaders/mongo';

const app = express();

const startServer = async (): Promise<void> => {
  await loaders(app);

  const server = app.listen(config.port, () =>
    console.log(`Server is listening on port ${config.port}`)
  );

  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;

  const shutdown = async (signal: string) => {
    console.log(`${signal} received.`);
    await closeMySQLConnection();
    await closeMongoConnection();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    console.log('Server closed.');
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();

export default app;