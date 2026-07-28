# Changelog

All notable changes to this project will be documented in this file.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Changed
- Product name unified to **ZANYSURF Browser Agent** across the manifests, `metadata.json`, README, and all docs, matching the published Microsoft Edge Add-ons listing.
- `extension/metadata.json` no longer carries the stale "BYOM AI Browser Agent" name and description.
- Extension version aligned to `3.0.0` in `manifest.json` and `manifest.edge.json` (both were stuck at `1.1.0` while the changelog and shipped feature set were already at 3.0.0).
- README rewritten around the Edge Add-ons install link, with the feature list reconciled against the code.
- Repository URLs updated to `ZANYANBU/zanysurf-browser-agent`.

### Fixed
- CI was failing on every run: it invoked `npm ci` at a repo root that has no `package.json`, and diffed root-level source files that the directory reorganization had already removed. The workflow now runs the static validator directly and packages `extension/` as a build artifact.
- `qa/run-static-validation.mjs` read root-level `background.js` / `manifest.json` that no longer exist, and always exited `0` regardless of results. It now validates `extension/` and exits non-zero on failure, so it can actually gate CI.
- `qa/zanysurf.test.js` loaded `background.js` from the repo root instead of `extension/`.

### Removed
- README claims with no supporting implementation: Zapier / Make.com "1000+ app" integrations, PDF / DOC / XLS document chat, YouTube transcript summarization with timestamp jumping, and price-drop / back-in-stock alerting.
- Inaccurate API key warning stating keys sit in plaintext in `chrome.storage.local`. Keys are encrypted at rest with AES-GCM-256 under a PBKDF2-derived key.

---

## [3.0.0] — 2026-03-05 — "The Stability & Power Update" (FINAL)

### Added
- **Shadow DOM traversal**: agent now pierces shadow roots up to 6 levels deep, enabling full interaction with Web Components, Material UI, and custom elements.
- **React / Vue / Angular input compatibility**: uses `Object.getOwnPropertyDescriptor` native value setter to trigger framework-controlled `onChange` / `v-model` / `[(ngModel)]` bindings correctly.
- **Cookie banner auto-dismiss**: content script detects and closes GDPR / cookie consent overlays before mapping the DOM, reducing false-positive element IDs.
- **Macro Recorder**: record any sequence of browser actions into a named macro, save to `chrome.storage.local`, and replay on demand.
- **REST / external API surface**: `chrome.runtime.onMessageExternal` expanded to 16 documented endpoints — agent control, workflows, macros, memory, task engine, audit log, and API metrics.
- **Task history persistence**: full step-by-step action history is saved to `chrome.storage.local` and survives service-worker restarts.
- **Progress bar UI**: side panel now shows a live step counter and animated progress indicator during agent runs.
- **Async Task Engine**: parallel multi-goal execution with priority queuing, dependency resolution, and per-task cancellation.
- **Tab Orchestrator v2**: full tab lifecycle tracking, dependency graph, health monitoring, and cross-tab memory sharing.
- **Memory System v2**: short-term + long-term memory with cosine-similarity retrieval, decay scoring, and session persistence.
- **MemorySystem `SEARCH_MEMORY` action**: retrieve semantically relevant past actions by goal query.
- **Price comparison workflow**: auto-opens marketplace tabs in parallel, extracts prices per tab, synthesises and exports CSV.
- **Scheduler (Chrome Alarms)**: create recurring goals with `daily@HH:MM`, `weekly@`, or `interval@Nm` schedules.
- **Smart Bookmarks**: save, tag, and semantically search bookmarked URLs.
- **Credential Vault**: AES-GCM encrypted API key storage with passphrase lock.
- **Safe Mode approval gates**: high-risk actions (form submit, navigation away, file upload) require explicit user confirmation.
- **Edge Built-in AI provider**: zero-configuration model via `window.ai` when running in Microsoft Edge.

### Changed
- `waitForDomStable` replaced interval polling with `MutationObserver` — reacts to actual DOM mutations, observes shadow roots, and checks the React fiber idle flag before resolving.
- `EXECUTE` handler: exponential-backoff retry (200 ms / 400 ms) for transient element-not-found / stale-element failures.
- Content script `onMessage` wrapped in top-level `try/catch` so one bad handler branch never silently crashes the rest.
- DOM budget raised from 100 to 150 elements; below-fold elements included with `[below-fold]` label.
- Prompt context tightened: goal, recent steps, and page content each have explicit character budgets to reduce token cost.
- Removed duplicate `sleep()` declaration from content script.

