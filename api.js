// GoNoGo SA — Dual-Mode API Client (No async/await version)
// Mode 1: Live backend (Perplexity Computer) — full read/write
// Mode 2: Static fallback (Vercel/GitHub Pages) — read-only from BRAND_DATA

var GoNoGoAPI = (function() {
  // Detect environment
  var rawBase = '__PORT_8000__';
  var hasBackend = rawBase.indexOf('__PORT_') === -1;
  var API_BASE = hasBackend ? rawBase : '';
  var _cache = {};
  var _backendChecked = false;
  var _backendAvailable = false;

  function checkBackend() {
    if (hasBackend) { 
      _backendAvailable = true; 
      _backendChecked = true; 
      return Promise.resolve(true); 
    }
    if (_backendChecked) return Promise.resolve(_backendAvailable);
    _backendChecked = true;

    return new Promise(function(resolve) {
      var controller = new AbortController ? new AbortController() : null;
      var timeoutId = setTimeout(function() { 
        if (controller) controller.abort(); 
        _backendAvailable = false;
        resolve(false);
      }, 2000);

      fetch('/api/health', controller ? { signal: controller.signal } : {})
        .then(function(res) {
          clearTimeout(timeoutId);
          if (res.ok) {
            return res.json();
          }
          throw new Error('Not ok');
        })
        .then(function(data) {
          if (data && data.status === 'ok') {
            _backendAvailable = true;
            resolve(true);
          } else {
            _backendAvailable = false;
            resolve(false);
          }
        })
        .catch(function() {
          clearTimeout(timeoutId);
          _backendAvailable = false;
          resolve(false);
        });
    });
  }

  function _fetch(endpoint) {
    if (_cache[endpoint]) return Promise.resolve(_cache[endpoint]);

    return checkBackend().then(function(available) {
      if (!available) return null;
      return fetch(API_BASE + endpoint)
        .then(function(res) {
          if (!res.ok) throw new Error('API error: ' + res.status);
          return res.json();
        })
        .then(function(data) {
          _cache[endpoint] = data;
          return data;
        })
        .catch(function(e) {
          console.warn('GoNoGoAPI fetch fallback for:', endpoint);
          return null;
        });
    });
  }

  return {
    isLive: function() { return _backendAvailable; },

    getCategories: function() {
      return _fetch('/api/categories').then(function(data) {
        if (data) return data;
        if (typeof getCategories === 'function') return getCategories();
        return [];
      });
    },

    getCategoriesWithBrands: function() {
      return _fetch('/api/categories').then(function(data) {
        if (data) {
          return data.map(function(c) {
            return {
              id: c.id, 
              name: c.name, 
              icon: c.icon,
              brandCount: c.brandCount, 
              hasBrands: c.brandCount > 0,
              scoringCategories: c.scoringCategories
            };
          });
        }
        // Static fallback
        if (typeof getCategoriesWithBrands === 'function') {
          return getCategoriesWithBrands();
        }
        return [];
      });
    },

    getAllBrands: function() {
      return _fetch('/api/brands').then(function(data) {
        if (data) return data;
        if (typeof getAllBrands === 'function') return getAllBrands();
        return [];
      });
    },

    getBrandsByCategory: function(slug) {
      return _fetch('/api/brands/' + slug).then(function(data) {
        if (data) return data;
        if (typeof getBrandsByCategory === 'function') return getBrandsByCategory(slug);
        return [];
      });
    },

    getBrandById: function(id) {
      return _fetch('/api/brand/' + id).then(function(data) {
        if (data) return data;
        if (typeof window.getBrandById === 'function') {
          return window.getBrandById(id);
        }
        return null;
      }).catch(function() {
        if (typeof window.getBrandById === 'function') {
          return window.getBrandById(id);
        }
        return null;
      });
    },

    getTopBrands: function(count) {
      return _fetch('/api/top-brands?count=' + (count || 6)).then(function(data) {
        if (data) return data;
        if (typeof getTopBrands === 'function') return getTopBrands(count || 6);
        return [];
      });
    },

    getStats: function() {
      return _fetch('/api/stats').then(function(data) {
        if (data) return data;
        // Static fallback
        if (typeof BRAND_DATA !== 'undefined') {
          var totalBrands = 0;
          var goCount = 0;
          var cautionCount = 0;
          var nogoCount = 0;
          var totalScore = 0;
          BRAND_DATA.forEach(function(c) {
            c.brands.forEach(function(b) {
              totalBrands++;
              var score = b.gonogo_score || 0;
              totalScore += score;
              var verdict = (b.verdict || '').toUpperCase().trim();
              if (verdict === 'CAUTION') verdict = 'GO WITH CAUTION';
              if (verdict === 'GO') goCount++;
              else if (verdict === 'GO WITH CAUTION') cautionCount++;
              else if (verdict === 'NOGO') nogoCount++;
              else if (score >= 80) goCount++;
              else if (score >= 60) cautionCount++;
              else nogoCount++;
            });
          });
          return {
            totalCategories: BRAND_DATA.length,
            totalBrands: totalBrands,
            totalReviews: 0,
            averageScore: totalBrands > 0 ? Math.round(totalScore / totalBrands * 10) / 10 : 0,
            goCount: goCount,
            cautionCount: cautionCount,
            nogoCount: nogoCount
          };
        }
        return {};
      });
    }
  };
})();

console.log('GoNoGoAPI loaded:', typeof GoNoGoAPI);
