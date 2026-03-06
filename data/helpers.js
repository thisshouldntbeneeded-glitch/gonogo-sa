// GoNoGo SA - Static Data Helpers
// Used when no backend API is available
// Reads from BRAND_DATA global variable

function getCategories() {
  if (typeof BRAND_DATA === 'undefined') {
    console.error('BRAND_DATA is not defined!');
    return [];
  }
  return BRAND_DATA.map(function(cat) {
    return {
      id: cat.slug,
      name: cat.category,
      slug: cat.slug,
      icon: cat.icon,
      brandCount: cat.brands.length
    };
  });
}

function getCategoriesWithBrands() {
  if (typeof BRAND_DATA === 'undefined') {
    console.error('BRAND_DATA is not defined!');
    return [];
  }
  return BRAND_DATA.map(function(cat) {
    var firstBrand = cat.brands[0] || {};
    return {
      id: cat.slug,
      name: cat.category,
      icon: cat.icon,
      brandCount: cat.brands.length,
      hasBrands: cat.brands.length > 0,
      scoringCategories: firstBrand.categoryScores ? Object.keys(firstBrand.categoryScores).map(function(key) {
        return {
          name: key,
          max: firstBrand.categoryScores[key].max || 0
        };
      }) : []
    };
  });
}

function getAllBrands() {
  if (typeof BRAND_DATA === 'undefined') {
    console.error('BRAND_DATA is not defined!');
    return [];
  }
  var allBrands = [];
  BRAND_DATA.forEach(function(cat) {
    cat.brands.forEach(function(brand) {
      allBrands.push(brand);
    });
  });
  return allBrands;
}

function getBrandsByCategory(slug) {
  if (typeof BRAND_DATA === 'undefined') {
    console.error('BRAND_DATA is not defined!');
    return [];
  }
  var category = BRAND_DATA.find(function(c) { return c.slug === slug; });
  return category ? category.brands : [];
}

function getBrandById(id) {
  if (typeof BRAND_DATA === 'undefined') {
    console.error('BRAND_DATA is not defined!');
    return null;
  }
  for (var i = 0; i < BRAND_DATA.length; i++) {
    var cat = BRAND_DATA[i];
    for (var j = 0; j < cat.brands.length; j++) {
      var brand = cat.brands[j];
      if (brand.id === id) return brand;
    }
  }
  return null;
}

function getTopBrands(count) {
  if (typeof BRAND_DATA === 'undefined') {
    console.error('BRAND_DATA is not defined!');
    return [];
  }
  var allBrands = getAllBrands();
  allBrands.sort(function(a, b) {
    return (b.gonogo_score || 0) - (a.gonogo_score || 0);
  });
  return allBrands.slice(0, count || 6);
}

// Make functions available globally
if (typeof window !== 'undefined') {
  window.getCategories = getCategories;
  window.getCategoriesWithBrands = getCategoriesWithBrands;
  window.getAllBrands = getAllBrands;
  window.getBrandsByCategory = getBrandsByCategory;
  window.getBrandById = getBrandById;
  window.getTopBrands = getTopBrands;
}

console.log('helpers.js loaded. Functions available:', typeof getCategoriesWithBrands);
console.log('Testing getCategoriesWithBrands:', getCategoriesWithBrands().length, 'categories');
