# ZANYSURF Deployment & Testing Guide

This guide covers setting up and testing the ZANYSURF Chrome extension with full feature validation.

---

## Part 1: Environment Setup

### 1.1 Install OLLAMA (Local LLM Runtime)

OLLAMA enables running multiple LLMs locally without cloud API costs.

**Linux/Mac:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**
Download from https://ollama.com/download

**Verify installation:**
```bash
ollama --version
```

### 1.2 Pull Multiple Models

The extension supports any OLLAMA-compatible model. Recommended options:

```bash
# Fast, lightweight (recommended for testing)
ollama pull llama3.2:1b

# Standard performance/quality balance
ollama pull llama3.2
ollama pull mistral

# Larger models (requires more VRAM)
ollama pull llama3
ollama pull deepseek-r1

# Code-specific
ollama pull codellama

# Quantized versions for lower VRAM
ollama pull qwen2.5:3b
```

**Check available models:**
```bash
ollama list
```

### 1.3 Start OLLAMA Service

```bash
# Start OLLAMA in the background
ollama serve

# The service will listen on http://localhost:11434
```

Verify OLLAMA is running:
```bash
curl http://localhost:11434/api/tags | jq '.models[].name'
```

---

## Part 2: Chrome Extension Setup

### 2.1 Load Extension in Developer Mode

1. Open Chrome and go to: `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Navigate to `/home/user/Chrome_Assist_AI/extension/` directory
5. Click **Select Folder**

**Extension should appear with ID visible** (you'll need this for testing).

### 2.2 Configure OLLAMA Provider in Extension

1. Click the **ZANYSURF** extension icon
2. Click **Settings** (⚙️ icon)
3. Select provider: **Ollama**
4. Set OLLAMA URL: `http://localhost:11434`
5. Click **Detect Models** button
6. Select a model (e.g., `llama3.2:1b`)
7. Click **Save Settings**

Expected result: Green checkmark shows "Ollama connected ✓"

---

## Part 3: Feature Testing

### 3.1 Test OLLAMA Multiple Model Support

**Goal:** Verify the extension can switch between multiple local models.

1. In extension settings, click **Detect Models** again
2. Verify all pulled models appear in the dropdown list
3. Select each model and test a simple prompt:
   ```
   Goal: "Tell me the capital of France in one sentence"
   ```
4. Verify each model responds correctly

**Expected output:**
- ✅ Model detection lists all available models
- ✅ Can switch between models seamlessly
- ✅ Each model responds to prompts

### 3.2 Test YouTube Song Search & Analysis

**Goal:** Verify the extension can search YouTube and analyze content.

**Test Case 1: Basic YouTube Search**
1. Go to: https://www.youtube.com/
2. Open the extension side panel (Alt+Z or click icon)
3. Enter goal: `"Search for 'Bohemian Rhapsody' by Queen and tell me the video duration"`
4. Click **Run Agent**
5. Watch the agent navigate and extract data

**Expected output:**
- ✅ Extension clicks YouTube search box
- ✅ Types song name
- ✅ Extracts video duration from first result
- ✅ Reports back with information

**Test Case 2: Song Comparison Across Platforms**
1. Go to: https://www.google.com/
2. Enter goal: `"Search for prices of 'Bohemian Rhapsody' album across Spotify, Apple Music, and Amazon Music"`
3. Click **Run Agent**

**Expected output:**
- ✅ Opens multiple tabs for each service
- ✅ Extracts availability/price info
- ✅ Returns comparison in readable format

### 3.3 Test Price Comparison Feature

**Goal:** Verify the extension can compare prices across e-commerce platforms.

**Test Case 1: Basic Product Price Check**
1. Go to: https://www.google.com/
2. Enter goal: `"Compare prices for 'USB-C cable' on Amazon, eBay, and Best Buy"`
3. Click **Run Agent**

**Expected output:**
- ✅ Opens marketplace tabs
- ✅ Extracts prices per marketplace
- ✅ Returns structured price comparison

**Test Case 2: Price Drop Monitoring**
1. Enter goal: `"Check the current price of 'PlayStation 5' on Amazon and Best Buy, then set a price alert if under $400"`
2. Watch agent navigate and execute

