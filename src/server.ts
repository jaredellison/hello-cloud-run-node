import express from 'express';
import logger, { loggerContextMiddleware } from './logger';

const app = express();
const port = process.env['PORT'] || '3000';

app.get('/', loggerContextMiddleware, (_, res) => {
  logger.info('hello logger');

  logger.warn('hello warning message');

  logger.error(new Error('There was an error'));

  res.send('Hello World!');
});

app.listen(port, () => {
  logger.info(`Example app listening on port ${port}`);
});
