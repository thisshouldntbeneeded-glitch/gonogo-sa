// GoNoGo SA — API Client (Supabase Edition)
// Brand data = static from data.js/helpers.js
// Reviews = Supabase 'reviews' table
var GoNoGoAPI = (function () {
  'use strict';

  // =============================================
  // SUPABASE CONFIG (Customer Ratings project)
  // =============================================
  var SUPABASE_URL = 'https://kkpbzttwljxvyjbvggqr.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_y5JnEvpF37HMKB2rcWbrog_6Oe0KYJW';

  // -- Supabase REST helper --
  function supabaseRequest(path, options) {
    options = options || {};
    var url = SUPABASE_URL + '/rest/v1/' + path;
    var headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      'Prefer': options.prefer || 'return=representation'
    };
    return fetch(url, {
      method: options.method || 'GET',
      headers: headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    }).then(function (r) {
      if (!r.ok) {
        return r.text().then(function (t) {
          console.error('Supabase error:', r.status, t);
          throw new Error('Supabase request failed: ' + r.status);
        });
      }
      var ct = r.headers.get('content-type') || '';
      if (ct.indexOf('json') !== -1) return r.json();
      return r.text();
    });
  }

  return {

    // ==========================================
    // BRAND DATA — 100% static, from data.js + helpers.js
    // ==========================================

    isLive: function () { return true; },

    getCategoriesWithBrands: function () {
      return new Promise(function (resolve, reject) {
        try {
          if (typeof getCategoriesWithBrands === 'function') return resolve(getCategoriesWithBrands());
          reject(new Error('getCategoriesWithBrands not available'));
        } catch (e) { reject(e); }
      });
    },

    getCategories: function () { return this.getCategoriesWithBrands(); },

    getTopBrands: function (count) {
      return new Promise(function (resolve, reject) {
        try {
          if (typeof getTopBrands === 'function') return resolve(getTopBrands(count || 6));
          reject(new Error('getTopBrands not available'));
        } catch (e) { reject(e); }
      });
    },

    getAllBrands: function () {
      return new Promise(function (resolve, reject) {
        try {
          if (typeof getAllBrands === 'function') return resolve(getAllBrands());
          reject(new Error('getAllBrands not available'));
        } catch (e) { reject(e); }
      });
    },

    getBrandsByCategory: function (slug) {
      return new Promise(function (resolve, reject) {
        try {
          if (typeof getBrandsByCategory === 'function') return resolve(getBrandsByCategory(slug));
          reject(new Error('getBrandsByCategory not available'));
        } catch (e) { reject(e); }
      });
    },

    getBrandById: function (id) {
      return new Promise(function (resolve, reject) {
        try {
          if (typeof getBrandById === 'function') return resolve(getBrandById(id));
          reject(new Error('getBrandById not available'));
        } catch (e) { reject(e); }
      });
    },

    getStats: function () {
      return new Promise(function (resolve, reject) {
        try {
          if (typeof BRAND_DATA === 'undefined') return reject(new Error('BRAND_DATA not available'));
          var totalBrands = 0, totalScore = 0;
          var goCount = 0, cautionCount = 0, nogoCount = 0;
          BRAND_DATA.forEach(function (c) {
            if (c.brands) c.brands.forEach(function (b) {
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
          resolve({
            totalCategories: BRAND_DATA.length,
            totalBrands: totalBrands,
            totalReviews: 0,
            averageScore: totalBrands > 0 ? Math.round((totalScore / totalBrands) * 10) / 10 : 0,
            goCount: goCount,
            cautionCount: cautionCount,
            nogoCount: nogoCount
          });
        } catch (e) { reject(e); }
      });
    },

    // ==========================================
    // REVIEWS — Supabase 'reviews' table
    // Columns: id, brand_name, category_slug, reviewer_name,
    //          review_text, status, moderated_by, created_at
    // ==========================================

    submitReview: function (reviewData) {
      var newReview = {
        brand_name: reviewData.brandName || reviewData.brand_name || reviewData.brandname || '',
        category_slug: reviewData.categorySlug || reviewData.category_slug || reviewData.category || '',
        reviewer_name: reviewData.reviewerName || reviewData.reviewer_name || reviewData.reviewername || '',
        review_text: reviewData.reviewText || reviewData.review_text || reviewData.reviewtext || '',
        status: 'pending'
      };
      return supabaseRequest('reviews', {
        method: 'POST',
        body: newReview,
        prefer: 'return=representation'
      }).then(function () {
        return { ok: true, status: 'pending', message: 'Review submitted — it will appear after approval.' };
      });
    },

    getReviews: function (brandName) {
      var query = 'reviews?brand_name=eq.' + encodeURIComponent(brandName)
        + '&status=eq.approved&order=created_at.desc';
      return supabaseRequest(query).then(function (data) {
        return (data || []).map(function (r) {
          return {
            id: r.id,
            category: r.category_slug,
            brandname: r.brand_name,
            reviewername: r.reviewer_name,
            reviewtext: r.review_text,
            date: r.created_at
              ? new Date(r.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
              : '',
            status: r.status
          };
        });
      }).catch(function () { return []; });
    },

    getReviewsForBrand: function (brandName) {
      return this.getReviews(brandName);
    },

    getAllReviews: function () {
      return supabaseRequest('reviews?order=created_at.desc')
        .then(function (data) {
          return (data || []).map(function (r) {
            return {
              id: r.id,
              category: r.category_slug,
              brandname: r.brand_name,
              brand_name: r.brand_name,
              BrandName: r.brand_name,
              reviewername: r.reviewer_name,
              ReviewerName: r.reviewer_name,
              reviewtext: r.review_text,
              ReviewText: r.review_text,
              createdat: r.created_at
                ? new Date(r.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
                : '',
              created_at: r.created_at,
              status: r.status,
              Status: r.status
            };
          });
        }).catch(function () { return []; });
    },

    moderateReview: function (reviewId, newStatus, moderatedBy) {
      return supabaseRequest('reviews?id=eq.' + encodeURIComponent(reviewId), {
        method: 'PATCH',
        body: {
          status: newStatus,
          moderated_by: moderatedBy || 'admin',
          moderated_at: new Date().toISOString()
        },
        prefer: 'return=representation'
      }).then(function () {
        return { ok: true, id: reviewId, status: newStatus };
      });
    }
  };
})();

console.log('GoNoGoAPI loaded (Supabase edition)');
