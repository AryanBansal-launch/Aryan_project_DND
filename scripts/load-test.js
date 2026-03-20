#!/usr/bin/env node

const args = process.argv.slice(2).filter((a) => a !== '--verbose');
const url = args[0];
const concurrency = parseInt(args[1] || '20');
const totalRequests = parseInt(args[2] || concurrency);

if (!url) {
  console.error('Usage: node load-test.js <url> [concurrency] [requests]');
  console.log('\nExamples:');
  console.log('  node load-test.js http://localhost:3000/api/cda-call 50');
  console.log('  node load-test.js http://localhost:3000/api/cda-call 30 100');
  process.exit(1);
}

console.log('='.repeat(60));
console.log('Target:', url);
console.log('Concurrency:', concurrency);
console.log('Total Requests:', totalRequests);
console.log('='.repeat(60));
console.log();

const results = {
  successful: 0,
  failed: 0,
  etimedout: 0,
  errors: {},
  durations: [],
  startTime: Date.now()
};

let completed = 0;

function logFailureDetails(id, err, start, targetUrl) {
  const duration = Date.now() - start;
  const code = err?.code || err?.cause?.code || 'UNKNOWN';
  const failurePhase = err?.cause?.code
    ? (['ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED'].includes(err.cause.code)
        ? (err.cause.code === 'ECONNREFUSED' ? 'before_connection' : 'during_transfer')
        : 'unknown')
    : err?.name === 'TypeError' && err?.message?.includes('fetch')
      ? 'before_connection'
      : 'unknown';

  const logEntry = {
    event: 'request_failed',
    requestId: id,
    timestamp: new Date().toISOString(),
    requestInitiatedAt: new Date(start).toISOString(),
    url: targetUrl,
    durationMs: duration,
    errorCode: code,
    errorMessage: err?.message || String(err),
    failurePhase,
    hasCause: !!err?.cause,
    causeCode: err?.cause?.code,
    causeMessage: err?.cause?.message,
  };
  console.log('\n[HTTP-CLIENT] Failure log:', JSON.stringify(logEntry, null, 2));
  console.log(`[HTTP-CLIENT] Phase: ${failurePhase} | Code: ${code} | Duration: ${duration}ms`);
}

async function makeRequest(id) {
  const start = Date.now();

  try {
    const response = await fetch(url);
    const duration = Date.now() - start;

    results.successful++;
    results.durations.push(duration);
    completed++;

    process.stdout.write(`\r[${completed}/${totalRequests}] :white_check_mark: ${results.successful} | :x: ${results.failed} | :dart: ETIMEDOUT: ${results.etimedout}  `);

    return { id, status: 'success', duration };

  } catch (err) {
    const duration = Date.now() - start;
    results.failed++;
    completed++;

    const code = err?.code || err?.cause?.code || 'UNKNOWN';
    results.errors[code] = (results.errors[code] || 0) + 1;

    if (code === 'ETIMEDOUT') {
      results.etimedout++;
    }

    // Log detailed failure info for first 10 failures or with --verbose
    const verbose = process.argv.includes('--verbose');
    if (verbose || results.failed <= 10) {
      logFailureDetails(id, err, start, url);
    } else if (code === 'ETIMEDOUT' && results.etimedout <= 3) {
      logFailureDetails(id, err, start, url);
    }

    process.stdout.write(`\r[${completed}/${totalRequests}] :white_check_mark: ${results.successful} | :x: ${results.failed} | :dart: ETIMEDOUT: ${results.etimedout}  `);

    return { id, status: 'error', code, duration };
  }
}

async function run() {
  console.log('Starting load test...\n');

  const promises = [];

  for (let i = 0; i < totalRequests; i++) {
    promises.push(makeRequest(`REQ-${i + 1}`));

    if (promises.length >= concurrency) {
      await Promise.race(promises);
    }
  }

  await Promise.allSettled(promises);

  const duration = Date.now() - results.startTime;
  const avgDuration = results.durations.length > 0
    ? Math.round(results.durations.reduce((a, b) => a + b, 0) / results.durations.length)
    : 0;
  const minDuration = results.durations.length > 0 ? Math.min(...results.durations) : 0;
  const maxDuration = results.durations.length > 0 ? Math.max(...results.durations) : 0;

  console.log('\n\n' + '='.repeat(60));
  console.log(':bar_chart: FINAL RESULTS');
  console.log('='.repeat(60));
  console.log('Total Requests:   ', totalRequests);
  console.log('Successful:       ', results.successful);
  console.log('Failed:           ', results.failed);
  console.log('ETIMEDOUT:        ', results.etimedout);
  console.log();
  console.log('Total Duration:   ', duration, 'ms');
  console.log('Avg Response:     ', avgDuration, 'ms');
  console.log('Min Response:     ', minDuration, 'ms');
  console.log('Max Response:     ', maxDuration, 'ms');
  console.log('Requests/sec:     ', (totalRequests / (duration / 1000)).toFixed(2));

  if (Object.keys(results.errors).length > 0) {
    console.log();
    console.log('Error Breakdown:');
    Object.entries(results.errors).sort((a, b) => b[1] - a[1]).forEach(([code, count]) => {
      console.log(`  ${code}: ${count}`);
    });
  }

  console.log('='.repeat(60));

  if (results.etimedout > 0) {
    console.log();
    console.log(':dart: ETIMEDOUT ERRORS REPRODUCED:', results.etimedout);
    console.log();
  }
}

run().catch(err => {
  console.error('\nFatal error:', err);
  process.exit(1);
});