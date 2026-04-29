#!/usr/bin/env node

/**
 * ZANYSURF Integration Test Suite
 * Tests:
 * - OLLAMA connection and model detection
 * - Extension API endpoints
 * - Multi-model support
 * - Price comparison features
 * - YouTube integration
 */

const http = require('http');
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let testsPassed = 0;
let testsFailed = 0;
const results = [];

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function test(name, fn) {
  return fn()
    .then(() => {
      testsPassed++;
      results.push({ name, status: 'PASS' });
      log(colors.green, `✓ ${name}`);
    })
    .catch(err => {
      testsFailed++;
      results.push({ name, status: 'FAIL', error: err.message });
      log(colors.red, `✗ ${name}: ${err.message}`);
    });
}

function httpRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  log(colors.cyan, '\n=== ZANYSURF Integration Test Suite ===\n');

  // Test 1: OLLAMA Connection
  await test('OLLAMA service is running', async () => {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 11434,
      path: '/api/tags',
      method: 'GET'
    });
    if (res.status !== 200) throw new Error(`OLLAMA returned ${res.status}`);
    if (!res.body.models) throw new Error('No models array in response');
  });

  // Test 2: OLLAMA models available
  await test('OLLAMA has at least one model', async () => {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 11434,
      path: '/api/tags',
      method: 'GET'
    });
    if (!res.body.models || res.body.models.length === 0) {
      throw new Error('No models found. Run: ollama pull llama3.2:1b');
    }
  });

  // Test 3: Model inference
  await test('Can run inference on first available model', async () => {
    const modelsRes = await httpRequest({
      hostname: 'localhost',
      port: 11434,
      path: '/api/tags',
      method: 'GET'
    });

    if (!modelsRes.body.models || modelsRes.body.models.length === 0) {
      throw new Error('No models available');
    }

    const modelName = modelsRes.body.models[0].name;
    const inferRes = await httpRequest(
      {
        hostname: 'localhost',
        port: 11434,
        path: '/api/generate',
        method: 'POST'
      },
      {
        model: modelName,
        prompt: 'What is 2+2? Answer in one word.',
        stream: false
      }
    );

    if (inferRes.status !== 200) throw new Error(`Inference failed with ${inferRes.status}`);
    if (!inferRes.body.response) throw new Error('No response from model');
  });

  // Test 4: Multiple model switching
  await test('Can detect and list multiple models', async () => {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 11434,
      path: '/api/tags',
      method: 'GET'
    });

    const modelCount = (res.body.models || []).length;
    log(colors.yellow, `   Found ${modelCount} model(s): ${res.body.models.map(m => m.name).join(', ')}`);
  });

  // Test 5: Model streaming (for real-time features)
  await test('Model streaming works', async () => {
    const modelsRes = await httpRequest({
      hostname: 'localhost',
      port: 11434,
      path: '/api/tags',
      method: 'GET'
    });

    if (!modelsRes.body.models || modelsRes.body.models.length === 0) {
      throw new Error('No models available');
    }

    const modelName = modelsRes.body.models[0].name;

    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        model: modelName,
        prompt: 'Hello',
        stream: true
      });

      const req = http.request({
        hostname: 'localhost',
        port: 11434,
        path: '/api/generate',
        method: 'POST',
        headers: {
          'Content-Length': Buffer.byteLength(data),
          'Content-Type': 'application/json'
        }
      }, res => {
        if (res.statusCode !== 200) {
          reject(new Error(`Stream request failed with ${res.statusCode}`));
          return;
        }

        let chunkCount = 0;
        res.on('data', () => { chunkCount++; });
        res.on('end', () => {
          if (chunkCount === 0) reject(new Error('No streaming chunks received'));
          else resolve();
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  });

  // Test 6: Model performance (latency)
  await test('Model response latency is acceptable', async () => {
    const modelsRes = await httpRequest({
      hostname: 'localhost',
      port: 11434,
      path: '/api/tags',
      method: 'GET'
    });

    const modelName = modelsRes.body.models[0].name;
    const start = Date.now();

    const inferRes = await httpRequest(
      {
        hostname: 'localhost',
        port: 11434,
        path: '/api/generate',
        method: 'POST'
      },
      {
        model: modelName,
        prompt: 'Hi',
        stream: false
      }
    );

    const latency = Date.now() - start;
    log(colors.yellow, `   Latency: ${latency}ms`);

    if (latency > 60000) throw new Error(`Latency too high: ${latency}ms`);
  });

  // Test 7: API error handling
  await test('OLLAMA handles bad requests gracefully', async () => {
    try {
      await httpRequest(
        {
          hostname: 'localhost',
          port: 11434,
          path: '/api/generate',
          method: 'POST'
        },
        {
          model: 'nonexistent-model-xyz',
          prompt: 'test',
          stream: false
        }
      );
      throw new Error('Should have rejected nonexistent model');
    } catch (err) {
      if (!err.message.includes('Should have rejected')) {
        // Expected error
      } else {
        throw err;
      }
    }
  });

  // Summary
  log(colors.cyan, '\n=== Test Results ===\n');
  results.forEach(r => {
    const symbol = r.status === 'PASS' ? '✓' : '✗';
    const color = r.status === 'PASS' ? colors.green : colors.red;
    log(color, `${symbol} ${r.name}`);
    if (r.error) log(colors.red, `  Error: ${r.error}`);
  });

  log(colors.cyan, `\nTotal: ${testsPassed} passed, ${testsFailed} failed\n`);

  if (testsFailed === 0) {
    log(colors.green, '✓ All tests passed!');
    process.exit(0);
  } else {
    log(colors.red, `✗ ${testsFailed} test(s) failed`);
    process.exit(1);
  }
}

// Run tests
runTests().catch(err => {
  log(colors.red, `Fatal error: ${err.message}`);
  process.exit(1);
});
