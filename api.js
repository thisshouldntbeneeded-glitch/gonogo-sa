// GoNoGo SA - API Client (PROPERLY FIXED)
var GoNoGoAPI = (function() {
  'use strict';

  var API_BASE = '';

  function checkBackend() {
    // Always return false to use static mode
    return Promise.resolve(false);
  }

  return {
    isLive: function() {
      return false;
    },

    getCategoriesWithBrands: function() {
      return new Promise(function(resolve, reject) {
        try {
          if (typeof window.getCategoriesWithBrands !== 'function') {
            reject(new Error('getCategoriesWithBrands not available'));
            return;
          }
          var result = window.getCategoriesWithBrands();
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    },

    getCategories: function() {
      // Alias for getCategoriesWithBrands
      return this.getCategoriesWithBrands();
    },

    getTopBrands: function(count) {
      return new Promise(function(resolve, reject) {
        try {
          if (typeof window.getTopBrands !== 'function') {
            reject(new Error('getTopBrands not available'));
            return;
          }
          var result = window.getTopBrands(count || 6);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    },

    getAllBrands: function() {
      return new Promise(function(resolve, reject) {
        try {
          if (typeof window.getAllBrands !== 'function') {
            reject(new Error('getAllBrands not available'));
            return;
          }
          var result = window.getAllBrands();
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    },

    getBrandsByCategory: function(slug) {
      return new Promise(function(resolve, reject) {
        try {
          if (typeof window.getBrandsByCategory !== 'function') {
            reject(new Error('getBrandsByCategory not available'));
            return;
          }
          var result = window.getBrandsByCategory(slug);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    },

    getBrandById: function(id) {
      return new Promise(function(resolve, reject) {
        try {
          if (typeof window.getBrandById !== 'function') {
            reject(new Error('getBrandById not available'));
            return;
          }
          var result = window.getBrandById(id);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    },

    getStats: function() {
      return new Promise(function(resolve, reject) {
        try {
          if (typeof BRAND_DATA === 'undefined') {
            reject(new Error('BRAND_DATA not available'));
            return;
          }
          var totalBrands = 0;
          var totalScore = 0;
          BRAND_DATA.forEach(function(c) {
            if (c.brands) {
              c.brands.forEach(function(b) {
                totalBrands++;
                totalScore += b.gonogo_score || 0;
              });
            }
          });
          resolve({
            totalCategories: BRAND_DATA.length,
            totalBrands: totalBrands,
            averageScore: totalBrands > 0 ? Math.round(totalScore / totalBrands * 10) / 10 : 0
          });
        } catch (e) {
          reject(e);
        }
      });
    }
  };
})();

console.log('GoNoGoAPI loaded successfully');
