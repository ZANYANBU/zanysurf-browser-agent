# ZANYSURF: Screenshot Creation Guide

This guide explains what each screenshot should show and how to create them.

---

## Screenshot 1: overview.png (Main Extension UI)

**What to show:**
- Extension side panel open
- Input field with goal: "Compare AirPods Pro prices on Amazon and eBay"
- Run button visible and ready to click
- Settings gear icon in corner
- Clean, minimal UI
- Light theme or dark theme

**Technical details:**
- Size: 600x800px (or 3:4 aspect ratio)
- Resolution: 2x for retina (1200x1600px)
- Color: Bright, modern colors
- Focus: The input field and Run button

**How to create:**
1. Load extension in Chrome
2. Open any website (e.g., google.com)
3. Click ZANYSURF icon to open side panel
4. Type a goal in the input field
5. Take full screenshot of the side panel
6. Crop to show just the panel (not the full Chrome window)
7. Save as `docs/screenshots/overview.png`

**Example content to show:**
```
┌─────────────────────────────────────┐
│  ZANYSURF - AI Browser Agent        │
│  [⚙️ Settings]  [?]                 │
├─────────────────────────────────────┤
│                                     │
│  What would you like me to do?      │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ Compare AirPods Pro prices... │  │
│  │ on Amazon and eBay            │  │
│  └───────────────────────────────┘  │
│                                     │
│  [Run Agent] [Clear]                │
│                                     │
├─────────────────────────────────────┤
│  Provider: Ollama (Connected ✓)    │
│  Model: llama3.2:1b                 │
│  Safety: Approval mode              │
│                                     │
│  [Recent goals]                     │
│  • Search YouTube for...            │
│  • Extract prices from...           │
│  • Find job listings...             │
│                                     │
└─────────────────────────────────────┘
```

---

## Screenshot 2: agent-run.png (Agent Execution)

**What to show:**
- Agent is actively running/executing
- Step-by-step breakdown of actions:
  1. ✓ Navigated to Amazon
  2. ✓ Searched for product
  3. → Currently clicking search button
  4. ⧖ Waiting for results to load
  5. [ ] Extracting price
- Progress bar or status indicator
- Real-time thinking/reasoning shown
- Timestamp and elapsed time
- Stop button available

**Technical details:**
- Size: 600x900px (tall to show multiple steps)
- Resolution: 2x for retina
- Color: Shows progress (green checkmarks, blue in-progress, gray pending)
- Animation: Show status changing in real-time

**How to create:**
1. Set up extension with OLLAMA
2. Go to a website
3. Enter a goal
4. Click "Run Agent"
5. Immediately take screenshot while it's executing
6. May need multiple screenshots to show different stages
7. Take another screenshot after a few seconds (different step)
8. Optionally combine into GIF showing progression
9. Save as `docs/screenshots/agent-run.png`

**Example content to show:**
```
┌──────────────────────────────────────────┐
│ AGENT RUNNING: Compare AirPods prices   │
├──────────────────────────────────────────┤
│                                          │
│ ✓ Step 1: Navigated to Amazon (1.2s)    │
│ ✓ Step 2: Clicked search box (0.8s)     │
│ ✓ Step 3: Typed "AirPods Pro" (0.3s)    │
│ → Step 4: Clicking search button... (0.5s)
│ ⧖ Step 5: Waiting for page load...      │
│                                          │
│ Progress: ████░░░░░░░░░░░░░░ 25%        │
│ Elapsed: 3.8s | Est. remaining: 12s     │
│                                          │
│ Current DOM elements found: 247          │
│ Interaction ready: Yes ✓                 │
│                                          │
│ [Stop Agent] [View Details]              │
│                                          │
└──────────────────────────────────────────┘
```

---

## Screenshot 3: price-compare.png (Results)

**What to show:**
- Price comparison results displayed beautifully
- Table or card layout with:
  - Platform name
  - Price
  - Availability status
  - Link/button to view
- Best deal highlighted (green background)
- Clear pricing from each platform
- Timestamp and freshness indicator
- Export to CSV button
- Share/Copy button

