document.getElementById('sidebar-container').innerHTML =
  Components.renderAdminSidebar('scoring');

const state = {
  rubrics: [],
  selectedRubric: null,
  versions: [],
  selectedVersion: null,
  prompts: [],
  rules: []
};

initScoringPage();

async function initScoringPage() {
  wireTabs();

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
    console.error('Failed to initialise scoring page:', err);
    renderFatalState('Failed to load rubrics. Please refresh and try again.');
  }
}

function wireTabs() {
  const tabs = document.querySelectorAll('.right-tab');
  const panes = document.querySelectorAll('.right-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-pane');

      tabs.forEach(t => t.classList.toggle('active', t === tab));
      panes.forEach(p => {
        p.classList.toggle('active', p.id === 'pane-' + target);
      });
    });
  });
}

function renderRubricCount() {
  document.getElementById('rubric-count').textContent = String(state.rubrics.length || 0);
}

function renderRubricList() {
  const container = document.getElementById('rubrics-list');

  if (!state.rubrics.length) {
    container.innerHTML = `<div class="empty-state">No rubrics found yet.</div>`;
    return;
  }

  container.innerHTML = state.rubrics.map(rubric => {
    const active = state.selectedRubric && state.selectedRubric.id === rubric.id ? 'active' : '';
    const status = rubric.is_active ? 'Active' : 'Inactive';

    return `
      <article class="rubric-card ${active}" data-rubric-id="${escapeHtml(rubric.id)}">
        <div class="rubric-card-top">
          <span class="rubric-market">${escapeHtml(rubric.market || 'N/A')}</span>
          <span class="rubric-status">${escapeHtml(status)}</span>
        </div>
        <h3 class="rubric-name">${escapeHtml(rubric.name || 'Untitled rubric')}</h3>
        <div class="rubric-meta">${escapeHtml(rubric.industry || 'No industry')}</div>
        <div class="rubric-slug">${escapeHtml(rubric.slug || '')}</div>
      </article>
    `;
  }).join('');

  container.querySelectorAll('.rubric-card').forEach(card => {
    card.addEventListener('click', async () => {
      const rubricId = card.getAttribute('data-rubric-id');
      await selectRubric(rubricId);
    });
  });
}

async function selectRubric(rubricId) {
  const rubric = state.rubrics.find(r => String(r.id) === String(rubricId));
  if (!rubric) return;

  state.selectedRubric = rubric;
  state.selectedVersion = null;
  state.versions = [];
  state.prompts = [];
  state.rules = [];

  renderRubricList();
  renderRubricHeader();
  renderRubricSummaryLoading();
  renderVersionsLoading();
  renderPromptsLoading();
  renderRulesLoading();
  renderAuditLoading();
  enableActionButtons(true);

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
      state.versions.find(v => String(v.status || '').toLowerCase() === 'active') ||
      state.versions[0] ||
      null;

    renderRubricSummary();
    renderVersionDetail();
    renderVersions();
    renderPrompts();
    renderRules();
    renderAudit();
  } catch (err) {
    console.error('Failed to load rubric detail:', err);
    renderRubricSummaryError();
    renderVersionDetailError();
    renderVersionsError();
    renderPromptsError();
    renderRulesError();
    renderAuditError();
  }
}

function renderRubricHeader() {
  const titleEl = document.getElementById('selected-rubric-title');
  const subtitleEl = document.getElementById('selected-rubric-subtitle');

  if (!state.selectedRubric) {
    titleEl.textContent = 'Select a rubric';
    subtitleEl.textContent = 'Choose a rubric from the left to load versions, methodology and controls.';
    return;
  }

  const rubric = state.selectedRubric;
  const bits = [
    rubric.market || 'N/A',
    rubric.industry || 'N/A',
    rubric.slug || ''
  ].filter(Boolean);

  const auditBits = [];
  if (rubric.created_at) auditBits.push('Created ' + formatDateTime(rubric.created_at));
  if (rubric.updated_at) auditBits.push('Updated ' + formatDateTime(rubric.updated_at));

  titleEl.textContent = rubric.name || 'Untitled rubric';
  subtitleEl.textContent = bits.join(' · ') + (auditBits.length ? ' — ' + auditBits.join(' · ') : '');
}

