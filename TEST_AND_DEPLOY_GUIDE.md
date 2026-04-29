# ZANYSURF: Complete Testing & Deployment Guide

This document provides a step-by-step guide to test and deploy the ZANYSURF Chrome extension with full feature validation, including OLLAMA multi-model support.

---

## Quick Start (TL;DR)

```bash
# 1. Run setup validation
./qa/test-setup.sh

# 2. Start OLLAMA
ollama serve

# 3. In another terminal, pull a model
ollama pull llama3.2:1b

# 4. Load extension in Chrome
# - Go to chrome://extensions/
# - Enable Developer mode
# - Load unpacked: select the extension/ folder

# 5. Run automated tests
node qa/test-integration.js
```

---

## What's New in This Release

### Enhanced OLLAMA Support
✅ **Multi-Model Support**: Switch between any OLLAMA-installed model  
✅ **Dynamic Model Detection**: Auto-discover all available models  
✅ **Model Performance Tracking**: Monitor latency and success rates per model  
✅ **Custom OLLAMA URL**: Support for remote OLLAMA instances  

### New Test Suite
✅ **Automated Setup Validator**: `qa/test-setup.sh`  
✅ **Integration Tests**: `qa/test-integration.js`  
✅ **Feature Testing Checklist**: `qa/test-features.md`  

### Comprehensive Documentation
✅ **Deployment Guide**: `DEPLOYMENT.md`  
✅ **This Guide**: Complete testing & deployment workflow  

---

## Phase 1: Environment Setup (30 minutes)

### 1.1 Install OLLAMA

OLLAMA allows running large language models locally, completely offline.

**Linux/Mac:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**
Download from https://ollama.com/download

**Verify:**
```bash
ollama --version
```

### 1.2 Pull Models

Download models to use locally:

```bash
# Fast & lightweight (recommended for testing)
ollama pull llama3.2:1b

# Additional options
ollama pull llama3.2          # Standard
ollama pull mistral           # Alternative
ollama pull phi3              # Ultra-lightweight
ollama pull deepseek-r1       # Advanced reasoning
```

**Check installed models:**
```bash
ollama list
```

### 1.3 Start OLLAMA Service

```bash
# Terminal 1: Start OLLAMA
ollama serve
# Service starts on http://localhost:11434
```

**Verify it's running:**
```bash
curl http://localhost:11434/api/tags
# Should return JSON with available models
```

### 1.4 Validate Setup

```bash
# Terminal 2: Run the setup validator
cd /home/user/Chrome_Assist_AI
./qa/test-setup.sh
```

Expected output:
```
✓ Node.js installed: v18.x.x
✓ npm installed: 9.x.x
✓ OLLAMA installed: 0.x.x
✓ OLLAMA service is running on localhost:11434
✓ Found 1 model(s):
    - llama3.2:1b
✓ Chrome found at: /usr/bin/google-chrome
✓ Directory: extension
✓ Directory: src
...
✓ System ready for testing!
```

---

## Phase 2: Extension Loading (10 minutes)

### 2.1 Load in Chrome Developer Mode

1. Open Chrome: `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select: `/home/user/Chrome_Assist_AI/extension/`
5. Extension loads with a unique ID

**Note down the Extension ID** (looks like: `abcdefghijklmnopqrstuvwxyz123456`)

### 2.2 Configure OLLAMA Provider

1. Click the **ZANYSURF** extension icon
2. Click **⚙️ Settings**
3. Select Provider: **Ollama**
4. OLLAMA URL: `http://localhost:11434`
5. Click **Detect Models** button
6. Select model from dropdown (e.g., `llama3.2:1b`)
7. Click **Save Settings**

**Verify:** Green checkmark shows "Ollama connected ✓"

### 2.3 Test Extension API

Open Chrome DevTools console and run:

```javascript
// Get available providers
chrome.runtime.sendMessage(EXTENSION_ID, {
  action: 'GET_PROVIDER_LIST'
}, response => {
  console.log('Providers:', response.providers);
  // Output: ['ollama', 'gemini', 'openai', 'claude', 'groq', 'mistral', 'edge_builtin']
});

// Detect OLLAMA models
chrome.runtime.sendMessage(EXTENSION_ID, {
  action: 'DETECT_OLLAMA_MODELS',
  ollamaUrl: 'http://localhost:11434'
}, response => {
  console.log('Models:', response.models);
  // Output: [{ name: 'llama3.2:1b', size: '1.2 GB', modified: '...' }, ...]
});
```

---

## Phase 3: Automated Testing (15 minutes)

### 3.1 Run Integration Tests

```bash
cd /home/user/Chrome_Assist_AI
node qa/test-integration.js
```

**Tests include:**
- ✅ OLLAMA service connectivity
- ✅ Model detection and listing
- ✅ Inference on each model
- ✅ Model switching capability
- ✅ Streaming support
- ✅ Performance metrics
- ✅ Error handling

**Expected output:**
```
=== ZANYSURF Integration Test Suite ===

✓ OLLAMA service is running
✓ OLLAMA has at least one model
✓ Can run inference on first available model
✓ Can detect and list multiple models
   Found 1 model(s): llama3.2:1b
✓ Model streaming works
✓ Model response latency is acceptable
   Latency: 2345ms
✓ OLLAMA handles bad requests gracefully

=== Test Results ===

✓ All tests passed!
```

### 3.2 Run Unit Tests

```bash
npm test
```

Tests core extension functionality:
- Memory system
- Knowledge graph
- Error classification
- Risk assessment
- Agent reasoning

---

## Phase 4: Manual Feature Testing (45-60 minutes)

### 4.1 Test OLLAMA Multi-Model Support

**Scenario:** Switch between different models and verify performance

```
1. In extension settings, click "Detect Models"
2. Verify all installed models appear in dropdown
3. Select "llama3.2:1b"
4. Run goal: "Tell me the capital of France"
5. Switch to another model (if available)
6. Run same goal
7. Compare responses
```

**Expected result:**
- ✓ All models listed correctly
- ✓ Each model responds successfully
- ✓ Different wording, same accuracy
- ✓ Settings persist after reload

### 4.2 Test YouTube Integration

**Test: Song Search**

```
1. Go to https://www.youtube.com/
2. Open ZANYSURF side panel (Alt+Z)
3. Goal: "Search for 'Bohemian Rhapsody' and tell me the video duration"
4. Run agent
5. Watch agent navigate and extract data
```

**Expected result:**
- ✓ Clicks YouTube search box
- ✓ Types song name
- ✓ Finds first result
- ✓ Extracts duration (e.g., "5:55")

**Test: Video Metadata**

```
1. Go to https://www.youtube.com/watch?v=fJ9rUzIMt7o
2. Goal: "Extract upload date, view count, and uploader name"
3. Run agent
```

**Expected result:**
- ✓ Reads page DOM
- ✓ Returns all three pieces of information
- ✓ Shows reasoning chain

### 4.3 Test Price Comparison

**Test: Single Product**

```
1. Go to https://www.amazon.com/
2. Goal: "Search for 'USB-C Cable' and extract the price of the first result"
3. Run agent
```

**Expected result:**
- ✓ Searches on Amazon
- ✓ Extracts current price
- ✓ Returns formatted response

**Test: Multi-Platform Comparison**

```
1. Go to https://www.google.com/
2. Goal: "Compare price of 'AirPods Pro' on Amazon, eBay, and Walmart"
3. Run agent (2-3 minutes expected)
```

**Expected result:**
- ✓ Opens tabs for each platform
- ✓ Searches each platform
- ✓ Returns structured comparison:
   Amazon: $249
   eBay: $245
   Walmart: $250
```

### 4.4 Test Core Features

**Form Filling:**
```
1. Go to any form page
2. Goal: "Fill form with: Name: Test User, Email: test@example.com"
3. Verify fields filled correctly
```

**Navigation & Extraction:**
```
1. Go to https://example.com/
2. Goal: "Go to About page and extract company founding year"
3. Verify agent navigates and extracts
```

**Content Summarization:**
```
1. Go to any article page
2. Goal: "Summarize this article in 2-3 sentences"
3. Verify summary quality
```

---

## Phase 5: Deployment (20 minutes)

### 5.1 For Local Development

The extension is now ready for use:

1. Extension is loaded in Chrome DevTools
2. OLLAMA running locally
3. All models available for selection
4. Features fully functional

### 5.2 For Production (Chrome Web Store)

When ready to release:

```bash
# 1. Update version in manifest
nano extension/manifest.json
# Change "version": "1.1.0" to "1.1.1", etc.