**Expected output:**
- ✅ Visits both marketplaces
- ✅ Extracts current prices
- ✅ Reports findings

### 3.4 Test Core Agent Functionality

**Test Case 1: Form Filling**
1. Go to: https://example.com/ (or any form-heavy site)
2. Enter goal: `"Fill out the contact form with: Name: Test User, Email: test@example.com"`
3. Run agent

**Expected output:**
- ✅ Locates form fields
- ✅ Fills in values correctly
- ✅ Handles validation (if present)

**Test Case 2: Navigation & Content Extraction**
1. Go to: https://example.com/
2. Enter goal: `"Navigate to the About page and extract the company founding year"`
3. Run agent

**Expected output:**
- ✅ Navigates to About page
- ✅ Extracts and reports the year
- ✅ Shows reasoning chain

### 3.5 Test Multi-Provider Switching

**Test OLLAMA → Cloud API Switch:**
1. In settings, change provider to **Gemini API** (add API key if available)
2. Run a test goal
3. Switch back to **Ollama**
4. Run same goal

**Expected output:**
- ✅ Provider switches without errors
- ✅ Both providers return reasonable results
- ✅ Settings persist across reloads

---

## Part 4: Automated Testing

### 4.1 Run Unit Tests

```bash
cd /home/user/Chrome_Assist_AI
npm test
```

**Expected output:** All core tests pass (cosine similarity, memory retrieval, error classification, risk assessment)

### 4.2 Run Integration Tests

```bash
# Test OLLAMA connection
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.2:1b",
    "prompt": "What is 2+2?",
    "stream": false
  }'
```

Expected: JSON response with "response" field containing the answer

### 4.3 Extension Connection Test

Open developer console and run:
```javascript
// Test connection to ZANYSURF
const EXTENSION_ID = 'YOUR_EXTENSION_ID_HERE';

chrome.runtime.sendMessage(EXTENSION_ID, {
  action: 'GET_PROVIDER_LIST'
}, response => {
  console.log('Available providers:', response.providers);
});

// Test detect OLLAMA models
chrome.runtime.sendMessage(EXTENSION_ID, {
  action: 'DETECT_OLLAMA_MODELS',
  ollamaUrl: 'http://localhost:11434'
}, response => {
  console.log('Detected models:', response.models);
});
```

---

## Part 5: Performance & Stability Checklist

- [ ] Extension loads without errors
- [ ] OLLAMA connection is stable (green indicator)
- [ ] Model switching completes within 2 seconds
- [ ] Agent can handle 10+ consecutive tasks
- [ ] Memory system works (stores recent actions)
- [ ] Audit log records all operations
- [ ] CSV export works for extracted data
- [ ] Side panel opens/closes smoothly
- [ ] No memory leaks after 1-hour continuous use

---

## Part 6: Deployment

### 6.1 For Development

Simply load the `extension/` folder via `chrome://extensions` in developer mode.

### 6.2 For Production

1. Bump version in `extension/manifest.json`
2. Create a ZIP of the `extension/` folder
3. Submit to [Chrome Web Store](https://chrome.developer.google.com/)
4. Or submit to [Edge Add-ons](https://microsoftedge.microsoft.com/addons)

### 6.3 For CI/CD Pipeline

Use the REST API to automate testing:
```bash
# Example: Run a test goal via the extension API
curl -X POST http://localhost:7777/api/agent/run \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Search Google for Chrome extension best practices",
    "timeout": 30000
  }'
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| OLLAMA not responding | Check `ollama serve` is running, test with `curl http://localhost:11434/api/tags` |
| Models not detected | Ensure `ollama list` shows models, check firewall isn't blocking localhost:11434 |
| Extension won't load | Check manifest.json syntax, verify extension folder path is correct |
| Agent times out | Increase timeout in settings, check internet connection for cloud APIs |
| Memory errors | Clear memory via `GET_MEMORY` → select items → delete, or restart extension |

---

## Next Steps

1. **Complete Setup**: Follow sections 1-2
2. **Run Tests**: Execute sections 3-4
3. **Review Logs**: Check audit log for any failures
4. **Performance**: Monitor resource usage for 1+ hour
5. **Deploy**: Follow section 6 when ready for production

