interface Env {
  port: string | undefined;
  isGCP: string;
  gcpProjectId: string;
  debugMetrics: string | undefined;
  gitVersion: string | undefined;
  serviceName: string | undefined;
}

interface Config {
  port: string;
  isGCP: boolean;
  gcpProjectId: string;
  debugMetrics: boolean;
  gitVersion: string | undefined;
  serviceName: string | undefined;
}

export default (function (): Config {
  const requiredEnv = {
    isGCP: process.env['IS_GCP'],
  };

  assertNonNullableProperties(requiredEnv);

  const optionalEnv = {
    port: process.env['PORT'],
    gcpProjectId: process.env['GCP_PROJECT_ID'],
    debugMetrics: process.env['DEBUG_METRICS'],
    gitVersion: process.env['GIT_VERSION'],
    serviceName: process.env['SERVICE_NAME'],
  };

  const env = { ...requiredEnv, ...optionalEnv } as Env;

  const config: Config = {
    ...env,
    port: env.port || '3000',
    isGCP: env.isGCP === 'true',
    gcpProjectId: env.gcpProjectId || '',
    debugMetrics: env.debugMetrics === 'true',
  };

  return config;
})();

function assertNonNullableProperties(o: object) {
  Object.entries(o).forEach(([k, v]) => {
    if (v === undefined)
      throw new Error(`Expected value not to be undefined for key: ${k}`);
  });

  return o;
}
