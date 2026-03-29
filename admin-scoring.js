// ══════════════════════════════════════════════════════════════
// GoNoGo SA — Scoring Engine (admin-scoring.js)
// The single source of truth for how SA brands are scored.
// ══════════════════════════════════════════════════════════════

// ── SA MASTER SCORING DATA (seed / fallback) ──
var SA_BANKING_RUBRIC = {
  name: 'South Africa \u2013 Banking',
  market: 'SA',
  industry: 'Banking',
  slug: 'sa_banking',
  version: '1.0',
  totalPoints: 100,
  categories: [
    {
      key: 'digital_presence',
      name: 'Digital Presence & Accessibility',
      weight: 15,
      definition: 'Quality of website, mobile app, digital onboarding, accessibility features, uptime, and digital channel breadth.',
      anchors: {
        high: 'World-class app with 4.5+ store rating, full digital onboarding, accessibility-compliant, 99.9% uptime, comprehensive online banking.',
        mid: 'Functional app and website with some gaps. Onboarding partially digital. Occasional downtime or missing features.',
        low: 'No app or broken app, website-only with poor UX, no digital onboarding, frequent outages.'
      },
      research: [
        'App store ratings and recent reviews (Google Play + Apple)',
        'Website Lighthouse audit (performance, accessibility, SEO)',
        'Digital onboarding flow test (can you open an account online end-to-end?)',
        'Downdetector history for outage patterns',
        'Check WCAG compliance with axe DevTools'
      ],
      sources_min: 3,
      rules: ['Ignore marketing copy if it conflicts with actual user reviews.', 'Weight recent reviews (last 6 months) more heavily than older ones.']
    },
    {
      key: 'customer_experience',
      name: 'Customer Experience & Service',
      weight: 20,
      definition: 'Quality of customer support, complaint resolution, branch experience, wait times, and overall satisfaction signals.',
      anchors: {
        high: 'NPS above industry avg, Hellopeter rating 4+, complaints resolved within SLA, multiple support channels with fast response.',
        mid: 'Mixed reviews, some unresolved complaints, average wait times, limited support hours.',
        low: 'Consistently negative reviews, unresolved complaints on Hellopeter/social media, no visible complaint resolution process.'
      },
      research: [
        'Hellopeter reviews and company response rate',
        'Social media sentiment (Twitter/X, Facebook complaints)',
        'BASA/Ombudsman complaint data if available',
        'Mystery shop: call centre wait time + branch visit',
        'Google Reviews for key branches'
      ],
      sources_min: 3,
      rules: ['Minimum 3 independent sources.', 'Distinguish between volume of complaints (big banks get more) and resolution quality.']
    },
    {
      key: 'product_value',
      name: 'Product & Value Proposition',
      weight: 20,
      definition: 'Competitiveness of fees, interest rates, product range, rewards/loyalty, and transparency of pricing.',
      anchors: {
        high: 'Competitive or best-in-class fees, transparent pricing, broad product range, strong rewards programme, innovative offerings.',
        mid: 'Average fees, standard product range, basic rewards, pricing information available but not prominently disclosed.',
        low: 'High or hidden fees, limited product range, no rewards, poor pricing transparency, outdated offerings.'
      },
      research: [
        'Fee comparison across cheque/savings/credit products vs Big 5',
        'Interest rates on savings, home loans, personal loans',
        'Product range audit (transactional, savings, investment, insurance, forex)',
        'Rewards/loyalty programme comparison',
        'Fine print review for hidden charges'
      ],
      sources_min: 3,
      rules: ['Compare like-for-like (same account tier).', 'Use bank\'s own fee schedule PDF as primary source, cross-check with comparator sites.']
    },
    {
      key: 'financial_health',
      name: 'Financial Health & Stability',
      weight: 15,
      definition: 'Capital adequacy, profitability, credit ratings, regulatory standing, and balance sheet strength.',
      anchors: {
        high: 'Investment-grade credit rating, strong CAR above SARB minimums, consistent profitability, no regulatory actions.',
        mid: 'Adequate capitalisation, mixed profitability trends, stable but not exceptional metrics.',
        low: 'Below-minimum capital ratios, losses, regulatory warnings or curatorship, downgraded credit rating.'
      },
      research: [
        'Latest annual report (CAR, ROE, NPL ratio, cost-to-income)',
        'SARB BA900 returns if publicly available',
        'Credit rating (Moody\'s, Fitch, S&P — SA scale)',
        'Any SARB enforcement actions or directives',
        'JSE announcements for listed banks'
      ],
      sources_min: 2,
      rules: ['Use most recent audited financials.', 'Flag if financial data is older than 18 months.']
    },
    {
      key: 'trust_reputation',
      name: 'Trust, Brand Reputation & Compliance',
      weight: 15,
      definition: 'Brand perception, regulatory compliance record, FICA/POPIA adherence, ethical conduct, and media sentiment.',
      anchors: {
        high: 'Strong trusted brand, clean regulatory record, proactive on POPIA/FICA, positive media coverage, industry awards.',
        mid: 'Generally trusted but some negative press, minor compliance issues addressed, average brand perception.',
        low: 'Major scandals, regulatory fines, data breaches, negative media dominates, loss of public trust.'
      },
      research: [
        'News search (last 12 months): scandals, fines, regulatory actions',
        'FSCA enforcement actions database',
        'Brand surveys (Kantar, BrandZ SA, Sunday Times Top Brands)',
        'POPIA compliance indicators (privacy policy, data breach history)',
        'Industry awards and recognition'
      ],
      sources_min: 3,
      rules: ['Recency matters: a resolved 2019 scandal weighs less than a 2025 data breach.', 'Distinguish between allegations and confirmed findings.']
    },
    {
      key: 'innovation',
      name: 'Innovation & Future Readiness',
      weight: 10,
      definition: 'Investment in fintech, API/open banking readiness, AI adoption, partnership ecosystem, and pace of feature releases.',
      anchors: {
        high: 'Active fintech partnerships, open API programme, AI-driven features, rapid feature releases, innovation lab or incubator.',
        mid: 'Some digital innovation but reactive, limited API access, standard feature set with occasional updates.',
        low: 'Legacy systems, no API access, no visible innovation pipeline, falling behind competitors on features.'
      },
      research: [
        'Tech press coverage and fintech partnership announcements',
        'Developer portal / API availability check',
        'App update frequency and changelog review',
        'LinkedIn job postings (hiring for AI, data science, engineering = signal)',
        'Conference presentations or innovation reports'
      ],
      sources_min: 2,
      rules: ['Press releases alone don\'t count — verify with actual product availability.']
    },
    {
      key: 'social_impact',
      name: 'Social Impact & Inclusion',
      weight: 5,
      definition: 'Financial inclusion efforts, B-BBEE rating, community investment, ESG commitments, and accessibility for underserved segments.',
      anchors: {
        high: 'Strong B-BBEE rating (Level 1\u20132), active financial inclusion products, measurable community impact, published ESG report.',
        mid: 'Compliant B-BBEE, basic entry-level products, some CSI activity, ESG mentioned but not detailed.',
        low: 'Poor B-BBEE rating, no inclusion products, no visible community investment, no ESG reporting.'
      },
      research: [
        'B-BBEE certificate/rating (dtic verification)',
        'Financial inclusion products (zero-fee accounts, Mzansi-type offerings)',
        'Integrated/ESG report review',
        'CSI spend and community programmes',
        'Accessibility features for disabled and elderly customers'
      ],
      sources_min: 2,
      rules: ['Accept self-reported B-BBEE only if independently verified.']
    }
  ],
  thresholds: {
    go:      { min: 70, max: 100, label: 'Go',      description: 'Brand meets GoNoGo standards. Safe to recommend.' },
    caution: { min: 40, max: 69,  label: 'Caution',  description: 'Mixed signals. Recommend with caveats or flag for manual review.' },
    nogo:    { min: 0,  max: 39,  label: 'No-Go',    description: 'Brand fails minimum standards. Do not recommend.' }
  },
  hardFails: [
    'Active SARB curatorship or licence suspension → automatic No-Go regardless of score.',
    'Confirmed unresolved data breach affecting customers in last 12 months → automatic No-Go.',
    'Brand not registered with FSCA where required → automatic No-Go.'
  ],
  exceptions: [
    'Early-stage digital banks (< 3 years operating) may be scored with lighter historic financial data if CAR and SARB licence are confirmed.',
    'Brands undergoing merger/acquisition: score the acquiring entity\'s metrics, flag the transition in the rationale.'
  ],
  formula: 'Final Score = \u03A3 (category_score \u00D7 category_weight / 100)\n\nEach category is scored 0\u201310 by the research/AI analysis.\nThe weighted sum is then scaled to a 0\u2013100 GoNoGo score.\n\nHard-fail rules override: if any hard-fail condition is true,\nthe brand is automatically No-Go regardless of numeric score.\n\nVerdict is determined by comparing the final score\nagainst the Go / Caution / No-Go thresholds.',
  prompts: [
    {
      tag: 'SA_Banking_v1_full_research',
      title: 'Full Brand Research & Scoring',
      type: 'research',
      model_hint: 'gpt-4o / claude-3.5-sonnet',
      role: 'You are a South African banking analyst for GoNoGo, a brand intelligence platform.',
      objective: 'Conduct comprehensive research on the given SA bank and produce a structured scoring breakdown across all rubric categories.',
      constraints: [
        'Use minimum 3 independent sources per category (where specified).',
        'Do not rely on the bank\'s own marketing material as a primary source.',
        'Flag any data older than 18 months.',
        'If a hard-fail condition is detected, note it immediately.'
      ],
      output_format: 'JSON object with: brand_name, overall_score (0-100), verdict (Go/Caution/No-Go), categories (array of {key, name, score_out_of_10, weighted_contribution, rationale, sources}), hard_fail_flags (array), and executive_summary (3-4 sentences).',
      prompt_text: 'Research and score [BRAND_NAME] using the GoNoGo SA Banking rubric v1.0. For each of the 7 categories, provide a score out of 10 with rationale and sources. Calculate the weighted total. Check all hard-fail conditions. Return structured JSON.'
    },
    {
      tag: 'SA_Banking_v1_quick_rescore',
      title: 'Quick Rescore (Existing Data)',
      type: 'scoring',
      model_hint: 'gpt-4o-mini / claude-3-haiku',
      role: 'You are a scoring engine for GoNoGo SA.',
      objective: 'Given existing research data, recalculate the GoNoGo score using the current rubric weights.',
      constraints: ['Do not conduct new research.', 'Use only the data provided.', 'Flag if any source data is stale.'],
      output_format: 'Same JSON structure as full research prompt.',
      prompt_text: 'Using the following existing research data for [BRAND_NAME], recalculate the GoNoGo score using SA Banking rubric v1.0 weights. Data: [PASTE_EXISTING_DATA]'
    },
    {
      tag: 'SA_Banking_v1_explain_score',
      title: 'Explain This Score (Public Justification)',
      type: 'analysis',
      model_hint: 'gpt-4o / claude-3.5-sonnet',
      role: 'You are a consumer-facing financial writer for GoNoGo South Africa.',
      objective: 'Produce a clear, jargon-free explanation of why a brand received its GoNoGo score, suitable for publication on the website.',
      constraints: ['No internal methodology details.', 'Cite specific evidence consumers can verify.', 'Neutral professional tone, not promotional.'],
      output_format: 'Markdown: ## heading, 3-4 paragraphs, bullet list of key strengths and concerns.',
      prompt_text: 'Write a public-facing explanation for why [BRAND_NAME] received a GoNoGo score of [SCORE]/100 ([VERDICT]). Use the following category breakdown: [PASTE_BREAKDOWN]'
    }
  ]
};

