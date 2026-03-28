// ── STATE ──
const state = {
  rubrics: [],
  selectedRubric: null,
  versions: [],
  selectedVersion: null,
  prompts: [],
  rules: []
};

// ── INIT ──
document.getElementById('sidebar-container').innerHTML = Components.renderAdminSidebar('scoring');
initScoringPage();

async function initScoringPage() {
  wireTabs();
  wireModals();
  wireButtons();

  const main = document.getElementById('admin-content');
  main.style.display = '';

  try {
    const rubrics = await GoNoGoAPI.getRubrics();
    state.rubrics = Array.isArray(rubrics) ? rubrics : [];
    renderRubricCount();
    renderRubricList();
    if (state.rubrics.length > 0) {
      await selectRubric(state.rubrics[0].id);
    } else {
      renderNoRubrics();
    }
  } catch (err) {
    console.error('Failed to init scoring page:', err);
    document.getElementById('rubrics-list').innerHTML = '<div class="empty-state">Failed to load rubrics. Please refresh.</div>';
    renderNoRubrics();
  }
}

// ── TABS ──
function wireTabs() {
  document.querySelectorAll('.right-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-pane');
      document.querySelectorAll('.right-tab').forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('.right-pane').forEach(p => p.classList.toggle('active', p.id === 'pane-' + target));
    });
  });
}

