// GoNoGo SA - Helpers (DEBUG VERSION - Ultra Simple)

console.log('helpers.js loading...');
console.log('BRAND_DATA exists?', typeof BRAND_DATA);
console.log('BRAND_DATA length:', Array.isArray(BRAND_DATA) ? BRAND_DATA.length : 'NOT ARRAY');

// Ultra simple - just return BRAND_DATA directly with minimal transformation
window.getCategoriesWithBrands = function() {
  console.log('getCategoriesWithBrands called, BRAND_DATA:', typeof BRAND_DATA);
  if (typeof BRAND_DATA === 'undefined' || !Array.isArray(BRAND_DATA)) {
    console.error('BRAND_DATA not available!');
    return [];
  }

  try {
    var result = BRAND_DATA.map(function(cat) {
      return {
        id: cat.slug || '',
        name: cat.category || '',
        icon: cat.icon || '',
        brandCount: (cat.brands && cat.brands.length) || 0,
        hasBrands: (cat.brands && cat.brands.length > 0) || false,
        scoringCategories: []
      };
    });
    console.log('getCategoriesWithBrands returning:', result.length, 'categories');
    return result;
  } catch (e) {
    console.error('Error in getCategoriesWithBrands:', e);
    return [];
  }
};

window.getTopBrands = function(count) {
  console.log('getTopBrands called, BRAND_DATA:', typeof BRAND_DATA);
  if (typeof BRAND_DATA === 'undefined' || !Array.isArray(BRAND_DATA)) {
    console.error('BRAND_DATA not available for getTopBrands!');
    return [];
  }

  try {
    var allBrands = [];
    BRAND_DATA.forEach(function(cat) {
      if (cat.brands && Array.isArray(cat.brands)) {
        cat.brands.forEach(function(brand) {
          allBrands.push(brand);
        });
      }
    });

    allBrands.sort(function(a, b) {
      return (b.gonogo_score || 0) - (a.gonogo_score || 0);
    });

    var result = allBrands.slice(0, count || 6);
    console.log('getTopBrands returning:', result.length, 'brands');
    return result;
  } catch (e) {
    console.error('Error in getTopBrands:', e);
    return [];
  }
};

// Add other functions
window.getAllBrands = function() {
  if (typeof BRAND_DATA === 'undefined') return [];
  var all = [];
  BRAND_DATA.forEach(function(c) {
    if (c.brands) c.brands.forEach(function(b) { all.push(b); });
  });
  return all;
};

window.getBrandsByCategory = function(slug) {
  if (typeof BRAND_DATA === 'undefined') return [];
  var cat = BRAND_DATA.find(function(c) { return c.slug === slug; });
  return (cat && cat.brands) || [];
};

window.getBrandById = function(id) {
  if (typeof BRAND_DATA === 'undefined') return null;
  for (var i = 0; i < BRAND_DATA.length; i++) {
    if (BRAND_DATA[i].brands) {
      for (var j = 0; j < BRAND_DATA[i].brands.length; j++) {
        if (BRAND_DATA[i].brands[j].id === id) return BRAND_DATA[i].brands[j];
      }
    }
  }
  return null;
};

window.getCategories = window.getCategoriesWithBrands;

console.log('helpers.js loaded - testing now...');
console.log('Test window.getCategoriesWithBrands():');
var testResult = window.getCategoriesWithBrands();
console.log('Result:', testResult ? testResult.length + ' categories' : 'FAILED');