function renderRubricSummaryLoading() {
  document.getElementById('rubric-summary').innerHTML = `
    <div class="summary-metric"><div class="summary-label">Versions</div><div class="summary-value">…</div></div>
    <div class="summary-metric"><div class="summary-label">Prompts</div><div class="summary-value">…</div></div>
    <div class="summary-metric"><div class="summary-label">Decision Rules</div><div class="summary-value">…</div></div>
    <div class="summary-metric"><div class="summary-label">Active Version</div><div class="summary-value">…</div></div>
  `;
}

function renderRubricSummary() {
  const activeVersion =
    state.versions.find(v => String(v.status || '').toLowerCase() === 'active') || null;

  document.getElementById('rubric-summary').innerHTML = `
    <div class="summary-metric">
      <div class="summary-label">Versions</div>
      <div class="summary-value">${state.versions.length}</div>
      <div class="summary-note">Tracked scoring revisions for this rubric.</div>
    </div>
    <div class="summary-metric">
      <div class="summary-label">Prompts</div>
      <div class="summary-value">${state.prompts.length}</div>
      <div class="summary-note">Research and scoring prompts attached to rubric versions.</div>
    </div>
    <div class="summary-metric">
      <div class="summary-label">Decision Rules</div>
      <div class="summary-value">${state.rules.length}</div>
      <div class="summary-note">Go / caution / no-go rules and thresholds.</div>
    </div>
    <div class="summary-metric">
      <div class="summary-label">Active Version</div>
      <div class="summary-value">${escapeHtml((activeVersion && activeVersion.version) || 'None')}</div>
      <div class="summary-note">${activeVersion ? escapeHtml(activeVersion.status || 'Active') : 'No active version has been set.'}</div>
    </div>
  `;
}

function renderRubricSummaryError() {
  document.getElementById('rubric-summary').innerHTML = `
    <div class="empty-state">Failed to load rubric summary.</div>
  `;
}

function renderVersionDetail() {
  const card = document.getElementById('version-detail');

  if (!state.selectedVersion) {
    card.style.display = 'none';
    card.innerHTML = '';
    return;
  }

  const v = state.selectedVersion;
  card.style.display = '';

  card.innerHTML = `
    <h3 class="detail-section-title">Selected Version Detail</h3>

    <div class="detail-grid">
      <div>
        <div class="detail-item-label">Version</div>
        <div class="detail-item-value">${escapeHtml(v.version || '')}</div>
      </div>
      <div>
        <div class="detail-item-label">Status</div>
        <div class="detail-item-value">${escapeHtml(v.status || 'Draft')}</div>
      </div>
      <div>
        <div class="detail-item-label">Effective From</div>
        <div class="detail-item-value">${escapeHtml(v.effective_from ? formatDate(v.effective_from) : 'Not set')}</div>
      </div>
      <div>
        <div class="detail-item-label">Created</div>
        <div class="detail-item-value">${escapeHtml(v.created_at ? formatDateTime(v.created_at) : 'Unknown')}</div>
      </div>
    </div>

    <div style="margin-bottom:12px;">
      <div class="detail-item-label">Change Summary</div>
      <div class="detail-item-value">${escapeHtml(v.change_summary || 'No summary recorded.')}</div>
    </div>

    <div>
      <div class="detail-item-label">Weights JSON</div>
      <pre class="json-block">${escapeHtml(stringifyMaybeJson(v.weights_json || v.weights || null))}</pre>
    </div>
  `;
}

function renderVersionDetailError() {
  const card = document.getElementById('version-detail');
  card.style.display = '';
  card.innerHTML = `<div class="empty-state">Failed to load selected version detail.</div>`;
}

function renderVersionsLoading() {
  document.getElementById('versions-list').innerHTML = `<div class="empty-state">Loading version timeline...</div>`;
}

