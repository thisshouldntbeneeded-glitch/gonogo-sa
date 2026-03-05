/* ============================================================
   GoNoGo SA Platform — app.js
   Navigation, modals, preferences, reviews, rendering
   ============================================================ */

(function () {
  'use strict';

  // === API CONFIG ===
  var API_BASE = '';

  // === STATE ===
  var state = {
    currentView: 'home', // 'home' | 'category'
    currentCategory: null,
    selectedPrefs: [],
    reviews: {},       // { brandKey: [{ user, scores, text, date }] } — local cache
    modalBrand: null,
    modalCategorySlug: null,
    _sortedBrands: null
  };

  // === METHODOLOGY DATA ===
  var METHODOLOGY = [
    { name: 'Compliance', icon: 'fa-scale-balanced', desc: 'Regulatory adherence, licensing, data protection' },
    { name: 'Customer Satisfaction', icon: 'fa-face-smile', desc: 'Reviews, ratings, retention, user feedback' },
    { name: 'Product Value', icon: 'fa-coins', desc: 'Pricing transparency, features, cost vs benefit' },
    { name: 'Innovation', icon: 'fa-microchip', desc: 'Technology, updates, digital capabilities' },
    { name: 'Customer Support', icon: 'fa-headset', desc: 'Response times, channels, resolution quality' },
    { name: 'Accessibility & Security', icon: 'fa-lock', desc: 'App quality, data security, ease of use' }
  ];

  var PREF_OPTIONS = [
    { key: 'Compliance', icon: 'fa-shield-halved', label: 'Trustworthy & compliant' },
    { key: 'Customer Satisfaction', icon: 'fa-face-smile', label: 'Happy customers' },
    { key: 'Product Value', icon: 'fa-coins', label: 'Best value for money' },
    { key: 'Innovation', icon: 'fa-microchip', label: 'Latest features & tech' },
    { key: 'Customer Support', icon: 'fa-headset', label: 'Great support' },
    { key: 'Accessibility & Security', icon: 'fa-lock', label: 'Easy & secure to use' }
  ];

  // === HELPERS ===
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  function displayVerdict(verdict) {
    if (!verdict) return '';
    var v = verdict.toUpperCase();
    if (v === 'GO') return 'GO';
    if (v === 'CAUTION') return 'GO WITH CAUTION';
    if (v === 'NOGO' || v === 'NO GO') return 'NO GO';
    return verdict;
  }

  function getVerdictClass(verdict) {
    if (!verdict) return 'nogo';
    var v = verdict.toUpperCase();
    if (v === 'GO') return 'go';
    if (v === 'CAUTION') return 'caution';
    return 'nogo';
  }

  function getScoreColor(verdict) {
    if (!verdict) return 'var(--red)';
    var v = verdict.toUpperCase();
    if (v === 'GO') return 'var(--green)';
    if (v === 'CAUTION') return 'var(--orange)';
    return 'var(--red)';
  }

  function getBarColor(verdict) {
    if (verdict === 'GO') return '#11a551';
    if (verdict === 'CAUTION') return '#ff9800';
    return '#e74c3c';
  }

  function brandKey(catSlug, brandName) {
    return catSlug + '::' + brandName;
  }

  function getInitials(name) {
    return name.split(/[\s&]+/).filter(Boolean).slice(0, 2).map(function(w) { return w[0]; }).join('').toUpperCase();
  }

  function parseScore(scoreStr) {
    if (!scoreStr) return { score: 0, max: 1 };
    var parts = String(scoreStr).split('/');
    return { score: parseFloat(parts[0]) || 0, max: parseFloat(parts[1]) || 1 };
  }

  function getVerdictForScore(score) {
    if (score >= 80) return 'GO';
    if (score >= 55) return 'CAUTION';
    return 'NOGO';
  }

  function totalBrands() {
    var count = 0;
    BRAND_DATA.forEach(function(cat) { count += cat.brands.length; });
    return count;
  }

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
  }

  // === RENDER FUNCTIONS ===

  function renderMethodology() {
    var grid = $('#methodologyGrid');
    if (!grid) return;
    var html = '';
    METHODOLOGY.forEach(function(m, i) {
      var totalMax = 0;
      var catCount = 0;
      BRAND_DATA.forEach(function(cat) {
        var sc = cat.scoring_categories.find(function(s) { return s.name === m.name; });
        if (sc) { totalMax += sc.max; catCount++; }
      });
      var avgMax = catCount > 0 ? Math.round(totalMax / catCount) : '—';
      html += '<div class="method-card animate-in stagger-' + (i + 1) + '">' +
        '<div class="method-icon"><i class="fas ' + m.icon + '"></i></div>' +
        '<div class="method-name">' + m.name + '</div>' +
        '<div class="method-desc">' + m.desc + '</div>' +
        '<div class="method-weight">Avg. ' + avgMax + ' pts out of 100</div>' +
      '</div>';
    });
    grid.innerHTML = html;
  }

  function renderCategoryPrefs() {
    var container = $('#categoryPrefs');
    if (!container) return;
    var html = '<div class="cat-pref-header">' +
      '<h3 class="cat-pref-title"><i class="fas fa-sliders"></i> What matters to you?</h3>' +
      '<p class="cat-pref-subtitle">Select to adjust rankings</p>' +
    '</div>' +
    '<div class="pref-pills" id="catPrefPills">';
    PREF_OPTIONS.forEach(function(p) {
      var isActive = state.selectedPrefs.indexOf(p.key) !== -1;
      html += '<button class="pref-pill' + (isActive ? ' active' : '') + '" data-pref="' + p.key + '">' +
        '<i class="fas ' + p.icon + '"></i> ' + p.label +
      '</button>';
    });
    html += '</div>';
    container.innerHTML = html;

    // Attach click handlers
    container.querySelectorAll('.pref-pill').forEach(function(pill) {
      pill.addEventListener('click', function() {
        var key = this.getAttribute('data-pref');
        togglePref(key);
      });
    });
  }

  function renderCategories() {
    var grid = $('#categoriesGrid');
    var count = $('#categoriesCount');
    if (!grid || !count) return;
    count.textContent = BRAND_DATA.length + ' industries, ' + totalBrands() + ' brands rated';

    var html = '';
    BRAND_DATA.forEach(function(cat, i) {
      var topBrand = cat.brands[0];
      var vc = getVerdictClass(topBrand.verdict);
      html += '<div class="category-card animate-in stagger-' + ((i % 6) + 1) + '" onclick="openCategory(\'' + cat.slug + '\')">' +
        '<div class="cat-card-header">' +
          '<div class="cat-icon"><i class="fas ' + cat.icon + '"></i></div>' +
          '<span class="cat-brand-count">' + cat.brands.length + ' brands</span>' +
        '</div>' +
        '<div class="cat-name">' + cat.category + '</div>' +
        '<div class="cat-top-brand">' +
          '<div class="cat-top-brand-avatar">' + getInitials(topBrand.name) + '</div>' +
          '<div class="cat-top-info">' +
            '<div class="cat-top-name">' + topBrand.name + '</div>' +
            '<div class="cat-top-label">Top rated</div>' +
          '</div>' +
          '<div class="cat-top-score ' + vc + '">' + topBrand.gonogo_score + '</div>' +
        '</div>' +
      '</div>';
    });
    grid.innerHTML = html;
  }

  // === NAVIGATION ===

  window.navigateHome = function() {
    state.currentView = 'home';
    state.currentCategory = null;
    $('#homeView').style.display = '';
    $('#categoryView').classList.remove('active');
    $('#backBtn').classList.remove('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.openCategory = function(slug) {
    var cat = BRAND_DATA.find(function(c) { return c.slug === slug; });
    if (!cat) return;

    state.currentView = 'category';
    state.currentCategory = slug;

    $('#homeView').style.display = 'none';
    $('#categoryView').classList.add('active');
    $('#backBtn').classList.add('visible');

    renderCategoryPrefs();
    renderCategoryView(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function renderCategoryView(cat) {
    var header = $('#categoryViewHeader');
    header.innerHTML =
      '<div class="category-view-icon"><i class="fas ' + cat.icon + '"></i></div>' +
      '<div>' +
        '<h2 class="category-view-title">' + cat.category + '</h2>' +
        '<p class="category-view-count">' + cat.brands.length + ' brands rated' +
          (state.selectedPrefs.length > 0 ? ' · Sorted by your preferences' : '') +
        '</p>' +
      '</div>';

    var sortedBrands = sortBrands(cat);
    state._sortedBrands = sortedBrands;

    var list = $('#brandList');
    var html = '';
    sortedBrands.forEach(function(b, i) {
      var vc = getVerdictClass(b.verdict);
      var snippet = b.key_strengths ? b.key_strengths.slice(0, 3).join(' · ') : '';
      html += '<div class="brand-row animate-in stagger-' + ((i % 6) + 1) + '" onclick="openBrandModal(\'' + cat.slug + '\', ' + i + ')" role="button" tabindex="0">' +
        '<span class="brand-rank">' + (i + 1) + '</span>' +
        '<div class="brand-avatar">' +
          (b.logo_url ? '<img src="' + b.logo_url + '" alt="' + escapeHtml(b.name) + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' : '') +
          '<span class="brand-avatar-letter" ' + (b.logo_url ? 'style="display:none"' : '') + '>' + getInitials(b.name) + '</span>' +
        '</div>' +
        '<div class="brand-info">' +
          '<div class="brand-name">' + escapeHtml(b.name) + '</div>' +
          '<div class="brand-snippet">' + escapeHtml(snippet) + '</div>' +
        '</div>' +
        '<div class="brand-score-wrap">' +
          '<div class="score-circle ' + vc + '">' + b.gonogo_score + '</div>' +
          '<span class="brand-verdict" style="color:' + getScoreColor(b.verdict) + '">' + displayVerdict(b.verdict) + '</span>' +
          '<i class="fas fa-chevron-right brand-arrow"></i>' +
        '</div>' +
      '</div>';
    });
    list.innerHTML = html;
  }

  function sortBrands(cat) {
    var brands = cat.brands.slice();
    if (state.selectedPrefs.length === 0) return brands;

    brands.sort(function(a, b) {
      var aBonus = 0, bBonus = 0;
      state.selectedPrefs.forEach(function(pref) {
        var aFW = a.framework_breakdown.find(function(f) { return f.category === pref; });
        var bFW = b.framework_breakdown.find(function(f) { return f.category === pref; });
        if (aFW) { var p = parseScore(aFW.score); aBonus += (p.score / p.max) * 10; }
        if (bFW) { var p2 = parseScore(bFW.score); bBonus += (p2.score / p2.max) * 10; }
      });
      var aTotal = a.gonogo_score + aBonus;
      var bTotal = b.gonogo_score + bBonus;
      return bTotal - aTotal;
    });
    return brands;
  }

  // === PREFERENCES ===

  function togglePref(key) {
    var idx = state.selectedPrefs.indexOf(key);
    if (idx !== -1) {
      state.selectedPrefs.splice(idx, 1);
    } else {
      state.selectedPrefs.push(key);
    }
    // Re-render prefs and brand list
    renderCategoryPrefs();
    if (state.currentView === 'category' && state.currentCategory) {
      var cat = BRAND_DATA.find(function(c) { return c.slug === state.currentCategory; });
      if (cat) renderCategoryView(cat);
    }
  }

  // === MODAL ===

  window.openBrandModal = function(slug, index) {
    var cat = BRAND_DATA.find(function(c) { return c.slug === slug; });
    if (!cat) return;
    var brands = state._sortedBrands || cat.brands;
    var brand = brands[index];
    if (!brand) return;

    state.modalBrand = brand;
    state.modalCategorySlug = slug;

    renderModalHeader(brand, cat.category);
    renderFrameworkTab(brand, cat);
    renderFeaturesTab(brand);
    renderStrengthsTab(brand);
    renderReviewsTab(brand, slug);

    // Fetch reviews from API and re-render reviews tab with real data
    fetchReviewsFromAPI(slug, brand.name);

    // Reset to first tab
    setModalTab('framework');

    // Show modal
    var overlay = $('#modalOverlay');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Animate bars after a tiny delay
    setTimeout(function() { animateFrameworkBars(); }, 100);
  };

  window.openBrandFromTop = function(slug, brandName) {
    var cat = BRAND_DATA.find(function(c) { return c.slug === slug; });
    if (!cat) return;
    var idx = cat.brands.findIndex(function(b) { return b.name === brandName; });
    if (idx === -1) return;
    state._sortedBrands = cat.brands;
    window.openBrandModal(slug, idx);
  };

  function renderModalHeader(brand, categoryName) {
    var vc = getVerdictClass(brand.verdict);
    var header = $('#modalHeader');
    var ctaHtml = '';
    if (brand.website_url) {
      ctaHtml = '<a href="' + escapeAttr(brand.website_url) + '" target="_blank" rel="noopener noreferrer" class="brand-cta-btn">' +
        '<i class="fas fa-arrow-up-right-from-square"></i> Visit Website' +
      '</a>';
    }
    header.innerHTML =
      '<div class="modal-brand-avatar">' +
        (brand.logo_url ? '<img src="' + brand.logo_url + '" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' : '') +
        '<span class="modal-brand-avatar-letter" ' + (brand.logo_url ? 'style="display:none"' : '') + '>' + getInitials(brand.name) + '</span>' +
      '</div>' +
      '<div class="modal-brand-info">' +
        '<div class="modal-brand-name">' + escapeHtml(brand.name) + '</div>' +
        '<div class="modal-brand-category">' + escapeHtml(categoryName) + '</div>' +
        ctaHtml +
      '</div>' +
      '<div class="modal-brand-score">' +
        '<div class="score-circle ' + vc + '">' + brand.gonogo_score + '</div>' +
        '<span class="modal-verdict-label" style="color:' + getScoreColor(brand.verdict) + '">' + displayVerdict(brand.verdict) + '</span>' +
      '</div>' +
      '<button class="modal-close" onclick="closeModal()" aria-label="Close"><i class="fas fa-xmark"></i></button>';
  }

  // --- TAB 1: Framework Breakdown ---
  function renderFrameworkTab(brand, cat) {
    var container = $('#tabFramework');
    if (!container) return;

    // Brand overview section
    var overviewHtml = '<div class="brand-overview">';
    
    // Build a brief brand description from the data
    var desc = '';
    if (brand.framework_breakdown && brand.framework_breakdown.length > 0) {
      // Use compliance description as a general brand context
      var complianceFb = brand.framework_breakdown.find(function(f) { return f.category === 'Compliance'; });
      if (complianceFb && complianceFb.description) {
        desc = complianceFb.description;
      }
    }

    overviewHtml += '<div class="overview-header">' +
      '<h3 class="overview-title">About ' + escapeHtml(brand.name) + '</h3>' +
      '<span class="overview-verdict badge-' + getVerdictClass(brand.verdict) + '">' + displayVerdict(brand.verdict) + '</span>' +
    '</div>';

    if (desc) {
      overviewHtml += '<p class="overview-desc">' + escapeHtml(desc) + '</p>';
    }

    // GoNoGo score summary
    overviewHtml += '<div class="overview-score-summary">' +
      '<div class="overview-score-big" style="color:' + getScoreColor(brand.verdict) + '">' + brand.gonogo_score + '<span class="overview-score-max">/100</span></div>' +
      '<div class="overview-score-label">GoNoGo Score</div>' +
    '</div>';

    overviewHtml += '</div>';

    // Framework breakdown bars
    var html = overviewHtml + '<div class="framework-list">';
    brand.framework_breakdown.forEach(function(fb) {
      var parsed = parseScore(fb.score);
      var pct = (parsed.score / parsed.max * 100).toFixed(0);
      var verdictForBar = getVerdictForScore(parseFloat(pct));
      var barColor = getBarColor(verdictForBar);
      html += '<div class="framework-item">' +
        '<div class="framework-item-header">' +
          '<span class="framework-cat-name">' + escapeHtml(fb.category) + '</span>' +
          '<span class="framework-score-text" style="color:' + barColor + '">' + escapeHtml(fb.score) + '</span>' +
        '</div>' +
        '<div class="framework-bar-track">' +
          '<div class="framework-bar-fill" data-width="' + pct + '" style="background:' + barColor + ';width:0%"></div>' +
        '</div>' +
        '<div class="framework-desc">' + escapeHtml(fb.description) + '</div>' +
      '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  function animateFrameworkBars() {
    var bars = $$('.framework-bar-fill');
    bars.forEach(function(bar, i) {
      setTimeout(function() {
        bar.style.width = bar.getAttribute('data-width') + '%';
      }, i * 80);
    });
  }

  // --- TAB 2: Features & Pricing ---
  function renderFeaturesTab(brand) {
    var container = $('#tabFeatures');
    if (!container) return;
    var html = '';

    // Key features
    if (brand.key_features && brand.key_features.length) {
      html += '<div class="features-section">' +
        '<div class="features-label"><i class="fas fa-check-double"></i> Key Features</div>' +
        '<div class="feature-tags">';
      brand.key_features.forEach(function(f) {
        html += '<span class="feature-tag"><i class="fas fa-check"></i> ' + escapeHtml(f) + '</span>';
      });
      html += '</div></div>';
    }

    // Pricing
    if (brand.pricing && brand.pricing.length) {
      html += '<div class="features-section">' +
        '<div class="features-label"><i class="fas fa-tag"></i> Pricing</div>';
      brand.pricing.forEach(function(p) {
        html += '<div class="pricing-block">' +
          '<span class="pricing-name">' + escapeHtml(p.name) + '</span>' +
          '<p class="pricing-detail">' + escapeHtml(p.cost) + '</p>' +
          (p.features ? '<p class="pricing-features">' + escapeHtml(p.features) + '</p>' : '') +
        '</div>';
      });
      html += '</div>';
    }

    // App ratings
    if (brand.app_ratings) {
      var gp = brand.app_ratings.google_play;
      var ios = brand.app_ratings.ios;
      var hasRatings = (gp && gp !== 'N/A') || (ios && ios !== 'N/A');
      if (hasRatings) {
        html += '<div class="features-section">' +
          '<div class="features-label"><i class="fas fa-mobile-screen-button"></i> App Ratings</div>' +
          '<div class="app-ratings">';
        if (gp && gp !== 'N/A') {
          html += '<div class="app-rating"><i class="fab fa-google-play" style="color:#34a853"></i> Google Play: <strong>' + escapeHtml(gp) + '</strong></div>';
        }
        if (ios && ios !== 'N/A') {
          html += '<div class="app-rating"><i class="fab fa-apple" style="color:#a0998c"></i> App Store: <strong>' + escapeHtml(ios) + '</strong></div>';
        }
        html += '</div></div>';
      }
    }

    if (!html) {
      html = '<div class="empty-tab"><i class="fas fa-info-circle"></i> No feature or pricing data available for this brand.</div>';
    }

    container.innerHTML = html;
  }

  // --- TAB 3: Strengths & Concerns ---
  function renderStrengthsTab(brand) {
    var container = $('#tabStrengths');
    if (!container) return;
    var html = '<div class="strengths-grid">';

    // Strengths
    if (brand.key_strengths && brand.key_strengths.length) {
      html += '<div class="strength-block"><h4><i class="fas fa-thumbs-up"></i> Key Strengths</h4><ul class="sc-list">';
      brand.key_strengths.forEach(function(s) {
        html += '<li><i class="fas fa-check" style="color:var(--green)"></i> ' + escapeHtml(s) + '</li>';
      });
      html += '</ul></div>';
    }

    // Concerns
    if (brand.key_concerns && brand.key_concerns.length) {
      html += '<div class="concern-block"><h4><i class="fas fa-exclamation-triangle"></i> Key Concerns</h4><ul class="sc-list">';
      brand.key_concerns.forEach(function(c) {
        html += '<li><i class="fas fa-exclamation" style="color:var(--orange)"></i> ' + escapeHtml(c) + '</li>';
      });
      html += '</ul></div>';
    }

    html += '</div>';

    // Social sentiment
    if (brand.social_sentiment) {
      var ss = brand.social_sentiment;
      html += '<div class="sentiment-panel">' +
        '<h4><i class="fas fa-comments"></i> Social Sentiment</h4>' +
        '<p class="sentiment-summary">' + escapeHtml(ss.summary) + '</p>' +
        '<div class="sentiment-themes">';
      if (ss.positive_themes && ss.positive_themes.length) {
        ss.positive_themes.forEach(function(t) {
          html += '<span class="sentiment-theme positive">' + escapeHtml(t) + '</span>';
        });
      }
      if (ss.common_concerns && ss.common_concerns.length) {
        ss.common_concerns.forEach(function(t) {
          html += '<span class="sentiment-theme negative">' + escapeHtml(t) + '</span>';
        });
      }
      html += '</div>';
      if (ss.methodology) {
        html += '<p class="sentiment-method">' + escapeHtml(ss.methodology) + '</p>';
      }
      html += '</div>';
    }

    if (html === '<div class="strengths-grid"></div>') {
      html = '<div class="empty-tab"><i class="fas fa-info-circle"></i> No strength or concern data available for this brand.</div>';
    }

    container.innerHTML = html;
  }

  // --- TAB 4: Reviews (GoNoGo 6-Category Rating System) ---

  var RATING_CATEGORIES = [
    { key: 'Compliance', icon: 'fa-scale-balanced', label: 'Compliance' },
    { key: 'Customer Satisfaction', icon: 'fa-face-smile', label: 'Customer Satisfaction' },
    { key: 'Product Value', icon: 'fa-coins', label: 'Product Value' },
    { key: 'Innovation', icon: 'fa-microchip', label: 'Innovation' },
    { key: 'Customer Support', icon: 'fa-headset', label: 'Customer Support' },
    { key: 'Accessibility & Security', icon: 'fa-lock', label: 'Accessibility & Security' }
  ];

  // In-memory rating state for the form
  var categoryRatings = {};

  function resetCategoryRatings() {
    categoryRatings = {};
    RATING_CATEGORIES.forEach(function(c) { categoryRatings[c.key] = 0; });
  }

  function getVerdictLabel(score) {
    if (score >= 80) return { text: 'GO', cls: 'go' };
    if (score >= 55) return { text: 'GO WITH CAUTION', cls: 'caution' };
    return { text: 'NO GO', cls: 'nogo' };
  }

  function renderReviewsTab(brand, slug) {
    var container = $('#tabReviews');
    if (!container) return;
    var key = brandKey(slug, brand.name);
    var reviews = state.reviews[key] || [];

    var html = '<div class="reviews-container">';

    // Existing reviews
    if (reviews.length > 0) {
      // Aggregate scores
      var avgScores = {};
      RATING_CATEGORIES.forEach(function(c) { avgScores[c.key] = { total: 0, count: 0 }; });
      reviews.forEach(function(r) {
        if (r.scores) {
          Object.keys(r.scores).forEach(function(k) {
            if (avgScores[k]) {
              avgScores[k].total += r.scores[k];
              avgScores[k].count += 1;
            }
          });
        }
      });

      // Show community aggregate
      var totalAvg = 0;
      var catCount = 0;
      html += '<div class="community-ratings">' +
        '<h4><i class="fas fa-users"></i> Community Ratings (' + reviews.length + ' review' + (reviews.length > 1 ? 's' : '') + ')</h4>' +
        '<div class="community-bars">';
      RATING_CATEGORIES.forEach(function(c) {
        var avg = avgScores[c.key].count > 0 ? Math.round(avgScores[c.key].total / avgScores[c.key].count) : 0;
        totalAvg += avg;
        catCount++;
        var v = getVerdictLabel(avg);
        html += '<div class="community-bar-row">' +
          '<span class="community-bar-label"><i class="fas ' + c.icon + '"></i> ' + c.label + '</span>' +
          '<div class="community-bar-track"><div class="community-bar-fill ' + v.cls + '" style="width:' + avg + '%"></div></div>' +
          '<span class="community-bar-value ' + v.cls + '">' + avg + '</span>' +
        '</div>';
      });
      var overallAvg = catCount > 0 ? Math.round(totalAvg / catCount) : 0;
      var ov = getVerdictLabel(overallAvg);
      html += '</div>' +
        '<div class="community-overall">Community Average: <span class="' + ov.cls + '">' + overallAvg + '/100 — ' + ov.text + '</span></div>' +
      '</div>';

      // Individual reviews
      reviews.forEach(function(r) {
        var rAvg = 0;
        var rCount = 0;
        if (r.scores) {
          Object.keys(r.scores).forEach(function(k) { rAvg += r.scores[k]; rCount++; });
        }
        var userAvg = rCount > 0 ? Math.round(rAvg / rCount) : 0;
        var uv = getVerdictLabel(userAvg);
        html += '<div class="review-card">' +
          '<div class="review-header">' +
            '<span class="review-user">' + escapeHtml(r.user) + '</span>' +
            '<div class="review-meta">' +
              '<span class="review-avg ' + uv.cls + '">' + userAvg + '/100</span>' +
              '<span class="review-date">' + escapeHtml(r.date) + '</span>' +
            '</div>' +
          '</div>';
        // Mini category bars
        if (r.scores) {
          html += '<div class="review-mini-bars">';
          RATING_CATEGORIES.forEach(function(c) {
            var sc = r.scores[c.key] || 0;
            var sv = getVerdictLabel(sc);
            html += '<div class="mini-bar-row">' +
              '<span class="mini-bar-label">' + c.label + '</span>' +
              '<div class="mini-bar-track"><div class="mini-bar-fill ' + sv.cls + '" style="width:' + sc + '%"></div></div>' +
              '<span class="mini-bar-val ' + sv.cls + '">' + sc + '</span>' +
            '</div>';
          });
          html += '</div>';
        }
        if (r.text) {
          html += '<p class="review-text">' + escapeHtml(r.text) + '</p>';
        }
        html += '</div>';
      });
    } else {
      html += '<div class="empty-tab">' +
        '<i class="fas fa-comment-dots" style="font-size:24px;margin-bottom:8px;display:block;"></i>' +
        'No reviews yet. Be the first to share your experience.' +
      '</div>';
    }

    // GoNoGo 6-category review form
    html += '<div class="review-form" id="reviewForm">' +
      '<h4><i class="fas fa-pen-to-square"></i> Rate This Brand</h4>' +
      '<p class="review-form-subtitle">Rate across all 6 GoNoGo categories (0–100)</p>' +
      '<div class="form-group">' +
        '<label>Your Name</label>' +
        '<input type="text" id="reviewName" placeholder="Enter your name" maxlength="50">' +
      '</div>';

    // 6 category sliders
    RATING_CATEGORIES.forEach(function(c) {
      html += '<div class="rating-slider-group" data-cat="' + c.key + '">' +
        '<div class="slider-header">' +
          '<label><i class="fas ' + c.icon + '"></i> ' + c.label + '</label>' +
          '<span class="slider-value" id="val_' + c.key.replace(/[\s&]/g, '_') + '">0</span>' +
        '</div>' +
        '<input type="range" class="gonogo-slider" id="slider_' + c.key.replace(/[\s&]/g, '_') + '" min="0" max="100" value="0" data-cat="' + c.key + '">' +
        '<div class="slider-labels">' +
          '<span class="slider-label-nogo">NO GO</span>' +
          '<span class="slider-label-caution">CAUTION</span>' +
          '<span class="slider-label-go">GO</span>' +
        '</div>' +
      '</div>';
    });

    html += '<div class="form-group">' +
        '<label>Your Review (optional)</label>' +
        '<textarea id="reviewText" placeholder="Share your experience with this brand..." maxlength="500"></textarea>' +
      '</div>' +
      '<button class="form-submit" onclick="submitReview()"><i class="fas fa-paper-plane"></i> Submit Review</button>' +
      '<div class="review-success" id="reviewSuccess"><i class="fas fa-check-circle"></i> Thank you! Your review has been added.</div>' +
    '</div>';

    html += '</div>';
    container.innerHTML = html;

    resetCategoryRatings();
    setupSliders();
  }

  function setupSliders() {
    $$('.gonogo-slider').forEach(function(slider) {
      slider.addEventListener('input', function() {
        var cat = this.getAttribute('data-cat');
        var val = parseInt(this.value);
        categoryRatings[cat] = val;
        var valEl = $('#val_' + cat.replace(/[\s&]/g, '_'));
        if (valEl) valEl.textContent = val;
        updateSliderColor(this, val);
      });
      updateSliderColor(slider, 0);
    });
  }

  function updateSliderColor(slider, val) {
    var color = val >= 80 ? '#11a551' : val >= 55 ? '#ff9800' : '#e74c3c';
    var pct = val + '%';
    slider.style.setProperty('--slider-pct', pct);
    slider.style.setProperty('--slider-color', color);
  }

  window.submitReview = function() {
    var name = ($('#reviewName').value || '').trim();
    var text = ($('#reviewText').value || '').trim();
    if (!name) {
      alert('Please enter your name.');
      return;
    }

    // Check at least one category has been rated
    var hasRating = false;
    Object.keys(categoryRatings).forEach(function(k) {
      if (categoryRatings[k] > 0) hasRating = true;
    });
    if (!hasRating) {
      alert('Please rate at least one category.');
      return;
    }

    var brand = state.modalBrand;
    var slug = state.modalCategorySlug;
    if (!brand || !slug) return;

    var key = brandKey(slug, brand.name);
    if (!state.reviews[key]) state.reviews[key] = [];

    var now = new Date();
    var dateStr = now.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });

    // Deep copy scores
    var scores = {};
    Object.keys(categoryRatings).forEach(function(k) { scores[k] = categoryRatings[k]; });

    state.reviews[key].push({
      user: name,
      scores: scores,
      text: text,
      date: dateStr
    });

    // Post to API for persistent storage
    postReviewToAPI(slug, brand.name, { user: name, scores: scores, text: text });

    $('#reviewSuccess').style.display = 'block';
    $('#reviewName').value = '';
    $('#reviewText').value = '';
    resetCategoryRatings();
    $$('.gonogo-slider').forEach(function(s) {
      s.value = 0;
      updateSliderColor(s, 0);
    });
    $$('.slider-value').forEach(function(el) { el.textContent = '0'; });

    setTimeout(function() {
      // Fetch fresh from API to ensure consistency
      fetchReviewsFromAPI(slug, brand.name);
    }, 1500);
  };

  // === API INTEGRATION ===

  function fetchReviewsFromAPI(slug, brandName) {
    var key = brandKey(slug, brandName);
    fetch(API_BASE + '/api/reviews?category=' + encodeURIComponent(slug) + '&brand=' + encodeURIComponent(brandName))
      .then(function(res) { return res.json(); })
      .then(function(data) {
        // Convert API format to internal format
        state.reviews[key] = data.map(function(r) {
          return {
            user: r.reviewer_name,
            scores: r.scores,
            text: r.review_text,
            date: r.created_at
          };
        });
        // Re-render reviews tab if still on the same brand
        if (state.modalBrand && state.modalBrand.name === brandName) {
          renderReviewsTab(state.modalBrand, slug);
        }
      })
      .catch(function(err) {
        console.log('Reviews API not available, using local state:', err.message);
      });
  }

  function postReviewToAPI(slug, brandName, reviewData) {
    return fetch(API_BASE + '/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: slug,
        brand_name: brandName,
        reviewer_name: reviewData.user,
        scores: reviewData.scores,
        review_text: reviewData.text || ''
      })
    })
    .then(function(res) { return res.json(); })
    .catch(function(err) {
      console.log('Failed to post review to API:', err.message);
    });
  }

  // === MODAL TAB SWITCHING ===

  function setModalTab(tabId) {
    $$('.modal-tab').forEach(function(t) {
      t.classList.toggle('active', t.getAttribute('data-tab') === tabId);
    });
    var tabs = { framework: '#tabFramework', features: '#tabFeatures', strengths: '#tabStrengths', reviews: '#tabReviews' };
    Object.keys(tabs).forEach(function(key) {
      var el = $(tabs[key]);
      if (el) el.classList.toggle('active', key === tabId);
    });
    if (tabId === 'framework') {
      setTimeout(function() { animateFrameworkBars(); }, 50);
    }
  }

  window.switchModalTab = function(tabId) {
    setModalTab(tabId);
  };

  window.closeModal = function() {
    var overlay = $('#modalOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  window.closeModalOutside = function(e) {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Close modal on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // === SCROLL ANIMATION (Intersection Observer) ===
  function setupScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    $$('.animate-in').forEach(function(el) {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }

  // === INIT ===
  function init() {
    renderMethodology();
    renderCategories();
    setupScrollAnimations();

    // Set up tab click handlers directly on tab buttons (not via document delegation)
    $$('.modal-tab').forEach(function(tab) {
      tab.addEventListener('click', function(e) {
        e.stopPropagation();
        var tabId = this.getAttribute('data-tab');
        setModalTab(tabId);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