// ── STATE ──
var state = {
  rubrics: [],
  selectedRubric: null,
  versions: [],
  selectedVersion: null,
  prompts: [],
  rules: [],
  seed: SA_BANKING_RUBRIC
};

// ── INIT ──
document.getElementById('sidebar-container').innerHTML = Components.renderAdminSidebar('scoring');
initScoringPage();

function initScoringPage() {
  wireTabs();
  wireMiddleTabs();
  wireModals();
  wireButtons();
  document.getElementById('admin-content').style.display = '';

  GoNoGoAPI.getRubrics()
    .then(function (rubrics) {
      state.rubrics = Array.isArray(rubrics) ? rubrics : [];
      renderRubricCount();
      renderRubricList();
      if (state.rubrics.length > 0) {
        selectRubric(state.rubrics[0].id);
      } else {
        renderSeedContent();
      }
    })
    .catch(function () {
      renderSeedContent();
    });
}

// ── TABS ──
function wireTabs() {
  document.querySelectorAll('.right-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-pane');
      document.querySelectorAll('.right-tab').forEach(function (t) { t.classList.toggle('active', t === tab); });
      document.querySelectorAll('.right-pane').forEach(function (p) { p.classList.toggle('active', p.id === 'pane-' + target); });
    });
  });
}

function wireMiddleTabs() {
  document.querySelectorAll('.mid-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-mid');
      document.querySelectorAll('.mid-tab').forEach(function (t) { t.classList.toggle('active', t === tab); });
      document.querySelectorAll('.mid-pane').forEach(function (p) { p.classList.toggle('active', p.id === 'mid-' + target); });
    });
  });
}