function renderVersions() {
  const container = document.getElementById('versions-list');

  if (!state.versions.length) {
    container.innerHTML = `<div class="empty-state">No versions yet for this rubric.</div>`;
    return;
  }

  container.innerHTML = state.versions.map(version => {
    const active = state.selectedVersion && String(state.selectedVersion.id) === String(version.id) ? 'active' : '';
    const status = version.status || 'Draft';

    return `
      <article class="version-card ${active}" data-version-id="${escapeHtml(version.id)}">
        <div class="version-top">
          <div class="version-badge">
            <i class="fa-solid fa-code-branch"></i>
            <span>${escapeHtml(version.version || 'Unversioned')}</span>
          </div>
          <div class="version-date">${escapeHtml(version.effective_from ? formatDate(version.effective_from) : 'No date')}</div>
        </div>

        <div class="version-status-row">
          <span class="chip ${String(status).toLowerCase() === 'active' ? 'chip-success' : 'chip-muted'}">${escapeHtml(status)}</span>
          ${version.created_at ? `<span class="chip chip-muted">${escapeHtml(formatDate(version.created_at))}</span>` : ''}
        </div>

        <div class="version-summary">${escapeHtml(version.change_summary || 'No change summary recorded.')}</div>
      </article>
    `;
  }).join('');

  container.querySelectorAll('.version-card').forEach(card => {
    card.addEventListener('click', () => {
      const versionId = card.getAttribute('data-version-id');
      const version = state.versions.find(v => String(v.id) === String(versionId));
      if (!version) return;

      state.selectedVersion = version;
      renderVersions();
      renderVersionDetail();
      renderPrompts();
      renderRules();
      renderAudit();
    });
  });
}

function renderVersionsError() {
  document.getElementById('versions-list').innerHTML = `<div class="empty-state">Failed to load version timeline.</div>`;
}

function renderPromptsLoading() {
  document.getElementById('prompts-list').innerHTML = `<div class="empty-state">Loading prompts...</div>`;
}

function renderPrompts() {
  const container = document.getElementById('prompts-list');

  if (!state.prompts.length) {
    container.innerHTML = `<div class="empty-state">No prompts found for this rubric.</div>`;
    return;
  }

  const filtered = state.selectedVersion
    ? state.prompts.filter(p => String(p.rubric_version_id) === String(state.selectedVersion.id))
    : state.prompts;

  if (!filtered.length) {
    container.innerHTML = `<div class="empty-state">No prompts attached to the selected version.</div>`;
    return;
  }

  container.innerHTML = filtered.map(prompt => `
    <article class="prompt-card">
      <h3 class="prompt-title">${escapeHtml(prompt.title || prompt.type || 'Untitled prompt')}</h3>
      <div class="prompt-meta">
        Type: ${escapeHtml(prompt.type || 'N/A')} ·
        Model: ${escapeHtml(prompt.model_hint || 'N/A')} ·
        Version: ${escapeHtml(prompt.rubric_version_version || 'N/A')}
      </div>
      <div class="prompt-meta">
        Updated: ${escapeHtml(prompt.updated_at ? formatDateTime(prompt.updated_at) : prompt.created_at ? formatDateTime(prompt.created_at) : 'Unknown')}
      </div>
      <div class="prompt-snippet">${escapeHtml(buildPromptSnippet(prompt))}</div>
    </article>
  `).join('');
}

function renderPromptsError() {
  document.getElementById('prompts-list').innerHTML = `<div class="empty-state">Failed to load prompts.</div>`;
}

function renderRulesLoading() {
  document.getElementById('rules-list').innerHTML = `<div class="empty-state">Loading decision rules...</div>`;
}

function renderRules() {
  const container = document.getElementById('rules-list');

  if (!state.rules.length) {
    container.innerHTML = `<div class="empty-state">No decision rules found for this rubric.</div>`;
    return;
  }

  const filtered = state.selectedVersion
    ? state.rules.filter(r => String(r.rubric_version_id) === String(state.selectedVersion.id))
    : state.rules;

  if (!filtered.length) {
    container.innerHTML = `<div class="empty-state">No decision rules attached to the selected version.</div>`;
    return;
  }

  container.innerHTML = filtered.map(rule => `
    <article class="rule-card">
      <h3 class="rule-title">${escapeHtml(rule.name || 'Unnamed rule')}</h3>
      <div class="rule-meta">
        Scope: ${escapeHtml(rule.scope || 'N/A')} ·
        Version ID: ${escapeHtml(rule.rubric_version_id || 'N/A')}
      </div>
      <div class="rule-meta">
        Created: ${escapeHtml(rule.created_at ? formatDateTime(rule.created_at) : 'Unknown')}
      </div>
      <div class="rule-snippet">${escapeHtml(buildRuleSnippet(rule))}</div>
    </article>
  `).join('');
}

function renderRulesError() {
  document.getElementById('rules-list').innerHTML = `<div class="empty-state">Failed to load decision rules.</div>`;
}

function renderAuditLoading() {
  document.getElementById('audit-list').innerHTML = `<div class="empty-state">Building audit trail...</div>`;
}

