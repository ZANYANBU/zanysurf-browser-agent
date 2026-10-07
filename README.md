<div align="center">

<img src="extension/icons/icon128.png" width="96" alt="ZANYSURF Browser Agent" />

# ZANYSURF Browser Agent

**Give it a goal. It does the work.**

An autonomous AI agent that lives in your browser — it plans, navigates, clicks, fills forms, and reports back. Runs fully local with Ollama, or on your own cloud API keys. Your data never touches our servers, because there are no servers.

<a href="https://microsoftedge.microsoft.com/addons/detail/pmadlohecccigmfcmickngnlikhmnjpa">
<img src="https://img.shields.io/badge/Install%20on%20Microsoft%20Edge-0078D4?style=for-the-badge&logo=microsoftedge&logoColor=white" alt="Install on Microsoft Edge" />
</a>

[![Edge Add-ons](https://img.shields.io/badge/Edge%20Add--ons-v1.0.1-0078D4)](https://microsoftedge.microsoft.com/addons/detail/pmadlohecccigmfcmickngnlikhmnjpa)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-2ea44f)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Source](https://img.shields.io/badge/Source-v3.0.0-6f42c1)](CHANGELOG.md)
[![Runs Offline](https://img.shields.io/badge/Runs%20Offline-Ollama-brightgreen)](https://ollama.com)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

</div>

---

## Install

### Option A — Microsoft Edge Add-ons (one click)

**[→ Install ZANYSURF Browser Agent from Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/pmadlohecccigmfcmickngnlikhmnjpa)**

```
https://microsoftedge.microsoft.com/addons/detail/pmadlohecccigmfcmickngnlikhmnjpa
```

The reviewed, published build. Auto-updates. Currently **v1.0.1**, supporting **Ollama** and **Gemini**.

### Option B — Load from source (Chrome or Edge)

The source in this repo is **ahead of the store build** — see [Which build am I running?](#which-build-am-i-running) below.

1. Download this repo (**Code → Download ZIP**, then unzip) or clone it:
   ```bash
   git clone https://github.com/ZANYANBU/zanysurf-browser-agent
   ```
2. Open `edge://extensions` in Edge, or `chrome://extensions` in Chrome
3. Toggle **Developer mode** on (top-right in Chrome, left sidebar in Edge)
4. Click **Load unpacked**
5. Select the **`extension/`** folder

> **Select `extension/`, not the repo root.** The root has no manifest and the load will fail.
> `dev-playground/` is a Vite sandbox for UI prototyping — it is not the extension.

### Which build am I running?

| | Edge Add-ons | This repo |
|---|---|---|
| Version | 1.0.1 | 3.0.0 |
| Providers | Ollama, Gemini | Ollama, Gemini, OpenAI, Claude, Groq, Mistral, Edge Built-in |
| Macro recorder | — | Yes |
| Scheduler & workflows | — | Yes |
| Messaging API | — | 16 endpoints |
| Encrypted key vault | — | AES-GCM-256 |
| Updates | Automatic | Manual (`git pull` + reload) |

If a feature below is missing in your side panel, you are on the store build. Load from source to get it.

---

## Setup Guide

### Step 1 — Open the side panel

Press **`Alt+Z`**, or click the ZANYSURF icon in your toolbar.

In Edge, pin it for one-click access: **Extensions (puzzle icon) → ⋯ next to ZANYSURF → Show in toolbar**.

### Step 2 — Choose how it thinks

Pick one. Local is free and private; cloud is faster and stronger.

<details open>
<summary><b>Option 1: Ollama — free, local, fully private (recommended)</b></summary>

Nothing leaves your machine. No API key, no account, no cost.

1. Install Ollama from **[ollama.com](https://ollama.com)** (macOS, Windows, Linux)
2. Pull a model:
   ```bash
   ollama pull llama3.2
   ```
3. Confirm the server is up — this should return JSON:
   ```bash
   curl http://localhost:11434/api/tags
   ```
4. In the ZANYSURF side panel: **Settings → Provider → Ollama**
5. Leave the URL as `http://localhost:11434` unless you changed it

**Model guidance:** `llama3.2` is the balanced default. Use `llama3.1:8b` or larger if your machine can take it — bigger models plan multi-step tasks noticeably better. Anything under 3B tends to lose the thread on longer goals.

</details>

<details>
<summary><b>Option 2: Gemini — cloud, free tier available</b></summary>

1. Get a key at **[Google AI Studio](https://aistudio.google.com/app/apikey)**
2. In the side panel: **Settings → Provider → Gemini**
3. Paste the key and save

Set a usage limit on the key in AI Studio. It's good practice for any key that lives in a browser.

</details>

<details>
<summary><b>Option 3: Other cloud providers (source build only)</b></summary>

OpenAI, Claude, Groq, and Mistral are available when running from source.

1. **Settings → Provider →** pick one
2. Set a **vault passphrase** when prompted — this encrypts your key with AES-GCM-256
3. Paste your API key and save

The vault locks when the browser session ends; you re-enter the passphrase to unlock it. See [Security](#security).

</details>

### Step 3 — Run your first task

Type a goal in plain English and press enter:

> *"Search for the top 3 espresso machines under $500 and summarize the differences."*

Watch the side panel — it shows each step as the agent plans, navigates, and acts. Stop it any time with the stop button.

**Good first goals**

- *"Find the current top 5 stories on Hacker News and summarize each in one line."*
- *"Go to Wikipedia, look up the Apollo 11 mission, and list the crew."*
- *"Open my GitHub notifications and tell me which need a reply."*

**Tips for reliable runs**

- Be specific about the finish line — *"list the top 3 and stop"* beats *"research espresso machines"*
- One goal per run; chain follow-ups as separate goals
- Start on a relevant tab — the agent uses the active page as context
- Leave **Safe Mode** on until you trust it. It pauses for approval before risky actions

### Step 4 — Troubleshooting

| Symptom | Cause and fix |
|---|---|
| "Load unpacked" fails or greys out | You selected the repo root. Select the **`extension/`** folder |
| Side panel is blank | Reload the extension on the extensions page, then reopen the panel |
| "Failed to connect to Ollama" | Ollama isn't running. Start it and check `curl http://localhost:11434/api/tags` |
| Ollama connects but every task stalls | Model too small. Try `ollama pull llama3.2` or larger |
| "Missing API key (vault locked)" | Unlock the vault with your passphrase in Settings |
| Agent clicks the wrong element | Heavy SPA. Retry — it backs off and re-reads the DOM. Report the site in an issue |
| Nothing happens on a page | Some pages block extensions entirely: `edge://`, `chrome://`, the Add-ons store, and most bank sites |
| `Alt+Z` does nothing | Shortcut conflict. Rebind at `edge://extensions/shortcuts` |

Still stuck? [Open an issue](https://github.com/ZANYANBU/zanysurf-browser-agent/issues) with your browser, provider, and the goal you typed.

---

## Why ZANYSURF

|  | ZANYSURF |
|---|---|
| **Runs 100% offline** | Yes — Ollama, no key required |
| **Your API keys** | AES-GCM-256 encrypted behind a passphrase you choose |
| **Telemetry / accounts** | None. There is no backend |
| **Approval gates** | Safe Mode pauses before risky actions |
| **Scriptable** | 16-endpoint messaging API for external automation |
| **Open source** | MIT |

---

## What It Actually Does

Everything listed here is in the source build. Items marked **`src`** are not yet in the published v1.0.1 store build.

**Agent core**
- Plan-and-execute loop with reflexion and self-correction
- Multi-tab orchestration with a dependency graph and cross-tab memory
- Vision fallback when a page's DOM is too sparse to reason about
- Safe Mode approval gates before destructive or high-risk actions
- Local memory (short + long term) with cosine-similarity retrieval and decay scoring
- Knowledge graph and semantically searchable smart bookmarks

**DOM engine**
- `MutationObserver`-based stability detection — waits for a real 400 ms quiet window instead of polling
- Shadow DOM traversal up to 6 levels deep (Web Components, Material UI, custom elements)
- React / Vue / Angular input compatibility via native value setters, so framework bindings actually fire
- React fiber idle check before reading the page
- Cookie and GDPR consent banner auto-dismiss before DOM mapping
- Exponential-backoff retry (200 ms / 400 ms) on stale or detached elements

**Macro recorder** — `src`
- Record any sequence of clicks, form fills, and navigations into a named macro
- Stored locally in `chrome.storage.local` — never uploaded
- Replay on any tab, inspect recorded steps, delete when done

**Automation** — `src`
- Scheduler built on `chrome.alarms`: `daily@HH:MM`, `weekly@`, `interval@Nm`
- Workflow replay with a full audit log
- Async task engine: parallel multi-goal execution with priority queuing and per-task cancellation
- Price comparison: opens marketplace tabs in parallel, extracts prices, synthesizes, exports CSV
- CSV export for any extracted dataset

<a id="security"></a>

**Security** — `src`
- Credential vault: PBKDF2 key derivation + AES-GCM-256 encryption, unlocked by your passphrase
- No arbitrary code execution — `execute_js` is restricted to a whitelisted preset allowlist
- Audit log of every provider key access and agent action

---

## Model Providers

Bring your own key, or run entirely local.

| Provider | Store v1.0.1 | Source | Notes |
|---|:---:|:---:|---|
| **Ollama** | ✅ | ✅ | Local and private. No key, no network egress |
| **Gemini** | ✅ | ✅ | Long context, good for research sweeps |
| **OpenAI** | — | ✅ | General purpose |
| **Claude** | — | ✅ | Strongest reasoning on complex multi-step goals |
| **Groq** | — | ✅ | Very fast inference |
| **Mistral** | — | ✅ | Cost efficient |
| **Edge Built-in AI** | — | ✅ | Zero setup on Edge, where available |

> **On API keys:** cloud keys are encrypted at rest with AES-GCM-256 using a key derived from your passphrase via PBKDF2 — they are not stored in plaintext. The passphrase is held in memory only while the vault is unlocked for a session. Ollama needs no key at all.

---

## Messaging API

ZANYSURF exposes an external messaging surface any other extension (or a native messaging bridge) can drive.

Call it with `chrome.runtime.sendMessage(ZANYSURF_EXTENSION_ID, { action, ...params })`. Your caller's ID must be listed in ZANYSURF's `externally_connectable.matches`.

| Action | Params | Response |
|---|---|---|
| `RUN_AGENT` | `{ goal }` | `{ success, result }` |
| `STOP_AGENT` | — | `{ success }` |
| `GET_STATUS` | — | `{ active, goal, steps }` |
| `GET_AGENT_METRICS` | — | `{ success, metrics }` |
| `GET_WORKFLOWS` | — | `{ success, workflows[] }` |
| `REPLAY_WORKFLOW` | `{ workflowId }` | `{ success, result }` |
| `GET_MACROS` | — | `{ success, macros[] }` |
| `SAVE_MACRO` | `{ name, steps[] }` | `{ success, macro }` |
| `REPLAY_MACRO` | `{ macroId }` | `{ success, result }` |
| `DELETE_MACRO` | `{ macroId }` | `{ success }` |
| `GET_MEMORY` | `{ query? }` | `{ success, memory[] }` |
| `CLEAR_MEMORY` | — | `{ success }` |
| `ENQUEUE_TASKS` | `{ tasks[] }` | `{ success, queued }` |
| `GET_TASK_STATUS` | — | `{ success, snapshot }` |
| `GET_AUDIT_LOG` | — | `{ success, log[] }` |
| `GET_API_METRICS` | — | `{ success, metrics }` |

**Run the agent from another extension**

```js
const ZANYSURF_ID = '<extension-id>';

chrome.runtime.sendMessage(ZANYSURF_ID, {
  action: 'RUN_AGENT',
  goal: 'Search for "best espresso machine 2026" and return the top 3 results'
}, response => {
  console.log(response.result);
});
```

**Record and replay a macro**

```js
chrome.runtime.sendMessage(ZANYSURF_ID, { action: 'SAVE_MACRO', name: 'Login flow', steps });
chrome.runtime.sendMessage(ZANYSURF_ID, { action: 'REPLAY_MACRO', macroId: '<id>' });
```

---

## Configuration

Open the side panel and click the settings icon.

| Setting | Description |
|---|---|
| Provider | Ollama, Gemini, OpenAI, Claude, Groq, Mistral, or Edge Built-in |
| Ollama URL | Default `http://localhost:11434` |
| Vault passphrase | Unlocks your encrypted cloud API keys |
| Safe Mode | Require approval before risky actions |
| Memory | Toggle short-term and long-term memory |

---

## Permissions

Every permission, and why it is needed:

| Permission | Why |
|---|---|
| `activeTab` | Read and interact with the current page |
| `scripting` | Inject the content script that performs actions |
| `storage` | Save settings, memory, macros, and the encrypted vault |
| `alarms` | Run scheduled recurring goals |
| `tabs` | Multi-tab orchestration |
| `downloads` | CSV exports |
| `sidePanel` | Persistent side panel UI |
| `contextMenus` | Right-click entry points |
| `notifications` | Task completion alerts |
| `clipboardWrite` | Copy extracted results |
| `declarativeNetRequest` | Header handling for provider API calls |

Full justifications: [PERMISSIONS.md](PERMISSIONS.md)

---

## Architecture

```
Side panel / popup  ──►  Service worker (agent loop)  ──►  Content script (DOM + actions)
       UI                  planning, memory, vault            perception, clicking, forms
```

Key components:

- **LLMGateway** — provider routing and cost accounting
- **MemorySystem** — short/long-term memory with similarity retrieval
- **OrchestratorAgent** — multi-agent pipelines (research, analysis, writer, action)
- **Credential vault** — PBKDF2 + AES-GCM-256 key storage
- **Risk guards** — approval gates for critical actions

---

## Repository Structure

```
zanysurf-browser-agent/
├── extension/          ← load THIS folder in Chrome / Edge
│   ├── background.js       service worker, agent loop
│   ├── content.js          DOM perception and actions
│   ├── popup.html/js/css   side panel UI
│   ├── manifest.json       Chrome manifest
│   ├── manifest.edge.json  Edge manifest
│   └── icons/
├── src/                ← extracted modules (gateway, perception, memory)
├── dev-playground/     ← Vite build tooling, NOT the extension
├── docs/               ← launch notes and screenshots
├── qa/                 ← smoke tests, static validation, perf reports
└── launch/             ← store listing and launch assets
```

---

## Contributing

Issues and pull requests are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

1. Fork and branch: `git checkout -b feature/your-feature`
2. Commit: `git commit -m "feat: your feature"`
3. Open a PR

---

## Privacy

There is no ZANYSURF backend. Nothing is collected, and there is nothing to collect it with.

- **Ollama** — page content never leaves your machine
- **Cloud providers** — page context goes only to the provider you selected, using your own key
- **Storage** — settings, memory, macros, and the encrypted vault live in `chrome.storage.local`

This is declared on the Edge Add-ons listing as *"No personal data collected."* Full detail: [PRIVACY.md](PRIVACY.md).

---

## Docs

- [Privacy policy](PRIVACY.md) — no data collection, no backend
- [Changelog](CHANGELOG.md)
- [Permissions](PERMISSIONS.md)
- [Edge Add-ons listing](https://microsoftedge.microsoft.com/addons/detail/pmadlohecccigmfcmickngnlikhmnjpa)

---

## License

MIT — see [LICENSE](LICENSE).

<div align="center">

**If ZANYSURF saves you time, star the repo.** It is the only signal that tells us to keep building.

</div>