function wireModals() {
  document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () { btn.closest('.modal-backdrop').classList.remove('open'); });
  });
  document.querySelectorAll('.modal-backdrop').forEach(function (bd) {
    bd.addEventListener('click', function (e) { if (e.target === bd) bd.classList.remove('open'); });
  });
  var formRubric = document.getElementById('form-new-rubric');
  if (formRubric) formRubric.addEventListener('submit', handleCreateRubric);
  var formVersion = document.getElementById('form-new-version');
  if (formVersion) formVersion.addEventListener('submit', handleCreateVersion);
  var formPrompt = document.getElementById('form-new-prompt');
  if (formPrompt) formPrompt.addEventListener('submit', handleCreatePrompt);
  var formRule = document.getElementById('form-new-rule');
  if (formRule) formRule.addEventListener('submit', handleCreateRule);
}

function wireButtons() {
  document.getElementById('btn-new-rubric').addEventListener('click', function () {
    document.getElementById('modal-new-rubric').classList.add('open');
  });
  document.getElementById('btn-new-version').addEventListener('click', function () {
    if (state.selectedRubric) document.getElementById('modal-new-version').classList.add('open');
  });
  document.getElementById('btn-new-prompt').addEventListener('click', function () {
    if (state.selectedVersion || state.seed) document.getElementById('modal-new-prompt').classList.add('open');
  });
  document.getElementById('btn-new-ruleset').addEventListener('click', function () {
    if (state.selectedVersion || state.seed) document.getElementById('modal-new-rule').classList.add('open');
  });
}

