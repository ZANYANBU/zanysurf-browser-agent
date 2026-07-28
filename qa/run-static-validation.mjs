import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = process.cwd();
const ext = 'extension';

const files = {
  js: ['background.js', 'content.js', 'popup.js', 'dom-text-worker.js', 'selftest.js'].map((f) => `${ext}/${f}`),
  json: ['manifest.json', 'manifest.edge.json', 'metadata.json'].map((f) => `${ext}/${f}`),
  html: ['popup.html', 'selftest.html'].map((f) => `${ext}/${f}`)
};

function checkJsSyntax(file) {
  try {
    execSync(`node --check "${file}"`, { stdio: 'pipe' });
    return { file, ok: true };
  } catch (error) {
    return { file, ok: false, error: String(error.stderr || error.message) };
  }
}

function checkJson(file) {
  try {
    JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
    return { file, ok: true };
  } catch (error) {
    return { file, ok: false, error: error.message };
  }
}

function checkHtml(file) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  const ok = /<html[\s>]/i.test(text) && /<\/html>/i.test(text) && /<body[\s>]/i.test(text) && /<\/body>/i.test(text);
  return { file, ok, error: ok ? '' : 'Missing html/body closing structure' };
}

function grep(file, needleRegex) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  return needleRegex.test(text);
}

const requiredPermissions = [
  'sidePanel', 'declarativeNetRequest', 'notifications', 'downloads', 'clipboardWrite',
  'alarms', 'storage', 'scripting', 'activeTab', 'tabs', 'contextMenus'
];

const manifest = JSON.parse(fs.readFileSync(path.join(root, ext, 'manifest.json'), 'utf8'));
const edgeManifest = JSON.parse(fs.readFileSync(path.join(root, ext, 'manifest.edge.json'), 'utf8'));

const manifestChecks = {
  manifestVersion3: manifest.manifest_version === 3,
  sidePanelConfig: manifest.side_panel?.default_path === 'popup.html',
  commandAltZ: manifest.commands?.['toggle-sidepanel']?.suggested_key?.default === 'Alt+Z',
  bgServiceWorker: manifest.background?.service_worker === 'background.js',
  contentScriptAllUrls: Array.isArray(manifest.content_scripts)
    && manifest.content_scripts.some((c) => (c.js || []).includes('content.js') && (c.matches || []).includes('<all_urls>')),
  hostAllUrls: Array.isArray(manifest.host_permissions) && manifest.host_permissions.includes('<all_urls>'),
  // Chrome and Edge manifests must ship the same product identity and version.
  versionsMatch: manifest.version === edgeManifest.version,
  namesMatch: manifest.name === edgeManifest.name,
  permissions: requiredPermissions.map((p) => ({ perm: p, ok: (manifest.permissions || []).includes(p) }))
};

const functionChecks = {
  background: [
    'runAgentEntry', 'OrchestratorAgent', 'ResearchAgent', 'AnalysisAgent', 'WriterAgent', 'ActionAgent',
    'InterAgentBus', 'triggerLazyLoadScroll', 'generatePlan', 'runAgentWithPlanning', 'retrieveMemoryContext',
    'detectGoalContinuation', 'persistSessionState', 'upsertKnowledgeGraph', 'getKnowledgeGraph', 'appendAuditLog',
    'exportAuditLog', 'updateApiMetrics', 'classifyAgentError', 'toggleSafeMode', 'buildAgentDashboardSummary',
    'generateStepReplayHtml', 'SchedulerEngine', 'PersonalizationEngine', 'SmartBookmarks'
  ].map((name) => ({ name, ok: grep(`${ext}/background.js`, new RegExp(name)) })),
  content: [
    'buildDomMap', 'executeAction', 'detectPageType', 'extractSemanticSections', 'findPrimaryCTA',
    'extractCleanArticleText', 'extractMediaContext', 'installNetworkHooks', 'composeEmail',
    'bookPreferredSlot', 'resolveFieldValue'
  ].map((name) => ({ name, ok: grep(`${ext}/content.js`, new RegExp(name)) })),
  popup: [
    'initTier4Panel', 'refreshTier4Dashboard', 'renderDashboard', 'renderKnowledgeGraph',
    'renderReplaySlider', 'loadOnboardingState', 'showApprovalRequest'
  ].map((name) => ({ name, ok: grep(`${ext}/popup.js`, new RegExp(name)) }))
};

const result = {
  syntax: {
    js: files.js.map(checkJsSyntax),
    json: files.json.map(checkJson),
    html: files.html.map(checkHtml)
  },
  manifest: manifestChecks,
  functions: functionChecks
};

const outFile = path.join(root, 'qa', 'static-validation-report.json');
fs.writeFileSync(outFile, JSON.stringify(result, null, 2));

// Collect failures so this can gate CI instead of always exiting 0.
const failures = [];
for (const group of Object.values(result.syntax)) {
  for (const r of group) if (!r.ok) failures.push(`${r.file}: ${r.error}`);
}
for (const [key, value] of Object.entries(manifestChecks)) {
  if (key === 'permissions') {
    for (const p of value) if (!p.ok) failures.push(`manifest missing permission: ${p.perm}`);
  } else if (!value) {
    failures.push(`manifest check failed: ${key}`);
  }
}
for (const [file, checks] of Object.entries(functionChecks)) {
  for (const c of checks) if (!c.ok) failures.push(`${file}.js missing symbol: ${c.name}`);
}

console.log('Wrote', outFile);

if (failures.length) {
  console.error(`\nStatic validation FAILED (${failures.length}):`);
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}

console.log('Static validation passed ✅');
