// GoNoGo SA — Dual-Mode API Client
// Mode 1: Live backend (Perplexity Computer) — full read/write
// Mode 2: Static fallback (Vercel/GitHub Pages) — read-only from BRAND_DATA

var GoNoGoAPI = (function() {
  // Detect environment: __PORT_8000__ gets replaced at deploy time on Perplexity Computer
  var rawBase = '__PORT_8000__';
  var hasBackend = rawBase.indexOf('__PORT_') === -1; // true if placeholder was replaced
  var API_BASE = hasBackend ? rawBase : '';
  var _cache = {};
  var _backendChecked = false;
  var _backendAvailable = false;

  // On static hosting, probe once to see if an API is reachable
  async function checkBackend() {
    if (hasBackend) { _backendAvailable = true; _backendChecked = true; return true; }
    if (_backendChecked) return _backendAvailable;
    _backendChecked = true;
    try {
      var controller = new AbortController();
      var timeoutId = setTimeout(function() { controller.abort(); }, 2000);
      var res = await fetch('/api/health', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        var data = await res.json();
        if (data && data.status === 'ok') {
          _backendAvailable = true;
          return true;
        }
      }
    } catch(e) { /* no backend */ }
    _backendAvailable = false;
    return false;
  }

  async function _fetch(endpoint) {
    if (_cache[endpoint]) return _cache[endpoint];
    await checkBackend();
    if (!_backendAvailable) return null;
    try {
      var res = await fetch(API_BASE + endpoint);
      if (!res.ok) throw new Error('API error: ' + res.status);
      var data = await res.json();
      _cache[endpoint] = data;
      return data;
    } catch (e) {
      console.warn('GoNoGoAPI fetch fallback for:', endpoint);
      return null;
    }
  }

  async function _post(endpoint, body) {
    await checkBackend();
    if (!_backendAvailable) throw new Error('Reviews require the live platform. Visit the GoNoGo SA platform to submit reviews.');
    try {
      var res = await fetch(API_BASE + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        var err = await res.json().catch(function() { return {}; });
        throw new Error(err.detail || 'API error: ' + res.status);
      }
      return await res.json();
    } catch (e) {
      console.error('GoNoGoAPI post error:', endpoint, e);
      throw e;
    }
  }

  async function _put(endpoint) {
    await checkBackend();
    if (!_backendAvailable) throw new Error('Admin actions require the live platform.');
    try {
      var res = await fetch(API_BASE + endpoint, { method: 'PUT' });
      if (!res.ok) throw new Error('API error: ' + res.status);
      return await res.json();
    } catch (e) {
      console.error('GoNoGoAPI put error:', endpoint, e);
      throw e;
    }
  }

  // ============================================================
  // BRAND DATA — API first, static fallback
  // ============================================================
  return {
    isLive: function() { return _backendAvailable; },

    async getCategories() {
      var data = await _fetch('/api/categories');
      if (data) return data;
      // Static fallback
      if (typeof getCategories === 'function') return getCategories();
      return [];
    },

    async getCategoriesWithBrands() {
      var data = await _fetch('/api/categories');
      if (data) return data.map(function(c) {
        return {
          id: c.id, name: c.name, icon: c.icon,
          brandCount: c.brandCount, hasBrands: c.brandCount > 0,
          scoringCategories: c.scoringCategories
        };
      });
      // Static fallback
      if (typeof getCategoriesWithBrands === 'function') return getCategoriesWithBrands();
      return [];
    },

    async getAllBrands() {
      var data = await _fetch('/api/brands');
      if (data) return data;
      if (typeof getAllBrands === 'function') return getAllBrands();
      return [];
    },

    async getBrandsByCategory(slug) {
      var data = await _fetch('/api/brands/' + slug);
      if (data) return data;
      if (typeof getBrandsByCategory === 'function') return getBrandsByCategory(slug);
      return [];
    },

    async getBrandById(id) {
  // Try backend first
  try {
    var data = await _fetch('/api/brand/' + id);
    if (data) return data;
  } catch (e) {
    // Backend unavailable, fall through to static
  }
  // Use static fallback from global scope
  if (typeof window.getBrandById === 'function') {
    return window.getBrandById(id);
  }
  return null;
}

    async getTopBrands(count) {
      var data = await _fetch('/api/top-brands?count=' + (count || 6));
      if (data) return data;
      if (typeof getTopBrands === 'function') return getTopBrands(count || 6);
      return [];
    },

    async getStats() {
      var data = await _fetch('/api/stats');
      if (data) return data;
      // Static fallback — compute full stats from BRAND_DATA
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
    },

    // ============================================================
    // REVIEWS — API only (no static fallback for write)
    // ============================================================
    async getReviews(brandName, categorySlug) {
      var data = await _fetch('/api/reviews?brand=' + encodeURIComponent(brandName) + '&category=' + encodeURIComponent(categorySlug));
      return data || [];
    },

    async getAllReviews() {
      var data = await _fetch('/api/reviews/all');
      return data || [];
    },

    async submitReview(data) {
      return await _post('/api/reviews', data);
    },

    async updateReviewStatus(reviewId, status) {
      return await _put('/api/reviews/' + reviewId + '/status?status=' + status);
    },

    async getReviewStats(brandName, categorySlug) {
      var data = await _fetch('/api/reviews/stats?brand=' + encodeURIComponent(brandName) + '&category=' + encodeURIComponent(categorySlug));
      return data || { count: 0 };
    },

    // ============================================================
    // ADMIN — API only
    // ============================================================
    async saveBrand(brandData) {
      return await _post('/api/admin/brand', brandData);
    },

    async triggerResearch(brandId) {
      return await _post('/api/admin/research/' + brandId, {});
    },

    async triggerBatchResearch(freshness, category) {
      var params = '?freshness=' + (freshness || 'outdated');
      if (category) params += '&category=' + category;
      return await _post('/api/admin/research-batch' + params, {});
    },

    async getResearchStatus(brandId) {
      if (brandId) return await _fetch('/api/admin/research/status/' + brandId);
      return await _fetch('/api/admin/research/status');
    },

    async reloadData() {
      return await _post('/api/admin/reload', {});
    }
  };
})();