// ── FORM HANDLERS ──
function handleCreateRubric(e) {
  e.preventDefault();
  var msg = document.getElementById('rubric-form-msg');
  msg.className = 'inline-msg'; msg.style.display = 'none';
  var payload = {
    name: document.getElementById('rubric-name').value.trim(),
    market: document.getElementById('rubric-market').value.trim(),
    industry: document.getElementById('rubric-industry').value.trim(),
    slug: document.getElementById('rubric-slug').value.trim(),
    description: document.getElementById('rubric-description').value.trim(),
    is_active: true
  };
  if (!payload.name || !payload.market) { msg.textContent = 'Name and market required.'; msg.className = 'inline-msg error'; return; }
  GoNoGoAPI.createRubric(payload).then(function () {
    msg.textContent = 'Created!'; msg.className = 'inline-msg success';
    setTimeout(function () { document.getElementById('modal-new-rubric').classList.remove('open'); initScoringPage(); }, 600);
  }).catch(function (err) { msg.textContent = 'Failed: ' + (err.message || err); msg.className = 'inline-msg error'; });
}

function handleCreateVersion(e) {
  e.preventDefault();
  var msg = document.getElementById('version-form-msg');
  msg.className = 'inline-msg'; msg.style.display = 'none';
  if (!state.selectedRubric) { msg.textContent = 'Select rubric first.'; msg.className = 'inline-msg error'; return; }
  var raw = document.getElementById('version-weights').value.trim();
  var weights = null;
  if (raw) { try { weights = JSON.parse(raw); } catch (err) { msg.textContent = 'Invalid JSON.'; msg.className = 'inline-msg error'; return; } }
  var payload = {
    rubric_id: state.selectedRubric.id,
    version: document.getElementById('version-number').value.trim(),
    status: document.getElementById('version-status').value,
    effective_from: document.getElementById('version-effective').value || null,
    change_summary: document.getElementById('version-summary').value.trim(),
    weights_json: weights
  };
  if (!payload.version) { msg.textContent = 'Version number required.'; msg.className = 'inline-msg error'; return; }
  GoNoGoAPI.createRubricVersion(payload).then(function () {
    msg.textContent = 'Created!'; msg.className = 'inline-msg success';
    setTimeout(function () { document.getElementById('modal-new-version').classList.remove('open'); selectRubric(state.selectedRubric.id); }, 600);
  }).catch(function (err) { msg.textContent = 'Failed: ' + (err.message || err); msg.className = 'inline-msg error'; });
}

function handleCreatePrompt(e) {
  e.preventDefault();
  var msg = document.getElementById('prompt-form-msg');
  msg.className = 'inline-msg'; msg.style.display = 'none';
  if (!state.selectedVersion) { msg.textContent = 'Create a version first.'; msg.className = 'inline-msg error'; return; }
  var payload = {
    rubric_version_id: state.selectedVersion.id,
    title: document.getElementById('prompt-title').value.trim(),
    type: document.getElementById('prompt-type').value,
    model_hint: document.getElementById('prompt-model').value.trim(),
    prompt_text: document.getElementById('prompt-body').value.trim()
  };
  GoNoGoAPI.createRubricPrompt(payload).then(function () {
    msg.textContent = 'Saved!'; msg.className = 'inline-msg success';
    setTimeout(function () { document.getElementById('modal-new-prompt').classList.remove('open'); selectRubric(state.selectedRubric.id); }, 600);
  }).catch(function (err) { msg.textContent = 'Failed: ' + (err.message || err); msg.className = 'inline-msg error'; });
}