// ── MODALS ──
function wireModals() {
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-backdrop').classList.remove('open');
    });
  });
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) backdrop.classList.remove('open');
    });
  });

  // New Rubric form
  document.getElementById('form-new-rubric').addEventListener('submit', async e => {
    e.preventDefault();
    const msgEl = document.getElementById('rubric-form-msg');
    msgEl.className = 'inline-msg'; msgEl.style.display = 'none';
    const payload = {
      name: document.getElementById('rubric-name').value.trim(),
      market: document.getElementById('rubric-market').value.trim(),
      industry: document.getElementById('rubric-industry').value.trim(),
      slug: document.getElementById('rubric-slug').value.trim(),
      description: document.getElementById('rubric-description').value.trim(),
      is_active: true
    };
    if (!payload.name || !payload.market) {
      msgEl.textContent = 'Name and market are required.';
      msgEl.className = 'inline-msg error'; return;
    }
    try {
      if (typeof GoNoGoAPI.createRubric === 'function') {
        await GoNoGoAPI.createRubric(payload);
      } else {
        await GoNoGoAPI.supabase.from('configscoringrubrics').insert([payload]);
      }
      msgEl.textContent = 'Rubric created!';
      msgEl.className = 'inline-msg success';
      document.getElementById('form-new-rubric').reset();
      setTimeout(() => {
        document.getElementById('modal-new-rubric').classList.remove('open');
        msgEl.style.display = 'none';
        initScoringPage();
      }, 800);
    } catch (err) {
      msgEl.textContent = 'Failed to create rubric: ' + (err.message || err);
      msgEl.className = 'inline-msg error';
    }
  });

  // New Version form
  document.getElementById('form-new-version').addEventListener('submit', async e => {
    e.preventDefault();
    const msgEl = document.getElementById('version-form-msg');
    msgEl.className = 'inline-msg'; msgEl.style.display = 'none';
    if (!state.selectedRubric) { msgEl.textContent = 'Select a rubric first.'; msgEl.className = 'inline-msg error'; return; }
    let weightsJson = null;
    const rawWeights = document.getElementById('version-weights').value.trim();
    if (rawWeights) {
      try { weightsJson = JSON.parse(rawWeights); } catch (err) {
        msgEl.textContent = 'Invalid JSON in weights field.'; msgEl.className = 'inline-msg error'; return;
      }
    }
    const payload = {
      rubric_id: state.selectedRubric.id,
      version: document.getElementById('version-number').value.trim(),
      status: document.getElementById('version-status').value,
      effective_from: document.getElementById('version-effective').value || null,
      change_summary: document.getElementById('version-summary').value.trim(),
      weights_json: weightsJson
    };
    if (!payload.version) { msgEl.textContent = 'Version number is required.'; msgEl.className = 'inline-msg error'; return; }
    try {
      if (typeof GoNoGoAPI.createRubricVersion === 'function') {
        await GoNoGoAPI.createRubricVersion(payload);
      } else {
        await GoNoGoAPI.supabase.from('configrubricversions').insert([payload]);
      }
      msgEl.textContent = 'Version created!'; msgEl.className = 'inline-msg success';
      document.getElementById('form-new-version').reset();
      setTimeout(() => {
        document.getElementById('modal-new-version').classList.remove('open');
        msgEl.style.display = 'none';
        selectRubric(state.selectedRubric.id);
      }, 800);
    } catch (err) {
      msgEl.textContent = 'Failed: ' + (err.message || err); msgEl.className = 'inline-msg error';
    }
  });

  // New Prompt form
  document.getElementById('form-new-prompt').addEventListener('submit', async e => {
    e.preventDefault();
    const msgEl = document.getElementById('prompt-form-msg');
    msgEl.className = 'inline-msg'; msgEl.style.display = 'none';
    if (!state.selectedVersion) { msgEl.textContent = 'Select a rubric version first.'; msgEl.className = 'inline-msg error'; return; }
    const payload = {
      rubric_version_id: state.selectedVersion.id,
      title: document.getElementById('prompt-title').value.trim(),
      type: document.getElementById('prompt-type').value,
      model_hint: document.getElementById('prompt-model').value.trim(),
      prompt_text: document.getElementById('prompt-body').value.trim()
    };
    if (!payload.title) { msgEl.textContent = 'Title is required.'; msgEl.className = 'inline-msg error'; return; }
    try {
      if (typeof GoNoGoAPI.createRubricPrompt === 'function') {
        await GoNoGoAPI.createRubricPrompt(payload);
      } else {
        await GoNoGoAPI.supabase.from('configrubricprompts').insert([payload]);
      }
      msgEl.textContent = 'Prompt saved!'; msgEl.className = 'inline-msg success';
      document.getElementById('form-new-prompt').reset();
      setTimeout(() => {
        document.getElementById('modal-new-prompt').classList.remove('open');
        msgEl.style.display = 'none';
        selectRubric(state.selectedRubric.id);
      }, 800);
    } catch (err) {
      msgEl.textContent = 'Failed: ' + (err.message || err); msgEl.className = 'inline-msg error';
    }
  });

  // New Rule form
  document.getElementById('form-new-rule').addEventListener('submit', async e => {
    e.preventDefault();
    const msgEl = document.getElementById('rule-form-msg');
    msgEl.className = 'inline-msg'; msgEl.style.display = 'none';
    if (!state.selectedVersion) { msgEl.textContent = 'Select a rubric version first.'; msgEl.className = 'inline-msg error'; return; }
    const payload = {
      rubric_version_id: state.selectedVersion.id,
      name: document.getElementById('rule-name').value.trim(),
      scope: document.getElementById('rule-scope').value,
      min_threshold: parseFloat(document.getElementById('rule-min').value) || null,
      max_threshold: parseFloat(document.getElementById('rule-max').value) || null,
      verdict: document.getElementById('rule-verdict').value,
      description: document.getElementById('rule-description').value.trim()
    };
    if (!payload.name) { msgEl.textContent = 'Rule name is required.'; msgEl.className = 'inline-msg error'; return; }
    try {
      if (typeof GoNoGoAPI.createDecisionRule === 'function') {
        await GoNoGoAPI.createDecisionRule(payload);
      } else {
        await GoNoGoAPI.supabase.from('configdecisionrules').insert([payload]);
      }
      msgEl.textContent = 'Rule saved!'; msgEl.className = 'inline-msg success';
      document.getElementById('form-new-rule').reset();
      setTimeout(() => {
        document.getElementById('modal-new-rule').classList.remove('open');
        msgEl.style.display = 'none';
        selectRubric(state.selectedRubric.id);
      }, 800);
    } catch (err) {
      msgEl.textContent = 'Failed: ' + (err.message || err); msgEl.className = 'inline-msg error';
    }
  });
}

