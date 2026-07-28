[![CI](https://github.com/ZANYANBU/zanysurf-browser-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/ZANYANBU/zanysurf-browser-agent/actions/workflows/ci.yml)

# Contributing to ZANYSURF Browser Agent

First off — thank you. Every contribution matters.

## Ways to contribute (no code needed)
- ⭐ Star the repo — helps more than you think
- 🐛 Report bugs via Issues
- 💡 Suggest features via Discussions
- 🧪 Test on your machine and share results
- 📣 Share with people who'd find it useful

## Ways to contribute (code)
- Fix a bug from the Issues list
- Improve documentation
- Add a new LLM provider
- Add a new site-specific hint
- Improve test coverage

## Development setup

```bash
git clone https://github.com/ZANYANBU/zanysurf-browser-agent
cd zanysurf-browser-agent
```

The extension has **no build step and no runtime dependencies** — it is plain MV3 JavaScript.

1. Open `chrome://extensions` (or `edge://extensions`)
2. Enable **Developer mode**
3. **Load unpacked** → select the `extension/` folder
4. Edit files in `extension/`, then hit reload on the extension card

`dev-playground/` is a separate Vite sandbox for prototyping UI. It is not part of the shipped extension and is not required to contribute.

## Checks

```bash
node qa/run-static-validation.mjs   # JS syntax + JSON validity across extension/
```

CI runs this on every push and pull request.

## Rules
1. Keep all shipped code inside `extension/`
2. Run the static validation before opening a PR
3. One feature/fix per PR
4. Commit format: `feat:`, `fix:`, `docs:`, `test:`
5. Don't add a feature to the README that isn't in the code

## PR checklist
- [ ] Static validation passes
- [ ] I loaded `extension/` and tested the change manually
- [ ] README/CHANGELOG updated if behavior changed
- [ ] Description explains what and why

Built by Anbu Chelvan Valavan.
Open to all contributors. MIT licensed.
