import { createLogger, logLevel } from 'pino-gcp-logger';
import { AsyncLocalStorage } from 'async_hooks';
import type { RequestHandler } from 'express';

const context = new AsyncLocalStorage<Store>();

const defaultLevel: logLevel = 'info';
const isGCP = process.env['IS_GCP'] === 'true';

const localJsonOutput = false;

const logger = createLogger(
  defaultLevel,
  isGCP,
  localJsonOutput
    ? {
        transport: {
          target: 'pino/file',
        },
      }
    : undefined
);

type Store = Map<string, typeof logger>;

export default new Proxy(logger, {
  get(target, property, receiver) {
    target = context.getStore()?.get('logger') || target;
    return Reflect.get(target, property, receiver);
  },
});

export const loggerContextMiddleware: RequestHandler = (req, _, next) => {
  let reqLogger = logger;

  const traceHeader = req.header('X-Cloud-Trace-Context');
  const project = process.env['GCP_PROJECT_ID'];
  if (traceHeader && project) {
    const [trace] = traceHeader.split('/');
    reqLogger = logger.child({
      'logging.googleapis.com/trace': `projects/${project}/traces/${trace}`,
    });
  }

  const store: Store = new Map();
  store.set('logger', reqLogger);

  return context.run(store, () => {
    next();
  });
};
