# ZANYSURF Feature Testing Checklist

## Pre-Test Setup

- [ ] OLLAMA installed and running (`ollama serve`)
- [ ] At least one model pulled (`ollama pull llama3.2:1b`)
- [ ] Chrome extension loaded in developer mode
- [ ] Extension configured with OLLAMA provider
- [ ] OLLAMA URL: `http://localhost:11434`

---

## Feature 1: OLLAMA Multi-Model Support

### Test 1.1: Model Detection
**Scenario:** User clicks "Detect Models" in settings
**Steps:**
1. Open extension settings
2. Select "Ollama" provider
3. Click "Detect Models" button
4. Wait for detection to complete

**Expected Result:**
- [ ] All locally installed models are listed
- [ ] Model names match `ollama list` output
- [ ] Display shows model size and last modified date
- [ ] No timeout or errors

**Test with multiple models:**
```bash
ollama pull llama3.2:1b
ollama pull mistral
ollama pull phi3
ollama list  # Verify all appear in extension
```

### Test 1.2: Model Switching
**Scenario:** User switches between different models
**Steps:**
1. In settings, select "llama3.2:1b"
2. Run a goal: "What is 2+2?"
3. Check response time and answer
4. Switch to "mistral"
5. Run same goal
6. Compare responses

**Expected Result:**
- [ ] Each model responds with correct answer
- [ ] Different response wording per model
- [ ] No errors during switching
- [ ] Settings persist after reload

### Test 1.3: Model Performance Tracking
**Scenario:** Extension tracks model performance metrics
**Steps:**
1. Run 5 different goals with the same model
2. Request API endpoint: `GET_MODEL_PERFORMANCE`
3. Check metrics for that model

**Expected Result:**
- [ ] Call count increments correctly
- [ ] Average latency is tracked
- [ ] Failure count is accurate

---

## Feature 2: YouTube Integration

### Test 2.1: Basic YouTube Search
**Scenario:** Search for a song on YouTube
**Steps:**
1. Navigate to https://www.youtube.com/
2. Open ZANYSURF side panel
3. Enter goal: `"Search for 'Bohemian Rhapsody by Queen' and extract the video duration from the first result"`
4. Click "Run Agent"
5. Watch execution (may take 30-60 seconds)
6. Check final result

**Expected Result:**
- [ ] Agent successfully finds and clicks YouTube search box
- [ ] Types song name correctly
- [ ] Extracts video duration (e.g., "5:55")
- [ ] Returns result in readable format

**Video to Test:**
- Bohemian Rhapsody - Queen (Famous music video)
- Expected duration: ~5 minutes

### Test 2.2: Video Metadata Extraction
**Scenario:** Extract detailed information from a video
**Steps:**
1. Go to https://www.youtube.com/watch?v=fJ9rUzIMt7o (Bohemian Rhapsody)
2. Enter goal: `"Extract the upload date, view count, and main topic of this video"`
3. Run agent

**Expected Result:**
- [ ] Agent reads page metadata
- [ ] Returns upload date
- [ ] Returns view count
- [ ] Identifies it's a music video

### Test 2.3: YouTube Playlist Analysis
**Scenario:** Agent can navigate YouTube playlists
**Steps:**
1. Go to https://www.youtube.com/
2. Enter goal: `"Search for 'Best 80s Rock Playlist' and tell me how many videos are in the first playlist result"`
3. Run agent

**Expected Result:**
- [ ] Agent finds search results
- [ ] Navigates to playlist page
- [ ] Extracts playlist size

---

## Feature 3: Price Comparison

### Test 3.1: Single Product Price Check
**Scenario:** Check price on one platform
**Steps:**
1. Go to https://www.amazon.com/
2. Enter goal: `"Search for 'USB-C cable' and extract the price of the first result"`
3. Run agent

**Expected Result:**
- [ ] Agent navigates to Amazon
- [ ] Searches for product
- [ ] Extracts current price
- [ ] Returns price in formatted response

### Test 3.2: Multi-Platform Price Comparison
**Scenario:** Compare prices across multiple platforms
**Steps:**
1. Start on https://www.google.com/
2. Enter goal:
   ```
   "Compare the price of 'Apple AirPods Pro' on:
    1. Amazon
    2. eBay
    3. Walmart
    Return a formatted comparison with prices"
   ```
3. Run agent (this may take 2-3 minutes)

**Expected Result:**
- [ ] Agent opens new tabs for each platform
- [ ] Searches for product on each
- [ ] Extracts prices accurately
- [ ] Returns structured comparison
- [ ] Example output:
   ```
   Amazon: $249
   eBay: $245
   Walmart: $250
   ```

### Test 3.3: Price Trend Analysis
**Scenario:** Check price movement over time
**Steps:**
1. Go to https://www.amazon.com/
2. Enter goal: `"Check if the 'PlayStation 5' is currently in stock and its price"`
3. Run agent

**Expected Result:**
- [ ] Locates product
- [ ] Shows availability status
- [ ] Shows current price
- [ ] May show price history (if available on page)

