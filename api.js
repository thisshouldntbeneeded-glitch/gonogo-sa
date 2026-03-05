// GoNoGo SA — Dual-Mode API Client
// Mode 1: Live backend (Perplexity Computer) — full read/write
// Mode 2: Static fallback (Vercel/GitHub Pages) — read-only from BRAND_DATA

var GoNoGoAPI = (function() {
  // Detect environment: __PORT_8000__ gets replaced at deploy time on Perplexity Computer
  var rawBase = '__PORT_8000__';
  var hasBackend = rawBase.indexOf('__PORT_') === -1; // true if placeholder was replaced
  var API_BASE = hasBackend ? rawBase : null;

  // Public interface
  return {
    hasBackend: hasBackend,

    // GET /api/brands — returns array of brand objects
    getBrands: function(callback) {
      if (!hasBackend) {
        // Static fallback: use BRAND_DATA from data files
        if (typeof BRAND_DATA !== 'undefined') {
          callback(null, BRAND_DATA);
        } else {
          callback(new Error('No backend and BRAND_DATA not loaded'), null);
        }
        return;
      }
      fetch(API_BASE + '/api/brands')
        .then(function(r) { return r.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(err) { callback(err, null); });
    },

    // GET /api/brand/:slug
    getBrand: function(slug, callback) {
      if (!hasBackend) {
        if (typeof BRAND_DATA !== 'undefined') {
          var brand = BRAND_DATA.find(function(b) { return b.slug === slug; });
          callback(brand ? null : new Error('Brand not found'), brand || null);
        } else {
          callback(new Error('No backend and BRAND_DATA not loaded'), null);
        }
        return;
      }
      fetch(API_BASE + '/api/brand/' + slug)
        .then(function(r) { return r.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(err) { callback(err, null); });
    },

    // GET /api/categories
    getCategories: function(callback) {
      if (!hasBackend) {
        if (typeof BRAND_DATA !== 'undefined') {
          // Extract unique categories from BRAND_DATA
          var cats = {};
          BRAND_DATA.forEach(function(b) {
            if (b.category && !cats[b.category]) {
              cats[b.category] = { name: b.category, slug: b.category.toLowerCase().replace(/\s+/g, '-') };
            }
          });
          callback(null, Object.values(cats));
        } else {
          callback(new Error('No backend and BRAND_DATA not loaded'), null);
        }
        return;
      }
      fetch(API_BASE + '/api/categories')
        .then(function(r) { return r.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(err) { callback(err, null); });
    },

    // POST /api/review — submit a review
    submitReview: function(reviewData, callback) {
      if (!hasBackend) {
        // Static hosting: cannot write, show friendly message
        callback(new Error('STATIC_HOSTING'), null);
        return;
      }
      fetch(API_BASE + '/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      })
        .then(function(r) { return r.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(err) { callback(err, null); });
    },

    // GET /api/admin/reviews — requires admin token
    getAdminReviews: function(token, callback) {
      if (!hasBackend) {
        callback(new Error('STATIC_HOSTING'), null);
        return;
      }
      fetch(API_BASE + '/api/admin/reviews', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
        .then(function(r) { return r.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(err) { callback(err, null); });
    },

    // POST /api/admin/approve/:id
    approveReview: function(id, token, callback) {
      if (!hasBackend) {
        callback(new Error('STATIC_HOSTING'), null);
        return;
      }
      fetch(API_BASE + '/api/admin/approve/' + id, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token }
      })
        .then(function(r) { return r.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(err) { callback(err, null); });
    },

    // POST /api/admin/reject/:id
    rejectReview: function(id, token, callback) {
      if (!hasBackend) {
        callback(new Error('STATIC_HOSTING'), null);
        return;
      }
      fetch(API_BASE + '/api/admin/reject/' + id, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token }
      })
        .then(function(r) { return r.json(); })
        .then(function(data) { callback(null, data); })
        .catch(function(err) { callback(err, null); });
    }
  };
})();
