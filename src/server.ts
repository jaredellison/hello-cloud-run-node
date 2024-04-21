import express from 'express';
import logger, { loggerContextMiddleware } from './logger';
import config from './config';
import { recordDuration } from './metrics';
import task from './task';

const app = express();

app.use(express.json());

app.get('/', loggerContextMiddleware, (_, res) => {
  logger.info('hello logger');

  logger.warn('hello warning message');

  logger.error(new Error('There was an error'));

  res.send('Hello World!');
});

app.get('/task', loggerContextMiddleware, async (_, res) => {
  const finishRecording = recordDuration('task');
  await task();
  finishRecording();
  res.sendStatus(200);
});

app.post('/query', loggerContextMiddleware, async (req, res) => {
  logger.info('req.body:', req.body);
  res.sendStatus(200);
});

app.listen(config.port, () => {
  logger.info(`Example app listening on port ${config.port}`);
});