### Test 3.4: CSV Export
**Scenario:** Export price comparison results
**Steps:**
1. After running a price comparison goal
2. Open extension's data export panel
3. Click "Export as CSV"

**Expected Result:**
- [ ] CSV file downloads automatically
- [ ] Contains all comparison data
- [ ] Properly formatted (product name, price, platform, date)

---

## Feature 4: Agent Core Functionality

### Test 4.1: Form Filling
**Scenario:** Agent can fill out and submit forms
**Test Page:** https://example.com/ (or https://testproject.io/web/)
**Steps:**
1. Navigate to a form page
2. Enter goal: `"Fill out the form with Name: John Doe, Email: john@example.com, Message: Testing the agent"`
3. Run agent

**Expected Result:**
- [ ] Agent locates form fields
- [ ] Fills fields with correct values
- [ ] No validation errors
- [ ] Readiness for form submission

### Test 4.2: Navigation & Text Extraction
**Scenario:** Agent can navigate multi-page sites and extract info
**Steps:**
1. Go to https://example.com/
2. Enter goal: `"Navigate to the About Us page and extract the company name and founding year"`
3. Run agent

**Expected Result:**
- [ ] Agent finds "About" link
- [ ] Navigates successfully
- [ ] Extracts requested information
- [ ] Returns in structured format

### Test 4.3: Click & Scroll Actions
**Scenario:** Agent can perform click and scroll actions
**Steps:**
1. Go to https://news.ycombinator.com/
2. Enter goal: `"Scroll down 3 times and click on the second top story, then extract its title"`
3. Run agent

**Expected Result:**
- [ ] Agent scrolls the page
- [ ] Clicks specific story
- [ ] Extracts and returns title
- [ ] Shows clicking behavior in history

---

## Feature 5: Cross-Provider Testing

### Test 5.1: Provider Switching (if API keys available)
**Scenario:** Switch between different LLM providers
**Steps:**
1. In settings, select "Gemini API" (or another provider)
2. Add API key
3. Run a test goal
4. Switch back to "Ollama"
5. Run the same goal

**Expected Result:**
- [ ] Both providers work correctly
- [ ] Switch completes without errors
- [ ] Results differ slightly but are both valid
- [ ] Settings persist

---

## Feature 6: Error Handling & Edge Cases

### Test 6.1: Network Timeout
**Scenario:** Extension handles slow/missing responses
**Steps:**
1. Temporarily disable OLLAMA
2. Try to run an agent goal
3. Check timeout handling

**Expected Result:**
- [ ] Clear error message appears
- [ ] User can retry
- [ ] No hanging processes

### Test 6.2: Invalid Model
**Scenario:** Extension handles unavailable models
**Steps:**
1. Manually set model to "nonexistent-model" in storage
2. Try to run agent goal

**Expected Result:**
- [ ] Error is caught and reported
- [ ] Option to select another model appears

### Test 6.3: Concurrent Tasks
**Scenario:** Running multiple goals simultaneously
**Steps:**
1. Queue 3 different goals rapidly
2. Run agent on all

**Expected Result:**
- [ ] Tasks are queued properly
- [ ] No race conditions
- [ ] All complete successfully

---

## Test Execution & Reporting

### Quick Test (5-10 minutes)
```bash
# Test only OLLAMA and basic agent
1. Run Test 1.1 (Model Detection)
2. Run Test 2.1 (YouTube Search)
3. Run Test 3.1 (Single Product Price)
4. Run Test 4.1 (Form Filling)
```

### Full Test Suite (1-2 hours)
Run all tests in sequence, logging results to file.

### Test Report Template
```
Date: YYYY-MM-DD
Environment: Chrome [version], OLLAMA [version]
Models Tested: llama3.2:1b, mistral, phi3
Results:
  - Passed: XX
  - Failed: X
  - Skipped: X
Issues Found:
  1. ...
  2. ...
Recommendations:
  1. ...
  2. ...
```

---

## Automated Testing

Run automated OLLAMA tests:
```bash
cd /home/user/Chrome_Assist_AI
node qa/test-integration.js
```

This validates:
- OLLAMA connection
- Model detection
- Inference capability
- Performance metrics
- Error handling

---

## Performance Baselines

| Operation | Target | Accept |
|-----------|--------|--------|
| Model detection | <5s | <10s |
| Simple inference | <3s | <10s |
| YouTube search | <30s | <60s |
| Price comparison (3 sites) | <90s | <180s |
| Form filling | <10s | <20s |
| Agent planning | <5s | <15s |

---

## Accessibility & Compatibility

- [ ] Extension works on Chrome 120+
- [ ] Extension works on Edge 120+
- [ ] Side panel opens/closes smoothly
- [ ] Keyboard shortcuts work (Alt+Z)
- [ ] Settings persist across sessions
- [ ] No console errors

---

## Sign-off Checklist

- [ ] All core features tested
- [ ] No critical bugs found
- [ ] Performance acceptable
- [ ] User documentation complete
- [ ] Ready for production deployment

