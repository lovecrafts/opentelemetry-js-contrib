'use strict';

const opentelemetry = require('@opentelemetry/core');
const { NodeTracer } = require('@opentelemetry/node-sdk');
const { SimpleSpanProcessor } = require('@opentelemetry/tracer-basic');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
const EXPORTER = process.env.EXPORTER || '';

function setupTracerAndExporters(service) {
    const tracer = new NodeTracer();

    let exporter;
    if (EXPORTER.toLowerCase().startsWith('z')) {
      exporter = new ZipkinExporter({
        serviceName: service,
      });
    } else {
      exporter = new JaegerExporter({
        serviceName: service,
        // The default flush interval is 5 seconds.
        flushInterval: 2000
      });
    }

    tracer.addSpanProcessor(new SimpleSpanProcessor(exporter));

    // Initialize the OpenTelemetry APIs to use the BasicTracer bindings
    opentelemetry.initGlobalTracer(tracer);
}

exports.setupTracerAndExporters = setupTracerAndExporters;