function renderAudit() {
  const container = document.getElementById('audit-list');

  const auditEvents = [];

  if (state.selectedRubric) {
    auditEvents.push({
      type: 'Rubric',
      title: state.selectedRubric.name || 'Rubric created',
      timestamp: state.selectedRubric.updated_at || state.selectedRubric.created_at,
      meta: [
        state.selectedRubric.market || 'N/A',
        state.selectedRubric.industry || 'N/A',
        state.selectedRubric.slug || ''
      ].filter(Boolean).join(' · ')
    });
  }

  state.versions.forEach(version => {
    auditEvents.push({
      type: 'Version',
      title: `Version ${version.version || ''}`.trim(),
      timestamp: version.updated_at || version.created_at || version.effective_from,
      meta: version.change_summary || version.status || 'Version event'
    });
  });

  state.prompts.forEach(prompt => {
    auditEvents.push({
      type: 'Prompt',
      title: prompt.title || prompt.type || 'Prompt updated',
      timestamp: prompt.updated_at || prompt.created_at,
      meta: `${prompt.model_hint || 'No model'}${prompt.rubric_version_version ? ' · ' + prompt.rubric_version_version : ''}`
    });
  });

  state.rules.forEach(rule => {
    auditEvents.push({
      type: 'Rule',
      title: rule.name || 'Decision rule updated',
      timestamp: rule.updated_at || rule.created_at,
      meta: rule.scope || 'Rule event'
    });
  });

  const filtered = auditEvents
    .filter(event => event.timestamp)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (!filtered.length) {
    container.innerHTML = `<div class="empty-state">No audit activity available yet.</div>`;
    return;
  }

  container.innerHTML = filtered.map(event => `
    <article class="audit-card">
      <h3 class="audit-title">${escapeHtml(event.type)} · ${escapeHtml(event.title)}</h3>
      <div class="audit-meta">${escapeHtml(formatDateTime(event.timestamp))}</div>
      <div class="audit-meta" style="margin-top:6px;">${escapeHtml(event.meta || '')}</div>
    </article>
  `).join('');
}

function renderAuditError() {
  document.getElementById('audit-list').innerHTML = `<div class="empty-state">Failed to build audit trail.</div>`;
}

function renderNoRubrics() {
  document.getElementById('selected-rubric-title').textContent = 'No rubrics yet';
  document.getElementById('selected-rubric-subtitle').textContent = 'Create your first rubric to begin building the scoring engine.';
  document.getElementById('rubric-summary').innerHTML = `<div class="empty-state">No rubric metrics available.</div>`;
  document.getElementById('versions-list').innerHTML = `<div class="empty-state">No versions yet.</div>`;
  document.getElementById('prompts-list').innerHTML = `<div class="empty-state">No prompts yet.</div>`;
  document.getElementById('rules-list').innerHTML = `<div class="empty-state">No rules yet.</div>`;
  document.getElementById('audit-list').innerHTML = `<div class="empty-state">No audit events yet.</div>`;
  document.getElementById('version-detail').style.display = 'none';
  enableActionButtons(false);
}

function renderFatalState(message) {
  document.getElementById('rubrics-list').innerHTML = `<div class="empty-state">${escapeHtml(message)}</div>`;
  renderNoRubrics();
}

function enableActionButtons(enabled) {
  document.getElementById('btn-new-version').disabled = !enabled;
  document.getElementById('btn-new-prompt').disabled = !enabled;
  document.getElementById('btn-new-ruleset').disabled = !enabled;
}

function buildPromptSnippet(prompt) {
  const candidates = [
    prompt.prompt_text,
    prompt.prompt,
    prompt.instructions,
    prompt.description,
    prompt.notes
  ].filter(Boolean);

  if (!candidates.length) return 'No prompt body preview available.';
  return truncateText(String(candidates[0]), 180);
}

function buildRuleSnippet(rule) {
  const candidates = [
    rule.description,
    rule.notes,
    rule.logic,
    rule.definition
  ].filter(Boolean);

  if (!candidates.length) return 'No rule summary available.';
  return truncateText(String(candidates[0]), 180);
}

function stringifyMaybeJson(value) {
  if (!value) return 'No weighting data recorded.';
  if (typeof value === 'string') return value;

  try {
    return JSON.stringify(value, null, 2);
  } catch (err) {
    return String(value);
  }
}

function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength).trim() + '…';
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (err) {
    return String(value || '');
  }
}

function formatDateTime(value) {
  try {
    return new Date(value).toLocaleString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (err) {
    return String(value || '');
  }
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