// ── BUTTON WIRING ──
function wireButtons() {
  document.getElementById('btn-new-rubric').addEventListener('click', () => {
    document.getElementById('modal-new-rubric').classList.add('open');
  });
  document.getElementById('btn-new-version').addEventListener('click', () => {
    if (!state.selectedRubric) return;
    document.getElementById('modal-new-version').classList.add('open');
  });
  document.getElementById('btn-new-prompt').addEventListener('click', () => {
    if (!state.selectedVersion) return;
    document.getElementById('modal-new-prompt').classList.add('open');
  });
  document.getElementById('btn-new-ruleset').addEventListener('click', () => {
    if (!state.selectedVersion) return;
    document.getElementById('modal-new-rule').classList.add('open');
  });
}

// ── RUBRIC LIST ──
function renderRubricCount() {
  document.getElementById('rubric-count').textContent = String(state.rubrics.length);
}

function renderRubricList() {
  const c = document.getElementById('rubrics-list');
  if (!state.rubrics.length) { c.innerHTML = '<div class="empty-state">No rubrics yet. Click "New Rubric" to create one.</div>'; return; }
  c.innerHTML = state.rubrics.map(r => {
    const active = state.selectedRubric && String(state.selectedRubric.id) === String(r.id) ? 'active' : '';
    return `<article class="rubric-card ${active}" data-rid="${esc(r.id)}">
      <div class="rubric-card-top">
        <span class="rubric-market">${esc(r.market||'N/A')}</span>
        <span class="rubric-status">${r.is_active?'Active':'Inactive'}</span>
      </div>
      <h3 class="rubric-name">${esc(r.name||'Untitled')}</h3>
      <div class="rubric-meta">${esc(r.industry||'No industry')} · ${esc(r.slug||'')}</div>
    </article>`;
  }).join('');
  c.querySelectorAll('.rubric-card').forEach(card => {
    card.addEventListener('click', () => selectRubric(card.dataset.rid));
  });
}

// ── SELECT RUBRIC ──
async function selectRubric(rubricId) {
  const rubric = state.rubrics.find(r => String(r.id) === String(rubricId));
  if (!rubric) return;
  state.selectedRubric = rubric;
  state.selectedVersion = null;
  renderRubricList();
  renderRubricHeader();
  enableActionButtons(true);

  document.getElementById('rubric-summary').innerHTML = '<div class="empty-state">Loading…</div>';
  document.getElementById('scoring-methodology').innerHTML = '';
  document.getElementById('versions-list').innerHTML = '<div class="empty-state">Loading…</div>';
  document.getElementById('prompts-list').innerHTML = '<div class="empty-state">Loading…</div>';
  document.getElementById('rules-list').innerHTML = '<div class="empty-state">Loading…</div>';
  document.getElementById('audit-list').innerHTML = '<div class="empty-state">Loading…</div>';

  try {
    const [versions, prompts, rules] = await Promise.all([
      GoNoGoAPI.getRubricVersions(rubric.id),
      GoNoGoAPI.getRubricPromptsForRubric(rubric.id),
      GoNoGoAPI.getDecisionRulesForRubric(rubric.id)
    ]);
    state.versions = Array.isArray(versions) ? versions : [];
    state.prompts = Array.isArray(prompts) ? prompts : [];
    state.rules = Array.isArray(rules) ? rules : [];

    state.selectedVersion =
      state.versions.find(v => String(v.status||'').toLowerCase() === 'active') ||
      state.versions[0] || null;

    renderSummary();
    renderScoringMethodology();
    renderVersions();
    renderPrompts();
    renderRules();
    renderAudit();
  } catch (err) {
    console.error('Failed to load rubric detail:', err);
    document.getElementById('rubric-summary').innerHTML = '<div class="empty-state">Failed to load data.</div>';
  }
}

