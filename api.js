// GoNoGo SA - Final Fixed API Client
// Properly returns static data from window functions

var GoNoGoAPI = (function() {
  var API_BASE = '';
  var _backendAvailable = false;

  // Simple backend check
  function checkBackend() {
    return Promise.resolve(false); // Always use static mode
  }

  return {
    isLive: function() { 
      return false; 
    },

    getCategoriesWithBrands: function() {
      console.log('API: getCategoriesWithBrands called');
      return checkBackend().then(function(available) {
        console.log('API: backend available?', available);
        if (!available && typeof window.getCategoriesWithBrands === 'function') {
          console.log('API: calling window.getCategoriesWithBrands');
          var result = window.getCategoriesWithBrands();
          console.log('API: got result:', result ? result.length : 'undefined');
          return result; // RETURN the result!
        }
        return [];
      });
    },

    getTopBrands: function(count) {
      console.log('API: getTopBrands called');
      return checkBackend().then(function(available) {
        console.log('API: backend available?', available);
        if (!available && typeof window.getTopBrands === 'function') {
          console.log('API: calling window.getTopBrands');
          var result = window.getTopBrands(count || 6);
          console.log('API: got result:', result ? result.length : 'undefined');
          return result; // RETURN the result!
        }
        return [];
      });
    },

    getAllBrands: function() {
      return checkBackend().then(function(available) {
        if (!available && typeof window.getAllBrands === 'function') {
          return window.getAllBrands();
        }
        return [];
      });
    },

    getBrandsByCategory: function(slug) {
      return checkBackend().then(function(available) {
        if (!available && typeof window.getBrandsByCategory === 'function') {
          return window.getBrandsByCategory(slug);
        }
        return [];
      });
    },

    getBrandById: function(id) {
      return checkBackend().then(function(available) {
        if (!available && typeof window.getBrandById === 'function') {
          return window.getBrandById(id);
        }
        return null;
      });
    },

    getStats: function() {
      return checkBackend().then(function(available) {
        if (!available && typeof BRAND_DATA !== 'undefined') {
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
          return {
            totalCategories: BRAND_DATA.length,
            totalBrands: totalBrands,
            averageScore: totalBrands > 0 ? Math.round(totalScore / totalBrands * 10) / 10 : 0
          };
        }
        return {};
      });
    }
  };
})();

console.log('GoNoGoAPI loaded:', typeof GoNoGoAPI);
console.log('Testing API call...');
GoNoGoAPI.getCategoriesWithBrands().then(function(result) {
  console.log('API test complete. Result:', result ? result.length + ' categories' : 'FAILED');
});
