import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
  MeterProvider,
  type PushMetricExporter,
} from '@opentelemetry/sdk-metrics';
import { MetricExporter } from '@google-cloud/opentelemetry-cloud-monitoring-exporter';
import config from './config';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { ValueType } from '@opentelemetry/api';
import { inspect } from 'util';

const meterProvider = new MeterProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: config.gitVersion,
  }),
});

// Local metrics are disabled by default
if (config.isGCP || config.debugMetrics) {
  let exporter: PushMetricExporter = new MetricExporter();

  if (config.debugMetrics) {
    exporter = new ConsoleMetricExporter();
    // Allow logged metrics to be recursively printed to an arbitrary depth
    inspect.defaultOptions.depth = null;
  }

  meterProvider.addMetricReader(
    new PeriodicExportingMetricReader({
      exportIntervalMillis: 10_000, // 10 Seconds
      exporter: exporter,
    })
  );
}

const meter = meterProvider.getMeter('metrics-sample');

const latencyHistogram = meter.createHistogram('task.duration', {
  unit: 'ms',
  description: 'time it takes to complete various tasks',
  valueType: ValueType.INT,
});

export function recordDuration(operation: string): () => void {
  const start = Date.now();
  return () => {
    const end = Date.now();
    latencyHistogram.record(end - start, {
      operation,
    });
  };
}
