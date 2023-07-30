import express from 'express';
import logger, { loggerContextMiddleware } from './logger';
import config from './config';

const app = express();

app.get('/', loggerContextMiddleware, (_, res) => {
  logger.info('hello logger');

  logger.warn('hello warning message');

  logger.error(new Error('There was an error'));

  res.send('Hello World!');
});

app.listen(config.port, () => {
  logger.info(`Example app listening on port ${config.port}`);
});