### Fixed
- React-controlled inputs no longer silently accept typed values without triggering re-render.
- Agent no longer gets stuck on infinite-loop action fingerprints — stuck detection aborts after 3 identical consecutive steps.
- Cross-origin iframe traversal no longer throws uncaught `SecurityError`.
- Vision-mode fallback click now correctly targets element by screen coordinates when DOM ID is unavailable.

---

## [2.0.0] — 2026-01-28 — "The Intelligence Update"

### Added
- **Gemini API support**: added `gemini-1.5-flash` and `gemini-1.5-pro` as provider options alongside Ollama; API key stored encrypted in `chrome.storage.local`.
- **Site-specific hints**: per-domain hint files give the agent contextual guidance (e.g. "use the search box at `[7]` on Google").
- **Direct search URL shortcuts**: agent resolves `search:<query>` goals to provider-specific URLs (Google, YouTube, Amazon, GitHub) without a DOM read.
- **Screenshot capture after navigate**: after every `navigate` action the agent captures a viewport screenshot for vision-mode fallback.
- **Step history context**: last 5 actions are appended to the prompt so the model can reason about what has already been attempted.
- **LLM Gateway abstraction**: single `callLLM(prompt, options)` function routes to any configured provider, making new provider additions a one-file change.
- **Multi-step plan generation**: agent now outputs a numbered plan before executing, reducing mid-task direction drift.
- **`fill_form` action**: fills an entire form by field-name mapping in one step instead of repeated `type` actions.
- **`extract_data` action**: returns structured JSON from the current page matching a user-supplied schema.
- **`export_csv` action**: writes extracted table data to a `.csv` file via the Chrome Downloads API.

### Changed
- Model response parsing hardened: JSON extraction tolerates markdown code fences, stray trailing commas, and incomplete responses.
- Popup redesigned with a collapsible settings panel, provider selector, and model dropdown populated from the Ollama `/api/tags` endpoint.
- DOM serialisation now includes `[below-fold]` labels so the model deprioritises off-screen elements.
- Navigate action waits for `chrome.tabs.onUpdated` `"complete"` status before continuing (was a fixed 1 s sleep).

### Fixed
- `type` action on `<select>` elements now sets `.value` and fires `change` event instead of attempting `KeyboardEvent` injection.
- Agent no longer loops indefinitely when the target element disappears after a click (added post-click DOM change check).
- Popup no longer flashes unstyled on first open.

---

## [1.0.0] — 2025-12-10 — "Initial Release"

### Added
- **Ollama provider**: connects to a local Ollama instance (`http://localhost:11434`) and lists available models via `/api/tags`.
- **DOM mapping** (`buildDomMap`): annotates interactive elements (`a`, `button`, `input`, `textarea`, `select`, ARIA roles) with sequential numeric IDs visible in the agent prompt.
- **Core action set**: `click`, `type`, `navigate`, `scroll`, `key`, `hover`, `select`, `wait`, `done`.
- **`GET_DOM` message**: content script returns a compact text representation of the current page for the agent prompt.
- **`READ_PAGE` message**: returns full `innerText` (up to 12 000 chars) plus page title and URL.
- **Service worker agent loop**: background script receives a goal, reads the DOM, calls the LLM, executes the decided action, and repeats until `done` or max steps reached.
- **Side panel UI**: persistent panel using `chrome.sidePanel` API; text input for goal, start/stop button, scrollable step log.
- **Badge overlay**: optional numbered badges rendered over interactive elements for visual debugging.
- **`waitForDomStable`**: waits for the DOM to settle before mapping elements.
- **`executeAction` dispatcher**: routes action strings from the model to their implementations.
- Chrome Manifest V3 compliant; Edge compatible via `manifest.edge.json`.

### Notes
- Supports Chrome 114+ and Edge 114+.
- Ollama must be running locally; no cloud API keys required.

---

[Unreleased]: https://github.com/ZANYANBU/zanysurf-browser-agent/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/ZANYANBU/zanysurf-browser-agent/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/ZANYANBU/zanysurf-browser-agent/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/ZANYANBU/zanysurf-browser-agent/releases/tag/v1.0.0