function renderRubricHeader() {
  const r = state.selectedRubric;
  document.getElementById('selected-rubric-title').textContent = r ? (r.name || 'Untitled') : 'Select a rubric';
  const bits = r ? [r.market, r.industry, r.slug].filter(Boolean).join(' · ') : '';
  const dates = r ? [r.created_at ? 'Created ' + fmtDate(r.created_at) : '', r.updated_at ? 'Updated ' + fmtDate(r.updated_at) : ''].filter(Boolean).join(' · ') : '';
  document.getElementById('selected-rubric-subtitle').textContent = r ? (bits + (dates ? ' — ' + dates : '')) : 'Choose a rubric from the left to see how scoring works.';
}

// ── SUMMARY KPIs ──
function renderSummary() {
  const activeV = state.versions.find(v => String(v.status||'').toLowerCase() === 'active');
  document.getElementById('rubric-summary').innerHTML = `
    <div class="summary-metric"><div class="summary-label">Versions</div><div class="summary-value">${state.versions.length}</div><div class="summary-note">Scoring methodology revisions.</div></div>
    <div class="summary-metric"><div class="summary-label">Prompts</div><div class="summary-value">${state.prompts.length}</div><div class="summary-note">AI research & scoring prompts.</div></div>
    <div class="summary-metric"><div class="summary-label">Decision Rules</div><div class="summary-value">${state.rules.length}</div><div class="summary-note">Go / caution / no-go thresholds.</div></div>
    <div class="summary-metric"><div class="summary-label">Active Version</div><div class="summary-value">${esc((activeV&&activeV.version)||'None')}</div><div class="summary-note">${activeV?esc(activeV.status):'No active version set.'}</div></div>
  `;
}

