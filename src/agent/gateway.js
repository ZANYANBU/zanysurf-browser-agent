// ZANYSURF Multi-Provider Model Gateway
import { GoogleGenAI } from '@google/genai'; // Assuming installed via package.json

export class ModelGateway {
  constructor() {
    this.provider = 'gemini'; // Default, can be 'openai', 'anthropic', 'ollama', 'webllm'
    this.apiKey = null;
    this.selectedModel = null;
    this.ollamaUrl = 'http://localhost:11434';
    this.loadSettings();
  }

  async loadSettings() {
    const data = await chrome.storage.sync.get([
      'llmProvider', 'llmApiKey', 'ollamaModel', 'ollamaUrl',
      'geminiModel', 'openaiModel', 'claudeModel'
    ]);
    if (data.llmProvider) this.provider = data.llmProvider;
    if (data.llmApiKey) this.apiKey = data.llmApiKey;
    if (data.ollamaUrl) this.ollamaUrl = data.ollamaUrl;

    // Set model based on provider
    if (data.ollamaModel) this.selectedModel = data.ollamaModel;
    else if (data.geminiModel) this.selectedModel = data.geminiModel;
    else if (data.openaiModel) this.selectedModel = data.openaiModel;
    else if (data.claudeModel) this.selectedModel = data.claudeModel;
    else this.selectedModel = null;
  }

  async prompt(systemGoal, context, userPrompt) {
    if (this.provider === 'gemini') {
      return this._callGemini(systemGoal, context, userPrompt);
    } else if (this.provider === 'ollama') {
      return this._callOllama(systemGoal, context, userPrompt);
    }
    throw new Error(`Provider ${this.provider} not implemented.`);
  }

  async _callGemini(systemGoal, context, userPrompt) {
    // Basic wrapper using fetch (for extension environment restrictions)
    const stored = await chrome.storage.sync.get(['geminiApiKey']);
    const key = stored.geminiApiKey || "YOUR_FALLBACK_API_KEY"; // Placeholder
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemGoal}\n\nContext:\n${context}\n\nTask: ${userPrompt}\n\nReturn ONLY a JSON object with a 'plan' array containing 'action' (click/type/navigate), 'selector', and 'description'.`
          }]
        }]
      })
    });
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  async _callOllama(systemGoal, context, userPrompt) {
    const model = this.selectedModel || 'llama3';
    const baseUrl = (this.ollamaUrl || 'http://localhost:11434').replace(/\/$/, '');
    const url = `${baseUrl}/api/generate`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: `${systemGoal}\n\nContext:\n${context}\n\nTask: ${userPrompt}\n\nReturn JSON.`,
        stream: false,
        format: "json"
      })
    });

    if (!response.ok) {
      throw new Error(`OLLAMA request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.response) {
      throw new Error('OLLAMA returned empty response');
    }

    return data.response;
  }

  async detectOllamaModels() {
    const baseUrl = (this.ollamaUrl || 'http://localhost:11434').replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/api/tags`);

    if (!response.ok) {
      throw new Error(`Failed to detect OLLAMA models: ${response.status}`);
    }

    const data = await response.json();
    return (data.models || []).map(m => ({
      name: m.name,
      size: this._formatBytes(m.size || 0),
      modified: m.modified_at
    }));
  }

  async setOllamaModel(modelName) {
    this.selectedModel = modelName;
    await chrome.storage.sync.set({ ollamaModel: modelName });
  }

  async setOllamaUrl(url) {
    this.ollamaUrl = url;
    await chrome.storage.sync.set({ ollamaUrl: url });
  }

  _formatBytes(bytes) {
    const value = Number(bytes || 0);
    if (!value || value < 1024) return value + ' B';
    const units = ['KB', 'MB', 'GB', 'TB'];
    let size = value / 1024;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }
    return size.toFixed(1) + ' ' + units[unitIndex];
  }

  getSelectedModel() {
    return this.selectedModel;
  }

  getProvider() {
    return this.provider;
  }
}

export const gateway = new ModelGateway();