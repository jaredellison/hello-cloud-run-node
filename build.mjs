import * as esbuild from 'esbuild';
import esbuildPluginPino from 'esbuild-plugin-pino';

let environment = 'deployed';
process.argv.forEach((arg, i) => {
  if (arg === '--env' && process.argv[i + 1] === 'local') environment = 'local';
});

const nodeOptions = {
  target: 'node18',
  platform: 'node',
};

const localOptions = {
  minify: false,
  keepNames: true,
  sourcesContent: true,
};

const deployedOptions = {
  minify: true,
  keepNames: false,
  sourcesContent: false,
};

console.log('Build configured for environment:', environment);

await esbuild.build({
  entryPoints: ['src/server.ts'],
  outdir: 'dist',
  ...nodeOptions,
  ...(environment === 'deployed' ? deployedOptions : localOptions),
  bundle: true,
  sourcemap: true,
  plugins: [esbuildPluginPino(['pino-pretty'])],
});