**Technical details:**
- Size: 600x500px
- Resolution: 2x for retina
- Color: Professional, use green for best deal
- Data: Real results (don't fake prices)

**How to create:**
1. Run an actual price comparison goal
2. Wait for it to complete
3. Screenshot the results panel
4. Results should show actual prices from real websites
5. May take 90 seconds for full comparison
6. Make sure multiple prices are clearly visible
7. Save as `docs/screenshots/price-compare.png`

**Example content to show:**
```
┌──────────────────────────────────────────┐
│ Price Comparison: AirPods Pro             │
│ Updated: 2026-04-29 14:32 UTC            │
├──────────────────────────────────────────┤
│                                          │
│ ╔══════════════════════════════════════╗ │
│ ║ eBay               $245.00     ✓     ║ │  ← Best Deal
│ ║ Refurbished, 4★ rating, Ships in 2d ║ │
│ ╚══════════════════════════════════════╝ │
│                                          │
│ Amazon             $249.00     ✓        │
│ Brand New, Prime eligible, Ships today  │
│                                          │
│ Best Buy           $249.99     ✓        │
│ Brand New, Pick up available            │
│                                          │
│ Walmart            $248.00     ✓        │
│ Brand New, Free shipping                │
│                                          │
│ You save: $4.00 by choosing eBay       │
│                                          │
│ [Export CSV] [Share] [Set Price Alert]  │
│                                          │
└──────────────────────────────────────────┘
```

---

## Screenshot 4: settings.png (Configuration)

**What to show:**
- Settings panel open
- Provider selection dropdown (Ollama, OpenAI, Claude, etc.)
- Selected provider details
- Model selection dropdown
- "Detect Models" button
- OLLAMA URL configuration
- Safety mode toggle
- API key input (for cloud providers, can be masked)
- Connection status (green checkmark for connected)
- Save button

**Technical details:**
- Size: 600x700px
- Resolution: 2x for retina
- Color: Professional settings UI
- Show both OLLAMA selected and cloud provider examples

**How to create:**
1. Click Settings gear icon in ZANYSURF
2. Settings panel opens
3. Take full screenshot of settings panel
4. Show provider dropdown expanded
5. Optionally show different provider selected
6. Make sure "Connected ✓" shows for active provider
7. Save as `docs/screenshots/settings.png`

**Example content to show:**
```
┌──────────────────────────────────────────┐
│ ZANYSURF Settings                        │
├──────────────────────────────────────────┤
│                                          │
│ ⚙️ LLM Provider Configuration             │
│                                          │
│ Select Provider:                         │
│ ▼ Ollama (Local)                         │  ← Connected ✓
│                                          │
│ OLLAMA URL:                              │
│ [http://localhost:11434] ✓               │
│                                          │
│ Select Model:                            │
│ ▼ llama3.2:1b (1.2 GB)                   │
│   • llama3.2                             │
│   • mistral                              │
│   • phi3                                 │
│                                          │
│ [Detect Models] [Test Connection]        │
│                                          │
│ ────────────────────────────────────────│
│ 🛡️  Safety & Privacy                      │
│                                          │
│ ☑ Approval Mode                          │
│   (Review actions before execution)      │
│                                          │
│ ☑ Log all actions to audit trail         │
│                                          │
│ ────────────────────────────────────────│
│ 💾 Storage: 2.4 MB / 50 MB               │
│                                          │
│ [Clear Cache] [Export Logs] [Advanced]   │
│                                          │
│ [Save Settings]                          │
│                                          │
└──────────────────────────────────────────┘
```

---

## Creating Screenshots: Step-by-Step

### For Overview (overview.png)

1. Open Chrome
2. Load ZANYSURF extension
3. Navigate to any website
4. Click ZANYSURF icon
5. Side panel opens on right
6. Enter a sample goal
7. Don't click "Run Agent" yet
8. Right-click on side panel → Inspect
9. DevTools opens at bottom
10. Find the panel HTML element
11. Screenshot just the side panel area
12. Crop to 600x800px
13. Resize to 1200x1600px (2x resolution)
14. Save as PNG with good compression
15. Save as `docs/screenshots/overview.png`

### For Agent Run (agent-run.png)

1. Open a website (e.g., https://www.amazon.com/)
2. Open ZANYSURF
3. Enter: `"Search for USB-C Cable and show first result"`
4. Click "Run Agent"
5. **Immediately** take screenshot (within 1-2 seconds)
6. This captures agent starting execution
7. **Wait 3-4 seconds**, take another screenshot
8. This shows different steps completed
9. Keep taking screenshots as it progresses
10. Use one that shows good progression
11. Crop side panel to 600x900px
12. Resize to 1200x1800px (2x)
13. Save as `docs/screenshots/agent-run.png`

### For Price Compare (price-compare.png)

1. Open a shopping website or Google
2. Open ZANYSURF
3. Enter: `"Compare AirPods Pro price on Amazon, eBay, and Best Buy"`
4. Click "Run Agent"
5. **Wait 90-120 seconds** for results
6. Screenshot the results panel when complete
7. Crop to 600x500px
8. Resize to 1200x1000px (2x)
9. Save as `docs/screenshots/price-compare.png`

### For Settings (settings.png)

1. Open ZANYSURF
2. Click ⚙️ Settings icon
3. Settings panel opens
4. Screenshot shows entire settings panel
5. Can show OLLAMA provider selected
6. Crop to 600x700px
7. Resize to 1200x1400px (2x)
8. Save as `docs/screenshots/settings.png`

---

## Screenshot Best Practices

### DO ✅
- ✅ Use real data (actual prices, videos, articles)
- ✅ Show full workflow when possible
- ✅ Include timestamps and status indicators
- ✅ Use clear, readable fonts
- ✅ Test on multiple screen sizes
- ✅ Use consistent color scheme
- ✅ Add helpful annotations if needed
- ✅ Include "Connected ✓" indicators
- ✅ Show both success states
- ✅ Use 2x resolution for clarity

### DON'T ❌
- ❌ Don't use fake/placeholder data
- ❌ Don't hide error handling
- ❌ Don't use lorem ipsum text
- ❌ Don't screenshot at 1x resolution
- ❌ Don't include personal info (change API keys)
- ❌ Don't use extremely outdated models
- ❌ Don't hide the UI chrome
- ❌ Don't use low-quality screenshots
- ❌ Don't include irrelevant website chrome
- ❌ Don't use watermarks

---

## File Specifications

All screenshots should be:
- **Format:** PNG (lossless)
- **Resolution:** 1200x1600px (overview), 1200x1800px (agent-run), 1200x1000px (price-compare), 1200x1400px (settings)
- **Color space:** sRGB
- **Compression:** Optimized (8-9 compression level)
- **Filename:** All lowercase, hyphens, .png extension

### Optimization

After creating, optimize with:
```bash
# Linux/Mac
pngquant --quality=70-85 file.png
optipng -o2 file.png

# Or use online: https://tinypng.com/
```

---

## Alternative: Use Design Tools

If you prefer to create mockups instead of real screenshots:

1. **Figma** - Free, browser-based, professional
2. **Adobe XD** - More powerful design tool
3. **Sketch** - Mac only, professional
4. **InVision** - Collaboration + design

Create pixel-perfect mockups showing:
- Real data
- Proper UI
- Good typography
- Professional colors

---

## Timeline

- **Week 1:** Create overview.png and settings.png
- **Week 2:** Create agent-run.png (may need to run several times)
- **Week 3:** Create price-compare.png (full execution)
- **Week 4:** Optimize all images, add to README

---

## Verification Checklist

After creating each screenshot:
- [ ] File format is PNG
- [ ] Resolution is correct (2x)
- [ ] File size is reasonable (<500KB)
- [ ] Image is clear and readable
- [ ] Shows complete information
- [ ] Naming follows convention
- [ ] Placed in correct folder
- [ ] Referenced in README.md

---

## Questions?

If you're unsure about any screenshot:
1. Look at the README.md references
2. Check the example ASCII art above
3. Create a draft and test in README
4. Ask for feedback in discussions
5. Share screenshots for community input

---

**Ready to create amazing screenshots?** 🎬

Let's make ZANYSURF visually stunning! 📸