// ── SCORING METHODOLOGY (THE KEY NEW SECTION) ──
function renderScoringMethodology() {
  const container = document.getElementById('scoring-methodology');
  if (!state.selectedVersion) {
    container.innerHTML = '<div class="empty-state" style="margin-bottom:20px;">No version selected — create one to define scoring methodology.</div>';
    return;
  }

  const v = state.selectedVersion;
  let html = '';

  // 1. CATEGORY WEIGHTS
  const weights = parseWeights(v.weights_json || v.weights);
  if (weights && Object.keys(weights).length > 0) {
    const entries = Object.entries(weights);
    const total = entries.reduce((sum, [, w]) => sum + Number(w), 0);
    const maxWeight = Math.max(...entries.map(([, w]) => Number(w)));

    html += `<div class="methodology-section">
      <h3 class="methodology-section-title">Category Weights — Version ${esc(v.version||'')}</h3>
      <table class="weight-table">
        <thead><tr><th>Category</th><th>Weight</th><th class="weight-bar-cell">Distribution</th></tr></thead>
        <tbody>
          ${entries.map(([cat, w]) => {
            const pct = maxWeight > 0 ? (Number(w) / maxWeight * 100) : 0;
            return `<tr>
              <td>${esc(formatCategoryName(cat))}</td>
              <td>${Number(w)}%</td>
              <td class="weight-bar-cell"><div class="weight-bar-bg"><div class="weight-bar-fill" style="width:${pct}%"></div></div></td>
            </tr>`;
          }).join('')}
          <tr class="weight-total-row"><td>Total</td><td>${total}%</td><td></td></tr>
        </tbody>
      </table>
      ${Math.abs(total - 100) > 0.1 ? `<div class="weight-warning"><i class="fa-solid fa-triangle-exclamation"></i> Weights sum to ${total}%, not 100%. Please review.</div>` : ''}
    </div>`;
  } else {
    html += `<div class="methodology-section">
      <h3 class="methodology-section-title">Category Weights</h3>
      <div class="empty-state">No weights defined yet. Create a new version with a weights JSON to see the scoring breakdown.</div>
    </div>`;
  }

  // 2. DECISION THRESHOLDS
  const versionRules = state.selectedVersion
    ? state.rules.filter(r => String(r.rubric_version_id) === String(state.selectedVersion.id))
    : state.rules;

  const goRule = versionRules.find(r => String(r.verdict||r.name||'').toLowerCase().includes('go') && !String(r.verdict||r.name||'').toLowerCase().includes('no'));
  const cautionRule = versionRules.find(r => String(r.verdict||r.name||'').toLowerCase().includes('caution'));
  const nogoRule = versionRules.find(r => String(r.verdict||r.name||'').toLowerCase().includes('no-go') || String(r.verdict||r.name||'').toLowerCase().includes('nogo'));

  html += `<div class="methodology-section">
    <h3 class="methodology-section-title">Decision Thresholds</h3>`;

  if (goRule || cautionRule || nogoRule) {
    html += `<div class="threshold-cards">
      <div class="threshold-card go">
        <div class="threshold-label">Go</div>
        <div class="threshold-range">${goRule ? formatThreshold(goRule) : '—'}</div>
      </div>
      <div class="threshold-card caution">
        <div class="threshold-label">Caution</div>
        <div class="threshold-range">${cautionRule ? formatThreshold(cautionRule) : '—'}</div>
      </div>
      <div class="threshold-card nogo">
        <div class="threshold-label">No-Go</div>
        <div class="threshold-range">${nogoRule ? formatThreshold(nogoRule) : '—'}</div>
      </div>
    </div>`;
  } else {
    html += `<div class="threshold-cards">
      <div class="threshold-card go"><div class="threshold-label">Go</div><div class="threshold-range">70 – 100</div></div>
      <div class="threshold-card caution"><div class="threshold-label">Caution</div><div class="threshold-range">40 – 69</div></div>
      <div class="threshold-card nogo"><div class="threshold-label">No-Go</div><div class="threshold-range">0 – 39</div></div>
    </div>
    <p style="font-size:12px;color:var(--color-text-muted);margin-top:8px;">Default thresholds shown. Add decision rules to customise.</p>`;
  }
  html += `</div>`;

  // 3. FORMULA
  html += `<div class="methodology-section">
    <h3 class="methodology-section-title">Scoring Formula</h3>
    <div class="formula-block">Final Score = Σ (category_score × category_weight / 100)

Each category is scored 0–100 by AI analysis.
The weighted sum produces the overall brand score.

Hard-fail rules (if defined) can override to No-Go
regardless of overall score.

Verdict is determined by comparing the final score
against the decision thresholds above.</div>
  </div>`;

  // 4. WORKED EXAMPLE
  if (weights && Object.keys(weights).length > 0) {
    const entries = Object.entries(weights);
    const exampleScores = entries.map(([cat, w]) => {
      const score = Math.floor(Math.random() * 30) + 55; // 55-84
      return { cat, weight: Number(w), score, contrib: (score * Number(w) / 100) };
    });
    const finalScore = exampleScores.reduce((s, e) => s + e.contrib, 0);
    const verdict = finalScore >= 70 ? 'GO' : finalScore >= 40 ? 'CAUTION' : 'NO-GO';
    const verdictColor = finalScore >= 70 ? '#86efac' : finalScore >= 40 ? '#fde68a' : '#fca5a5';

    html += `<div class="methodology-section">
      <h3 class="methodology-section-title">Worked Example</h3>
      <div class="example-block">
        <div class="example-title"><i class="fa-solid fa-flask"></i> Sample Brand Assessment</div>
        ${exampleScores.map(e => `<div class="example-row">
          <span>${esc(formatCategoryName(e.cat))} (${e.weight}%)</span>
          <span>${e.score} × ${e.weight}% = ${e.contrib.toFixed(1)}</span>
        </div>`).join('')}
        <div class="example-divider"></div>
        <div class="example-verdict">
          <span>Final Score</span>
          <span style="font-variant-numeric:tabular-nums;">${finalScore.toFixed(1)}</span>
        </div>
        <div class="example-verdict">
          <span>Verdict</span>
          <span style="color:${verdictColor}">${verdict}</span>
        </div>
      </div>
    </div>`;
  }

  container.innerHTML = html;
}

