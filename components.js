// GoNoGo SA - Components (UNIFIED FOR STATIC DATA + ADMIN)

var Components = (function() {
  'use strict';

  // ---- Core utilities ----

  function getScoreColor(score) {
    if (score >= 80) return 'var(--green)';
    if (score >= 60) return 'var(--yellow)';
    return 'var(--red)';
  }

  function getParam(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  function sortData(arr, key, dir) {
    var copy = arr.slice();
    copy.sort(function(a, b) {
      var av = a[key], bv = b[key];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return dir === 'asc' ? -1 : 1;
      if (av > bv) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }

  function formatRelativeDate(dateStr) {
    if (!dateStr) return 'Not updated';
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    var now = new Date();
    var diffMs = now - d;
    var diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return diffDays + ' days ago';
    var diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return '1 month ago';
    return diffMonths + ' months ago';
  }

  function exportCSV(rows, filename) {
    if (!rows || !rows.length) return;
    var headers = Object.keys(rows[0]);
    var csv = headers.join(',') + '\n' +
      rows.map(function(r) {
        return headers.map(function(h) {
          var v = r[h] == null ? '' : String(r[h]);
          if (v.indexOf('"') !== -1 || v.indexOf(',') !== -1) {
            v = '"' + v.replace(/"/g, '""') + '"';
          }
          return v;
        }).join(',');
      }).join('\n');

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename || 'export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ---- Toasts ----

  function showToast(message, type) {
    type = type || 'info';
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var div = document.createElement('div');
    div.className = 'toast toast-' + type;
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(function() {
      div.classList.add('show');
    }, 10);
    setTimeout(function() {
      div.classList.remove('show');
      setTimeout(function() {
        if (div.parentNode) div.parentNode.removeChild(div);
      }, 300);
    }, 3500);
  }

  // ---- Public nav + footer ----

  function renderPublicNav(activeSlug) {
    return '<nav class="nav"><div class="container">' +
      '<a href="index.html" class="nav-brand"><i class="fa-solid fa-circle-check"></i> GoNoGo</a>' +
      '<div class="nav-links">' +
        '<a href="index.html" class="nav-link ' + (!activeSlug || activeSlug === 'home' ? 'active' : '') + '">Home</a>' +
        '<a href="category.html" class="nav-link">Industries</a>' +
        '<a href="about.html" class="nav-link">About</a>' +
      '</div>' +
    '</div></nav>';
  }

  function renderFooter() {
    return '<footer class="footer"><div class="container">' +
      '<div class="footer-content">' +
        '<div class="footer-brand"><i class="fa-solid fa-circle-check"></i> GoNoGo South Africa</div>' +
        '<p style="margin:var(--space-2) 0;color:var(--text-muted)">Evidence-based brand ratings for South African consumers</p>' +
        '<div style="margin-top:var(--space-4);color:var(--text-muted);font-size:var(--text-sm)">&copy; 2026 GoNoGo South Africa. All rights reserved.</div>' +
      '</div>' +
    '</div></footer>';
  }

  // ---- Brand visuals ----

  function renderLogo(brand, className) {
    className = className || 'brand-logo';
    var src = brand.logo || '';
    if (!src) {
      return '<div class="' + className + ' brand-logo-placeholder"><i class="fa-solid fa-building"></i></div>';
    }
    return '<img src="' + src + '" alt="' + brand.name + '" class="' + className + '">';
  }

  function renderScoreCircle(score, size) {
    var rawScore = score != null ? score : 0;
    var value = typeof rawScore === 'string' ? parseFloat(rawScore) : rawScore;
    if (!value || isNaN(value)) value = 0;

    var color = getScoreColor(value);
    var sizeClass = size === 'lg' ? 'score-circle-lg' : 'score-circle-md';

    return '<div class="score-circle ' + sizeClass + '" style="border-color:' + color + '">' +
      '<div class="score-value" style="color:' + color + '">' + value + '</div>' +
      '<div class="score-label">Score</div>' +
    '</div>';
  }

  function renderScoreBadge(score) {
    var color = getScoreColor(score || 0);
    return '<span class="score-badge" style="border-color:' + color + ';color:' + color + '">' +
      (score || 0) + '/100' +
    '</span>';
  }

  function renderVerdictBadge(verdict) {
    var v = (verdict || '').toUpperCase();
    var cls = 'badge-neutral';
    if (v === 'GO') cls = 'badge-go';
    else if (v === 'GO WITH CAUTION') cls = 'badge-caution';
    else if (v === 'NOGO') cls = 'badge-nogo';
    return '<span class="badge ' + cls + '">' + (v || 'N/A') + '</span>';
  }

  function renderScoreBar(score, max) {
    var pct = 0;
    if (max && max > 0) pct = Math.round((score || 0) / max * 100);
    var color = getScoreColor(pct);
    return '<div class="score-bar"><div class="score-bar-fill" style="width:' + pct + '%;background:' + color + '"></div></div>';
  }

  // ---- Brand card ----
  // Accept either raw BRAND_DATA brand or helper/API brand
  function renderBrandCard(brand, index) {
    // Normalise score
    var rawScore = brand.overallScore != null
      ? brand.overallScore
      : (brand.gonogo_score || brand.gonogoScore || 0);
    var score = typeof rawScore === 'string' ? parseFloat(rawScore) : rawScore;
    if (!score || isNaN(score)) score = 0;

    var color = getScoreColor(score);
    var verdict = brand.verdict || (score >= 80 ? 'GO' : score >= 60 ? 'GO WITH CAUTION' : 'NOGO');
    var categoryName = brand.categoryName || brand.category || '';

    var ratingSummary = brand.ratingSummary || '';
    var summaryHtml = ratingSummary
      ? '<p class="brand-summary">' + ratingSummary + '</p>'
      : '';

    var logoHtml = renderLogo(brand, 'brand-logo-lg');

    return (
      '<div class="brand-card" onclick="window.location.href=\'brand.html?id=' + brand.id + '\'">' +
        '<div class="brand-card-top">' +
          '<div class="brand-card-info">' +
            '<div class="brand-card-name">' + brand.name + '</div>' +
            '<div class="brand-card-meta">' +
              '<span>' + categoryName + '</span>' +
              '<span style="color:' + color + ';">' + score + '/100</span>' +
            '</div>' +
          '</div>' +
          '<div class="brand-card-score">' +
            logoHtml +
            '<div class="badge-score ' +
              (score >= 80 ? 'score-high' : score >= 60 ? 'score-mid' : 'score-low') +
            '">' + verdict + '</div>' +
          '</div>' +
        '</div>' +
        summaryHtml +
        '<div class="brand-card-chart">' +
          '<canvas id="radar-' + brand.id + '"></canvas>' +
        '</div>' +
        '<div class="brand-card-stats">' +
          '<span><i class="fa-solid fa-gauge-high"></i> Overall score</span>' +
          '<span><i class="fa-solid fa-scale-balanced"></i> Weighted by category</span>' +
        '</div>' +
      '</div>'
    );
  }

  // ---- Radar chart ----

  function createRadarChart(canvasId, brand, options) {
    options = options || {};
    var canvas = document.getElementById(canvasId);
    if (!canvas || !window.Chart) return;

    var labels = [];
    var data = [];

    // Prefer explicit categoryScores: { Compliance: {score, max}, ... }
    if (brand.categoryScores && Object.keys(brand.categoryScores).length) {
      Object.keys(brand.categoryScores).forEach(function(name) {
        var cs = brand.categoryScores[name];
        if (!cs || !cs.max) return;
        labels.push(name);
        data.push(Math.round((cs.score / cs.max) * 100)); // % of that category's max
      });
    } else {
      // Fallback to precomputed percentage scores if present
      var scores = brand.scores || {};
      labels = Object.keys(scores);
      data = Object.values(scores).map(function(v) {
        var n = typeof v === 'string' ? parseFloat(v) : v;
        return isNaN(n) ? 0 : Math.round(n);
      });

      if (!labels.length && typeof calculatePercentageScores === 'function') {
        scores = calculatePercentageScores(brand);
        labels = Object.keys(scores);
        data = Object.values(scores).map(function(v) {
          var n = typeof v === 'string' ? parseFloat(v) : v;
          return isNaN(n) ? 0 : Math.round(n);
        });
      }
    }

    if (!labels.length) {
      labels = ['No data'];
      data = [0];
    }

    // Overall score for colour
    var overallRaw = brand.overallScore != null
      ? brand.overallScore
      : (brand.gonogo_score || brand.gonogoScore || 0);
    var overall = typeof overallRaw === 'string' ? parseFloat(overallRaw) : overallRaw;
    if (!overall || isNaN(overall)) overall = 0;

    var borderColor, fillColor;
    if (overall >= 80) {
      borderColor = '#11a551';           // green
      fillColor   = 'rgba(17,165,81,0.18)';
    } else if (overall >= 60) {
      borderColor = '#ff9800';           // amber
      fillColor   = 'rgba(255,152,0,0.18)';
    } else {
      borderColor = '#e74c3c';           // red
      fillColor   = 'rgba(231,76,60,0.18)';
    }

    new Chart(canvas, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: fillColor,
          borderColor: borderColor,
          borderWidth: 2,
          pointBackgroundColor: borderColor,
          pointBorderColor: '#ffffff',
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: borderColor,
          pointRadius: options.pointRadius || 3,
          pointHoverRadius: (options.pointRadius || 3) + 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              display: options.showTicks !== false,
              stepSize: 20,
              color: '#666',
              backdropColor: 'rgba(0,0,0,0)'
            },
            grid: {
              color: 'rgba(255,255,255,0.08)',
              circular: false
            },
            angleLines: {
              color: 'rgba(255,255,255,0.08)'
            },
            pointLabels: {
              font: {
                size: options.labelSize || 11
              },
              color: '#a0a0a0'
            }
          }
        }
      }
    });
  }

  // ---- Admin helpers ----

  function renderAdminSidebar(active) {
    return '' +
      '<aside class="admin-sidebar">' +
        '<div class="admin-logo"><i class="fa-solid fa-circle-check"></i> GoNoGo</div>' +
        '<nav class="admin-nav">' +
          '<a href="admin.html" class="admin-nav-item ' + (active === 'dashboard' ? 'active' : '') + '">' +
            '<i class="fa-solid fa-chart-line"></i> Dashboard</a>' +
          '<a href="admin-brands.html" class="admin-nav-item ' + (active === 'brands' ? 'active' : '') + '">' +
            '<i class="fa-solid fa-building"></i> Brands</a>' +
          '<a href="admin-comments.html" class="admin-nav-item ' + (active === 'comments' ? 'active' : '') + '">' +
            '<i class="fa-solid fa-comments"></i> Reviews</a>' +
          '<a href="index.html" class="admin-nav-item">' +
            '<i class="fa-solid fa-arrow-left"></i> Back to site</a>' +
        '</nav>' +
      '</aside>';
  }

  function checkAdminAuth() {
    // For now, always allow; can be replaced with real auth later.
    return true;
  }

  return {
    // Utilities
    getParam: getParam,
    getScoreColor: getScoreColor,
    sortData: sortData,
    formatRelativeDate: formatRelativeDate,
    exportCSV: exportCSV,
    showToast: showToast,

    // Public UI
    renderPublicNav: renderPublicNav,
    renderFooter: renderFooter,
    renderLogo: renderLogo,
    renderScoreCircle: renderScoreCircle,
    renderScoreBadge: renderScoreBadge,
    renderVerdictBadge: renderVerdictBadge,
    renderScoreBar: renderScoreBar,
    renderBrandCard: renderBrandCard,
    createRadarChart: createRadarChart,

    // Admin UI
    renderAdminSidebar: renderAdminSidebar,
    checkAdminAuth: checkAdminAuth
  };
})();

console.log('Components loaded successfully');