function handleCreateRule(e) {
  e.preventDefault();
  var msg = document.getElementById('rule-form-msg');
  msg.className = 'inline-msg'; msg.style.display = 'none';
  if (!state.selectedVersion) { msg.textContent = 'Create a version first.'; msg.className = 'inline-msg error'; return; }
  var payload = {
    rubric_version_id: state.selectedVersion.id,
    name: document.getElementById('rule-name').value.trim(),
    scope: document.getElementById('rule-scope').value,
    min_threshold: parseFloat(document.getElementById('rule-min').value) || null,
    max_threshold: parseFloat(document.getElementById('rule-max').value) || null,
    verdict: document.getElementById('rule-verdict').value,
    description: document.getElementById('rule-description').value.trim()
  };
  GoNoGoAPI.createDecisionRule(payload).then(function () {
    msg.textContent = 'Saved!'; msg.className = 'inline-msg success';
    setTimeout(function () { document.getElementById('modal-new-rule').classList.remove('open'); selectRubric(state.selectedRubric.id); }, 600);
  }).catch(function (err) { msg.textContent = 'Failed: ' + (err.message || err); msg.className = 'inline-msg error'; });
}

// ── RUBRIC LIST ──
function renderRubricCount() { document.getElementById('rubric-count').textContent = String(state.rubrics.length); }

function renderRubricList() {
  var c = document.getElementById('rubrics-list');
  if (!state.rubrics.length) { c.innerHTML = '<div class="empty-state">No rubrics in DB yet. Showing seed data below.</div>'; return; }
  c.innerHTML = state.rubrics.map(function (r) {
    var active = state.selectedRubric && String(state.selectedRubric.id) === String(r.id) ? 'active' : '';
    return '<article class="rubric-card ' + active + '" data-rid="' + esc(r.id) + '">' +
      '<div class="rubric-card-top"><span class="rubric-market">' + esc(r.market || 'N/A') + '</span><span class="rubric-status">' + (r.is_active ? 'Active' : 'Inactive') + '</span></div>' +
      '<h3 class="rubric-name">' + esc(r.name || 'Untitled') + '</h3>' +
      '<div class="rubric-meta">' + esc(r.industry || '') + ' \u00B7 ' + esc(r.slug || '') + '</div></article>';
  }).join('');
  c.querySelectorAll('.rubric-card').forEach(function (card) {
    card.addEventListener('click', function () { selectRubric(card.dataset.rid); });
  });
}

// ── SELECT RUBRIC (loads DB data, merges with seed) ──
function selectRubric(rubricId) {
  var rubric = state.rubrics.find(function (r) { return String(r.id) === String(rubricId); });
  if (!rubric) return;
  state.selectedRubric = rubric;
  state.selectedVersion = null;
  renderRubricList();
  document.getElementById('selected-rubric-title').textContent = rubric.name || 'Untitled';
  document.getElementById('selected-rubric-subtitle').textContent = [rubric.market, rubric.industry, rubric.slug].filter(Boolean).join(' \u00B7 ');
  enableActionButtons(true);

  Promise.all([
    GoNoGoAPI.getRubricVersions(rubric.id),
    GoNoGoAPI.getRubricPromptsForRubric(rubric.id),
    GoNoGoAPI.getDecisionRulesForRubric(rubric.id)
  ]).then(function (results) {
    state.versions = results[0] || [];
    state.prompts = results[1] || [];
    state.rules = results[2] || [];
    state.selectedVersion = state.versions.find(function (v) { return String(v.status || '').toLowerCase() === 'active'; }) || state.versions[0] || null;
    renderSeedContent();
  }).catch(function () {
    renderSeedContent();
  });
}

// ── RENDER SEED CONTENT (the main display) ──
function renderSeedContent() {
  var s = state.seed;
  enableActionButtons(true);
  document.getElementById('selected-rubric-title').textContent = state.selectedRubric ? state.selectedRubric.name : s.name;
  document.getElementById('selected-rubric-subtitle').textContent = state.selectedRubric ? [state.selectedRubric.market, state.selectedRubric.industry].filter(Boolean).join(' \u00B7 ') : s.market + ' \u00B7 ' + s.industry + ' \u00B7 v' + s.version;

  renderMiddleFramework(s);
  renderMiddlePlaybooks(s);
  renderMiddleDecisions(s);
  renderMiddleVersions();
  renderRightPrompts(s);
  renderRightRules();
  renderRightAudit();
}