// ── VERSIONS ──
function renderVersions() {
  const c = document.getElementById('versions-list');
  if (!state.versions.length) { c.innerHTML = '<div class="empty-state">No versions yet. Click "New Version" to create one.</div>'; return; }
  c.innerHTML = state.versions.map(v => {
    const active = state.selectedVersion && String(state.selectedVersion.id) === String(v.id) ? 'active' : '';
    const status = v.status || 'Draft';
    return `<article class="version-card ${active}" data-vid="${esc(v.id)}">
      <div class="version-top">
        <div class="version-badge"><i class="fa-solid fa-code-branch"></i> ${esc(v.version||'?')}</div>
        <div class="version-date">${v.effective_from ? fmtDate(v.effective_from) : 'No date'}</div>
      </div>
      <div class="version-status-row">
        <span class="chip ${status.toLowerCase()==='active'?'chip-success':'chip-muted'}">${esc(status)}</span>
        ${v.created_at?`<span class="chip chip-muted">${fmtDate(v.created_at)}</span>`:''}
      </div>
      <div class="version-summary">${esc(v.change_summary||'No change summary.')}</div>
    </article>`;
  }).join('');
  c.querySelectorAll('.version-card').forEach(card => {
    card.addEventListener('click', () => {
      const v = state.versions.find(x => String(x.id) === String(card.dataset.vid));
      if (!v) return;
      state.selectedVersion = v;
      renderVersions();
      renderScoringMethodology();
      renderPrompts();
      renderRules();
      renderAudit();
    });
  });
}

// ── PROMPTS ──
function renderPrompts() {
  const c = document.getElementById('prompts-list');
  const filtered = state.selectedVersion
    ? state.prompts.filter(p => String(p.rubric_version_id) === String(state.selectedVersion.id))
    : state.prompts;
  if (!filtered.length) { c.innerHTML = '<div class="empty-state">No prompts for this version. Click "+ Prompt" to add one.</div>'; return; }
  c.innerHTML = filtered.map(p => `<article class="prompt-card">
    <h3 class="prompt-title">${esc(p.title||p.type||'Untitled')}</h3>
    <div class="prompt-meta">Type: ${esc(p.type||'N/A')} · Model: ${esc(p.model_hint||'N/A')}</div>
    <div class="prompt-meta">Updated: ${p.updated_at?fmtDateTime(p.updated_at):p.created_at?fmtDateTime(p.created_at):'Unknown'}</div>
    <div class="prompt-snippet">${esc(trunc(p.prompt_text||p.prompt||p.instructions||p.description||'No preview.',200))}</div>
  </article>`).join('');
}

// ── RULES ──
function renderRules() {
  const c = document.getElementById('rules-list');
  const filtered = state.selectedVersion
    ? state.rules.filter(r => String(r.rubric_version_id) === String(state.selectedVersion.id))
    : state.rules;
  if (!filtered.length) { c.innerHTML = '<div class="empty-state">No decision rules for this version. Click "+ Rule" to add one.</div>'; return; }
  c.innerHTML = filtered.map(r => `<article class="rule-card">
    <h3 class="rule-title">${esc(r.name||'Unnamed rule')}</h3>
    <div class="rule-meta">Scope: ${esc(r.scope||'N/A')} · Verdict: ${esc(r.verdict||'N/A')} · Threshold: ${formatThreshold(r)}</div>
    <div class="rule-meta">Created: ${r.created_at?fmtDateTime(r.created_at):'Unknown'}</div>
    <div class="rule-snippet">${esc(trunc(r.description||r.logic||r.notes||'No description.',200))}</div>
  </article>`).join('');
}