# 2. Create deployment package
zip -r zanysurf-v1.1.1.zip extension/ -x "*.git/*"

# 3. Submit to Chrome Web Store
# https://chrome.developer.google.com/
# Upload zanysurf-v1.1.1.zip
```

### 5.3 For Edge Add-ons

```bash
# Similar process, submit to:
# https://partner.microsoft.com/en-us/dashboard/
```

---

## Phase 6: Validation Checklist

Before declaring ready for production, verify:

### Functionality
- [ ] OLLAMA connects and models load
- [ ] Can switch between multiple models
- [ ] YouTube search works
- [ ] Price comparison works across platforms
- [ ] Forms can be filled
- [ ] Navigation is smooth
- [ ] All error states handled gracefully

### Performance
- [ ] Model loading: < 5 seconds
- [ ] YouTube search: < 30 seconds
- [ ] Price comparison (3 sites): < 90 seconds
- [ ] Form filling: < 10 seconds
- [ ] No memory leaks after 1 hour of use

### Compatibility
- [ ] Works on Chrome 120+
- [ ] Works on Edge 120+
- [ ] Keyboard shortcuts work (Alt+Z)
- [ ] Side panel opens/closes smoothly
- [ ] Settings persist across sessions

### Security
- [ ] No hardcoded API keys
- [ ] OLLAMA requests use localhost only
- [ ] No sensitive data in logs
- [ ] All external requests have timeouts

### Documentation
- [ ] README.md up to date
- [ ] DEPLOYMENT.md complete
- [ ] TEST_AND_DEPLOY_GUIDE.md (this file) included
- [ ] qa/test-features.md provided for QA

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| OLLAMA not responding | Run `ollama serve` in terminal, check port 11434 |
| Models not appearing in dropdown | Run `ollama list`, verify models are installed |
| Extension won't load | Check manifest.json syntax, try reloading |
| Agent times out | Increase timeout in settings, check network |
| Memory errors | Clear memory in extension, restart extension |
| Model too slow | Use smaller model (llama3.2:1b), check system RAM |

---

## Architecture Overview

```
Chrome Extension (popup.js, background.js, content.js)
        ↓
    ModelGateway (multi-provider support)
        ↓
  Provider Selection
    ├── OLLAMA (localhost:11434) ← [TESTED ✓]
    ├── Gemini API (cloud)
    ├── OpenAI API (cloud)
    ├── Claude API (cloud)
    ├── Groq API (cloud)
    └── Mistral API (cloud)
        ↓
    Browser Automation
        ├── DOM manipulation (content script)
        ├── Tab navigation
        ├── Form filling
        └── Price extraction ← [TESTED ✓]
```

---

## Support & Resources

- **OLLAMA Documentation**: https://ollama.com
- **Chrome Extension Docs**: https://developer.chrome.com/docs/extensions/
- **Project GitHub**: https://github.com/zanyanbu/chrome_assist_ai
- **Report Issues**: https://github.com/zanyanbu/chrome_assist_ai/issues

---

## Summary

You now have:
1. ✅ OLLAMA installed with multiple models
2. ✅ Chrome extension loaded and configured
3. ✅ Automated test suite ready to run
4. ✅ Complete feature testing checklist
5. ✅ Comprehensive deployment guide
6. ✅ All core features validated

**The extension is ready for testing, refinement, and production deployment!**

For questions or issues, refer to:
- `DEPLOYMENT.md` for detailed setup
- `qa/test-features.md` for feature testing
- `qa/test-setup.sh` for automated validation
- `qa/test-integration.js` for OLLAMA connectivity tests

---

**Last Updated**: 2026-04-29  
**Version**: 2.4.0  
**Status**: Ready for Testing & Deployment