// ── MIDDLE: SCORING FRAMEWORK TAB ──
function renderMiddleFramework(s) {
  var el = document.getElementById('mid-framework');
  var total = s.categories.reduce(function (sum, c) { return sum + c.weight; }, 0);
  var maxW = Math.max.apply(null, s.categories.map(function (c) { return c.weight; }));

  var html = '<div class="methodology-section">' +
    '<h3 class="methodology-section-title">Category Weights \u2014 ' + esc(s.name) + ' v' + esc(s.version) + '</h3>' +
    '<table class="weight-table"><thead><tr><th>Category</th><th>Weight</th><th class="weight-bar-cell">Distribution</th></tr></thead><tbody>';

  s.categories.forEach(function (c) {
    var pct = maxW > 0 ? (c.weight / maxW * 100) : 0;
    html += '<tr><td>' + esc(c.name) + '</td><td>' + c.weight + '%</td>' +
      '<td class="weight-bar-cell"><div class="weight-bar-bg"><div class="weight-bar-fill" style="width:' + pct + '%"></div></div></td></tr>';
  });
  html += '<tr class="weight-total-row"><td>Total</td><td>' + total + '%</td><td></td></tr></tbody></table>';
  if (Math.abs(total - 100) > 0.1) html += '<div class="weight-warning"><i class="fa-solid fa-triangle-exclamation"></i> Weights sum to ' + total + '%, not 100%.</div>';
  html += '</div>';

  // Score anchors
  html += '<div class="methodology-section"><h3 class="methodology-section-title">Score Anchors \u2014 What 10/10, 5/10, 1/10 Looks Like</h3>';
  s.categories.forEach(function (c) {
    html += '<div class="anchor-card"><div class="anchor-card-header"><span class="anchor-cat-name">' + esc(c.name) + '</span><span class="chip chip-muted">' + c.weight + '%</span></div>' +
      '<p class="anchor-def">' + esc(c.definition) + '</p>' +
      '<div class="anchor-row"><span class="anchor-label go-label">9\u201310</span><span class="anchor-text">' + esc(c.anchors.high) + '</span></div>' +
      '<div class="anchor-row"><span class="anchor-label caution-label">4\u20136</span><span class="anchor-text">' + esc(c.anchors.mid) + '</span></div>' +
      '<div class="anchor-row"><span class="anchor-label nogo-label">1\u20133</span><span class="anchor-text">' + esc(c.anchors.low) + '</span></div></div>';
  });
  html += '</div>';

  // Formula
  html += '<div class="methodology-section"><h3 class="methodology-section-title">Scoring Formula</h3>' +
    '<div class="formula-block">' + esc(s.formula) + '</div></div>';

  // Worked example
  var exRows = s.categories.map(function (c) {
    var score = Math.floor(Math.random() * 4) + 5;
    return { name: c.name, weight: c.weight, score: score, contrib: (score * c.weight / 10) };
  });
  var finalScore = exRows.reduce(function (sum, r) { return sum + r.contrib; }, 0);
  var verdict = finalScore >= 70 ? 'GO' : finalScore >= 40 ? 'CAUTION' : 'NO-GO';
  var verdictColor = finalScore >= 70 ? '#86efac' : finalScore >= 40 ? '#fde68a' : '#fca5a5';

  html += '<div class="methodology-section"><h3 class="methodology-section-title">Worked Example</h3><div class="example-block">' +
    '<div class="example-title"><i class="fa-solid fa-flask"></i> Sample Brand Assessment</div>';
  exRows.forEach(function (r) {
    html += '<div class="example-row"><span>' + esc(r.name) + ' (' + r.weight + '%)</span><span>' + r.score + '/10 \u00D7 ' + r.weight + '% = ' + r.contrib.toFixed(1) + '</span></div>';
  });
  html += '<div class="example-divider"></div><div class="example-verdict"><span>Final Score</span><span>' + finalScore.toFixed(1) + ' / 100</span></div>' +
    '<div class="example-verdict"><span>Verdict</span><span style="color:' + verdictColor + '">' + verdict + '</span></div></div></div>';

  el.innerHTML = html;
}

// ── MIDDLE: RESEARCH PLAYBOOKS TAB ──
function renderMiddlePlaybooks(s) {
  var el = document.getElementById('mid-playbooks');
  var html = '';
  s.categories.forEach(function (c) {
    html += '<div class="playbook-card"><div class="playbook-header"><h4 class="playbook-cat">' + esc(c.name) + '</h4>' +
      '<span class="chip chip-muted">Min ' + c.sources_min + ' sources</span></div>' +
      '<div class="playbook-section"><div class="playbook-label">What to research</div><ul class="playbook-list">';
    c.research.forEach(function (r) { html += '<li>' + esc(r) + '</li>'; });
    html += '</ul></div>';
    if (c.rules && c.rules.length) {
      html += '<div class="playbook-section"><div class="playbook-label">Rules &amp; constraints</div><ul class="playbook-list rule-list">';
      c.rules.forEach(function (r) { html += '<li>' + esc(r) + '</li>'; });
      html += '</ul></div>';
    }
    html += '</div>';
  });
  el.innerHTML = html;
}

