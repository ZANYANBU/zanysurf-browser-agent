<div align="center">

<img src="extension/icons/icon128.png" width="96" alt="ZANYSURF Browser Agent" />

# ZANYSURF Browser Agent

**Give it a goal. It does the work.**

An autonomous AI agent that lives in your browser — it plans, navigates, clicks, fills forms, and reports back. Runs fully local with Ollama, or on your own cloud API keys. Your data never touches our servers, because there are no servers.

<a href="https://microsoftedge.microsoft.com/addons/detail/pmadlohecccigmfcmickngnlikhmnjpa">
<img src="https://img.shields.io/badge/Install%20on%20Microsoft%20Edge-0078D4?style=for-the-badge&logo=microsoftedge&logoColor=white" alt="Install on Microsoft Edge" />
</a>

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-2ea44f)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Version](https://img.shields.io/badge/Version-3.0.0-6f42c1)](extension/manifest.json)
[![Runs Offline](https://img.shields.io/badge/Runs%20Offline-Ollama-brightgreen)](https://ollama.com)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

</div>

---

## Install

**Microsoft Edge — one click:**
[Get ZANYSURF Browser Agent on Edge Add-ons →](https://microsoftedge.microsoft.com/addons/detail/pmadlohecccigmfcmickngnlikhmnjpa)

**Chrome / Edge — from source:**

1. Download or clone this repo
2. Open `chrome://extensions` (or `edge://extensions`)
3. Enable **Developer mode**
4. Click **Load unpacked** and select the **`extension/`** folder

> Load the `extension/` folder — not the repo root. `dev-playground/` is build tooling, not the extension.

---

## 60-Second Quick Start

**Free and fully local (recommended)**

```bash
# 1. Install Ollama → https://ollama.com
ollama pull llama3.2
```

Then open the ZANYSURF side panel (`Alt+Z`), pick **Ollama**, and type a goal:

> *"Find the top 3 espresso machines under $500 and export a CSV comparison."*

Nothing leaves your machine. No API key, no account, no telemetry.

**Or bring your own cloud key**

Open the side panel → Settings → pick a provider → unlock the vault with a passphrase → paste your key.

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

**Macro recorder**
- Record any sequence of clicks, form fills, and navigations into a named macro
- Stored locally in `chrome.storage.local` — never uploaded
- Replay on any tab, inspect recorded steps, delete when done

**Automation**
- Scheduler built on `chrome.alarms`: `daily@HH:MM`, `weekly@`, `interval@Nm`
- Workflow replay with a full audit log
- Async task engine: parallel multi-goal execution with priority queuing and per-task cancellation
- Price comparison: opens marketplace tabs in parallel, extracts prices, synthesizes, exports CSV
- CSV export for any extracted dataset

**Security**
- Credential vault: PBKDF2 key derivation + AES-GCM-256 encryption, unlocked by your passphrase
- No arbitrary code execution — `execute_js` is restricted to a whitelisted preset allowlist
- Audit log of every provider key access and agent action

---

## Model Providers

Bring your own key, or run entirely local.

| Provider | Notes |
|---|---|
| **Ollama** | Local and private. No key, no network egress |
| **Gemini** | Long context, good for research sweeps |
| **OpenAI** | General purpose |
| **Claude** | Strongest reasoning on complex multi-step goals |
| **Groq** | Very fast inference |
| **Mistral** | Cost efficient |
| **Edge Built-in AI** | Zero setup on Edge, where available |

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

## Docs

- [Privacy policy](PRIVACY.md) — no data collection, no backend
- [Changelog](CHANGELOG.md)
- [Permissions](PERMISSIONS.md)

---

## License

MIT — see [LICENSE](LICENSE).

<div align="center">

**If ZANYSURF saves you time, star the repo.** It is the only signal that tells us to keep building.

</div>