// ── AUDIT TRAIL ──
function renderAudit() {
  const c = document.getElementById('audit-list');
  const events = [];
  if (state.selectedRubric) {
    events.push({ type:'Rubric', title:state.selectedRubric.name||'Created', ts:state.selectedRubric.updated_at||state.selectedRubric.created_at, meta:[state.selectedRubric.market,state.selectedRubric.industry].filter(Boolean).join(' · ') });
  }
  state.versions.forEach(v => events.push({ type:'Version', title:'v'+( v.version||'?'), ts:v.updated_at||v.created_at||v.effective_from, meta:v.change_summary||v.status||'' }));
  state.prompts.forEach(p => events.push({ type:'Prompt', title:p.title||p.type||'Prompt', ts:p.updated_at||p.created_at, meta:(p.model_hint||'')+(p.type?' · '+p.type:'') }));
  state.rules.forEach(r => events.push({ type:'Rule', title:r.name||'Rule', ts:r.updated_at||r.created_at, meta:r.scope||'' }));

  const sorted = events.filter(e=>e.ts).sort((a,b)=>new Date(b.ts)-new Date(a.ts));
  if (!sorted.length) { c.innerHTML = '<div class="empty-state">No audit activity yet.</div>'; return; }
  c.innerHTML = sorted.map(e => `<article class="audit-card">
    <h3 class="audit-title">${esc(e.type)} · ${esc(e.title)}</h3>
    <div class="audit-meta">${fmtDateTime(e.ts)}</div>
    <div class="audit-meta" style="margin-top:4px;">${esc(e.meta)}</div>
  </article>`).join('');
}

// ── EMPTY / BUTTONS ──
function renderNoRubrics() {
  document.getElementById('selected-rubric-title').textContent = 'No rubrics yet';
  document.getElementById('selected-rubric-subtitle').textContent = 'Create your first rubric to begin.';
  document.getElementById('rubric-summary').innerHTML = '';
  document.getElementById('scoring-methodology').innerHTML = '';
  document.getElementById('versions-list').innerHTML = '<div class="empty-state">Create a rubric first.</div>';
  document.getElementById('prompts-list').innerHTML = '<div class="empty-state">Create a rubric first.</div>';
  document.getElementById('rules-list').innerHTML = '<div class="empty-state">Create a rubric first.</div>';
  document.getElementById('audit-list').innerHTML = '<div class="empty-state">No activity yet.</div>';
  enableActionButtons(false);
}

function enableActionButtons(on) {
  document.getElementById('btn-new-version').disabled = !on;
  document.getElementById('btn-new-prompt').disabled = !on;
  document.getElementById('btn-new-ruleset').disabled = !on;
}

// ── HELPERS ──
function parseWeights(val) {
  if (!val) return null;
  if (typeof val === 'object') return val;
  try { return JSON.parse(val); } catch(e) { return null; }
}

function formatCategoryName(slug) {
  return slug.replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatThreshold(rule) {
  const min = rule.min_threshold != null ? rule.min_threshold : rule.min;
  const max = rule.max_threshold != null ? rule.max_threshold : rule.max;
  if (min != null && max != null) return min + ' – ' + max;
  if (min != null) return '≥ ' + min;
  if (max != null) return '≤ ' + max;
  return '—';
}

function fmtDate(v) { try { return new Date(v).toLocaleDateString('en-ZA',{day:'numeric',month:'short',year:'numeric'}); } catch(e) { return String(v||''); } }
function fmtDateTime(v) { try { return new Date(v).toLocaleString('en-ZA',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}); } catch(e) { return String(v||''); } }
function trunc(t,n) { return (!t||t.length<=n)?t||'':t.slice(0,n).trim()+'…'; }
function esc(v) { return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