// ── MIDDLE: DECISION LOGIC TAB ──
function renderMiddleDecisions(s) {
  var el = document.getElementById('mid-decisions');
  var t = s.thresholds;
  var html = '<div class="methodology-section"><h3 class="methodology-section-title">Decision Thresholds</h3>' +
    '<div class="threshold-cards">' +
    '<div class="threshold-card go"><div class="threshold-label">Go</div><div class="threshold-range">' + t.go.min + ' \u2013 ' + t.go.max + '</div><div class="threshold-desc">' + esc(t.go.description) + '</div></div>' +
    '<div class="threshold-card caution"><div class="threshold-label">Caution</div><div class="threshold-range">' + t.caution.min + ' \u2013 ' + t.caution.max + '</div><div class="threshold-desc">' + esc(t.caution.description) + '</div></div>' +
    '<div class="threshold-card nogo"><div class="threshold-label">No-Go</div><div class="threshold-range">' + t.nogo.min + ' \u2013 ' + t.nogo.max + '</div><div class="threshold-desc">' + esc(t.nogo.description) + '</div></div>' +
    '</div></div>';

  html += '<div class="methodology-section"><h3 class="methodology-section-title">Hard-Fail Overrides</h3>' +
    '<div class="hardfail-list">';
  s.hardFails.forEach(function (f) { html += '<div class="hardfail-item"><i class="fa-solid fa-ban"></i> ' + esc(f) + '</div>'; });
  html += '</div></div>';

  html += '<div class="methodology-section"><h3 class="methodology-section-title">Exceptions Policy</h3>' +
    '<div class="exceptions-list">';
  s.exceptions.forEach(function (e) { html += '<div class="exception-item"><i class="fa-solid fa-scale-balanced"></i> ' + esc(e) + '</div>'; });
  html += '</div></div>';

  el.innerHTML = html;
}

// ── MIDDLE: VERSION HISTORY TAB ──
function renderMiddleVersions() {
  var el = document.getElementById('mid-versions');
  if (!state.versions.length) {
    el.innerHTML = '<div class="empty-state">No versions saved to DB yet. The seed rubric (v1.0) is shown by default. Click "New Version" to save a version to your database.</div>';
    return;
  }
  el.innerHTML = state.versions.map(function (v) {
    var active = state.selectedVersion && String(state.selectedVersion.id) === String(v.id) ? 'active' : '';
    var status = v.status || 'Draft';
    return '<article class="version-card ' + active + '" data-vid="' + esc(v.id) + '">' +
      '<div class="version-top"><div class="version-badge"><i class="fa-solid fa-code-branch"></i> ' + esc(v.version || '?') + '</div>' +
      '<div class="version-date">' + (v.effective_from ? fmtDate(v.effective_from) : 'No date') + '</div></div>' +
      '<div class="version-status-row"><span class="chip ' + (status.toLowerCase() === 'active' ? 'chip-success' : 'chip-muted') + '">' + esc(status) + '</span></div>' +
      '<div class="version-summary">' + esc(v.change_summary || 'No change summary.') + '</div></article>';
  }).join('');
  el.querySelectorAll('.version-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var v = state.versions.find(function (x) { return String(x.id) === String(card.dataset.vid); });
      if (v) { state.selectedVersion = v; renderMiddleVersions(); }
    });
  });
}

