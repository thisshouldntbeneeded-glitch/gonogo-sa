// GoNoGo SA - Components (FIXED FOR REAL DATA)

var Components = (function() {
  'use strict';

  // Missing helper function for score colors
  function getScoreColor(score) {
    if (score >= 80) return 'var(--green)';
    if (score >= 60) return 'var(--yellow)';
    return 'var(--red)';
  }

  function getParam(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  function renderPublicNav(activeSlug) {
    return '<nav class="nav"><div class="container">' +
      '<a href="index.html" class="nav-brand"><i class="fa-solid fa-circle-check"></i> GoNoGo</a>' +
      '<div class="nav-links">' +
        '<a href="index.html" class="nav-link ' + (!activeSlug ? 'active' : '') + '">Home</a>' +
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

  function renderBrandCard(brand, index) {
    var color = getScoreColor(brand.overallScore);
    var verdict = brand.verdict || (brand.overallScore >= 80 ? 'GO' : brand.overallScore >= 60 ? 'CAUTION' : 'NOGO');

    return '<div class="brand-card">' +
      '<div class="brand-card-header">' +
        '<div class="brand-logo-wrapper">' +
          (brand.logo ? '<img src="' + brand.logo + '" alt="' + brand.name + '" class="brand-logo">' : 
           '<div class="brand-logo-placeholder"><i class="fa-solid fa-building"></i></div>') +
        '</div>' +
        '<div class="brand-info">' +
          '<h3 class="brand-name">' + brand.name + '</h3>' +
          '<p class="brand-category">' + (brand.category || '') + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="score-section">' +
        '<div class="score-circle" style="border-color:' + color + '">' +
          '<div class="score-value" style="color:' + color + '">' + brand.overallScore + '</div>' +
          '<div class="score-label">Score</div>' +
        '</div>' +
        '<div class="verdict-badge verdict-' + verdict.toLowerCase().replace(' ', '-') + '">' + verdict + '</div>' +
      '</div>' +
      '<div class="radar-wrapper"><canvas id="radar-' + brand.id + '"></canvas></div>' +
      '<div class="brand-details">' +
        '<a href="brand.html?id=' + brand.id + '" class="btn btn-primary btn-block">View Full Report</a>' +
      '</div>' +
    '</div>';
  }

  function createRadarChart(canvasId, brand, options) {
    options = options || {};
    var ctx = document.getElementById(canvasId);
    if (!ctx) return;

    var scores = brand.scores || {};
    var labels = Object.keys(scores);
    var data = Object.values(scores);

    if (labels.length === 0) {
      labels = ['N/A'];
      data = [0];
    }

    var color = getScoreColor(brand.overallScore);

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: color + '15',
          borderColor: color,
          borderWidth: 2,
          pointBackgroundColor: color,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: color,
          pointRadius: options.pointRadius || 3,
          pointHoverRadius: options.pointRadius ? options.pointRadius + 1 : 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
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
              font: { size: 10 }
            },
            grid: { color: 'rgba(0,0,0,0.1)' },
            pointLabels: {
              font: { size: options.labelSize || 11 }
            }
          }
        }
      }
    });
  }

  return {
    getParam: getParam,
    renderPublicNav: renderPublicNav,
    renderFooter: renderFooter,
    renderBrandCard: renderBrandCard,
    createRadarChart: createRadarChart,
    getScoreColor: getScoreColor
  };
})();

console.log('Components loaded successfully');
