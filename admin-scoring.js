// admin-scoring.js

document.getElementById('sidebar-container').innerHTML =
  Components.renderAdminSidebar('scoring');

// Rely on the existing admin session; no extra auth gate here
initScoringPage();

async function initScoringPage() {
  const main = document.getElementById('admin-content');
  main.style.display = '';

  const rubricsContainer = document.getElementById('rubrics-table-container');
  const detailCard = document.getElementById('rubric-detail-card');
  const versionsList = document.getElementById('versions-list');
  const promptsList = document.getElementById('prompts-list');
  const rulesList = document.getElementById('rules-list');
  const titleEl = document.getElementById('rubric-detail-title');
  const subtitleEl = document.getElementById('rubric-detail-subtitle');

  try {
    const rubrics = await GoNoGoAPI.getRubrics();
    if (!rubrics || rubrics.length === 0) {
      rubricsContainer.innerHTML = `
        <p class="text-sm text-muted">
          No rubrics yet. We’ll add creation/editing next, for now this page is read‑only.
        </p>
      `;
      return;
    }

    rubricsContainer.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Market</th>
            <th>Industry</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rubrics.map(r => `
            <tr class="clickable-row" data-rubric-id="${r.id}">
              <td>${r.market}</td>
              <td>${r.industry}</td>
              <td>${r.name}</td>
              <td>${r.slug}</td>
              <td>${r.is_active ? 'Active' : 'Inactive'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    rubricsContainer.querySelectorAll('.clickable-row').forEach(row => {
      row.addEventListener('click', async () => {
        const rubricId = row.getAttribute('data-rubric-id');
        const rubric = rubrics.find(r => r.id === rubricId);
        await loadRubricDetail(
          rubric,
          detailCard,
          titleEl,
          subtitleEl,
          versionsList,
          promptsList,
          rulesList
        );
      });
    });

  } catch (err) {
    console.error(err);
    rubricsContainer.innerHTML = `
      <p class="text-sm text-error">
        Failed to load rubrics. Please try again later.
      </p>
    `;
  }
}

async function loadRubricDetail(
  rubric,
  detailCard,
  titleEl,
  subtitleEl,
  versionsList,
  promptsList,
  rulesList
) {
  if (!rubric) return;

  titleEl.textContent = rubric.name;
  subtitleEl.textContent = `${rubric.market} · ${rubric.industry} · ${rubric.slug}`;
  detailCard.style.display = '';

  // Tabs switching
  const tabButtons = detailCard.querySelectorAll('.tab-button');
  const tabContents = detailCard.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.onclick = () => {
      const tab = btn.getAttribute('data-tab');
      tabButtons.forEach(b => b.classList.toggle('tab-active', b === btn));
      tabContents.forEach(c => {
        c.style.display =
          c.getAttribute('data-tab-content') === tab ? '' : 'none';
      });
    };
  });

  // Load versions, prompts, rules
  versionsList.innerHTML = '<p class="text-sm text-muted">Loading versions...</p>';
  promptsList.innerHTML = '<p class="text-sm text-muted">Loading prompts...</p>';
  rulesList.innerHTML = '<p class="text-sm text-muted">Loading decision rules...</p>';

  try {
    const [versions, prompts, rules] = await Promise.all([
      GoNoGoAPI.getRubricVersions(rubric.id),
      GoNoGoAPI.getRubricPromptsForRubric(rubric.id),
      GoNoGoAPI.getDecisionRulesForRubric(rubric.id)
    ]);

    // Versions
    if (!versions || versions.length === 0) {
      versionsList.innerHTML = '<p class="text-sm text-muted">No versions yet.</p>';
    } else {
      versionsList.innerHTML = `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Version</th>
              <th>Status</th>
              <th>Effective</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            ${versions.map(v => `
              <tr>
                <td>${v.version}</td>
                <td>${v.status}</td>
                <td>${v.effective_from || ''}</td>
                <td>${v.change_summary || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    // Prompts
    if (!prompts || prompts.length === 0) {
      promptsList.innerHTML = '<p class="text-sm text-muted">No prompts yet.</p>';
    } else {
      promptsList.innerHTML = `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Model</th>
              <th>Version</th>
            </tr>
          </thead>
          <tbody>
            ${prompts.map(p => `
              <tr>
                <td>${p.type}</td>
                <td>${p.title}</td>
                <td>${p.model_hint || ''}</td>
                <td>${p.rubric_version_version || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    // Rules
    if (!rules || rules.length === 0) {
      rulesList.innerHTML = '<p class="text-sm text-muted">No decision rules yet.</p>';
    } else {
      rulesList.innerHTML = `
        <ul class="simple-list">
          ${rules.map(r => `
            <li>
              <div class="text-sm font-semibold">${r.name}</div>
              <div class="text-xs text-muted">${r.scope}</div>
            </li>
          `).join('')}
        </ul>
      `;
    }

  } catch (err) {
    console.error(err);
    versionsList.innerHTML = '<p class="text-sm text-error">Failed to load versions.</p>';
    promptsList.innerHTML = '<p class="text-sm text-error">Failed to load prompts.</p>';
    rulesList.innerHTML = '<p class="text-sm text-error">Failed to load rules.</p>';
  }
}