// ── RIGHT: PROMPTS TAB ──
function renderRightPrompts(s) {
  var el = document.getElementById('prompts-list');
  var dbPrompts = state.prompts || [];
  var seedPrompts = s.prompts || [];
  var html = '';

  // DB prompts first
  dbPrompts.forEach(function (p) {
    html += '<article class="prompt-card"><div class="prompt-badge">DB</div>' +
      '<h3 class="prompt-title">' + esc(p.title || p.type || 'Untitled') + '</h3>' +
      '<div class="prompt-meta">Type: ' + esc(p.type || 'N/A') + ' \u00B7 Model: ' + esc(p.model_hint || 'N/A') + '</div>' +
      '<div class="prompt-snippet">' + esc(trunc(p.prompt_text || '', 200)) + '</div></article>';
  });

  // Seed prompts
  seedPrompts.forEach(function (p) {
    html += '<article class="prompt-card seed-prompt">' +
      '<div class="prompt-badge seed">SEED</div>' +
      '<h3 class="prompt-title">' + esc(p.title) + '</h3>' +
      '<span class="chip chip-muted" style="margin-bottom:8px;">' + esc(p.tag) + '</span>' +
      '<div class="prompt-meta">Type: ' + esc(p.type) + ' \u00B7 Model: ' + esc(p.model_hint) + '</div>' +
      '<div class="prompt-field"><span class="prompt-field-label">Role</span>' + esc(p.role) + '</div>' +
      '<div class="prompt-field"><span class="prompt-field-label">Objective</span>' + esc(p.objective) + '</div>' +
      '<div class="prompt-field"><span class="prompt-field-label">Constraints</span><ul class="prompt-constraints">' +
      p.constraints.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="prompt-field"><span class="prompt-field-label">Output Format</span>' + esc(p.output_format) + '</div>' +
      '<div class="prompt-field"><span class="prompt-field-label">Prompt</span><div class="formula-block" style="margin-top:4px;">' + esc(p.prompt_text) + '</div></div>' +
      '</article>';
  });

  if (!html) html = '<div class="empty-state">No prompts defined.</div>';
  el.innerHTML = html;
}

// ── RIGHT: RULES TAB ──
function renderRightRules() {
  var el = document.getElementById('rules-list');
  if (!state.rules.length) {
    el.innerHTML = '<div class="empty-state">No DB rules yet. Decision thresholds are defined in the seed rubric under the "Decision Logic" tab.</div>';
    return;
  }
  el.innerHTML = state.rules.map(function (r) {
    return '<article class="rule-card"><h3 class="rule-title">' + esc(r.name || 'Unnamed') + '</h3>' +
      '<div class="rule-meta">Scope: ' + esc(r.scope || 'N/A') + ' \u00B7 Verdict: ' + esc(r.verdict || 'N/A') + ' \u00B7 Threshold: ' + formatThreshold(r) + '</div>' +
      '<div class="rule-snippet">' + esc(trunc(r.description || '', 200)) + '</div></article>';
  }).join('');
}

// ── RIGHT: AUDIT TAB ──
function renderRightAudit() {
  var el = document.getElementById('audit-list');
  var events = [];
  if (state.selectedRubric) events.push({ type: 'Rubric', title: state.selectedRubric.name, ts: state.selectedRubric.updated_at || state.selectedRubric.created_at, meta: state.selectedRubric.market });
  state.versions.forEach(function (v) { events.push({ type: 'Version', title: 'v' + (v.version || '?'), ts: v.updated_at || v.created_at, meta: v.change_summary || v.status }); });
  state.prompts.forEach(function (p) { events.push({ type: 'Prompt', title: p.title || p.type, ts: p.updated_at || p.created_at, meta: p.model_hint || '' }); });
  state.rules.forEach(function (r) { events.push({ type: 'Rule', title: r.name, ts: r.updated_at || r.created_at, meta: r.scope || '' }); });

  var sorted = events.filter(function (e) { return e.ts; }).sort(function (a, b) { return new Date(b.ts) - new Date(a.ts); });
  if (!sorted.length) {
    el.innerHTML = '<div class="empty-state">No audit events yet. Events appear here as you create versions, prompts, and rules in the database.</div>';
    return;
  }
  el.innerHTML = sorted.map(function (e) {
    return '<article class="audit-card"><h3 class="audit-title">' + esc(e.type) + ' \u00B7 ' + esc(e.title) + '</h3>' +
      '<div class="audit-meta">' + fmtDateTime(e.ts) + '</div>' +
      '<div class="audit-meta" style="margin-top:4px;">' + esc(e.meta || '') + '</div></article>';
  }).join('');
}

function enableActionButtons(on) {
  document.getElementById('btn-new-version').disabled = !on;
  document.getElementById('btn-new-prompt').disabled = !on;
  document.getElementById('btn-new-ruleset').disabled = !on;
}

// ── HELPERS ──
function formatThreshold(r) {
  var min = r.min_threshold != null ? r.min_threshold : r.min;
  var max = r.max_threshold != null ? r.max_threshold : r.max;
  if (min != null && max != null) return min + ' \u2013 ' + max;
  if (min != null) return '\u2265 ' + min;
  if (max != null) return '\u2264 ' + max;
  return '\u2014';
}
function fmtDate(v) { try { return new Date(v).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return String(v || ''); } }
function fmtDateTime(v) { try { return new Date(v).toLocaleString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return String(v || ''); } }
function trunc(t, n) { return (!t || t.length <= n) ? t || '' : t.slice(0, n).trim() + '\u2026'; }
function esc(v) { return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
