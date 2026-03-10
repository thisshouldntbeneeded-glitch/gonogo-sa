// GoNoGo SA - Data Helpers (FIXED SCORE CALCULATIONS + OVERVIEW/RATING SUMMARY)

// Transform BRAND_DATA into proper structure with calculated percentage scores
window.getBrandById = function(id) {
  for (var i = 0; i < BRAND_DATA.length; i++) {
    var cat = BRAND_DATA[i];
    if (cat.brands) {
      for (var j = 0; j < cat.brands.length; j++) {
        if (cat.brands[j].id === id) {
          var b = cat.brands[j];
          return {
            id: b.id,
            name: b.name,
            category: cat.category,
            overallScore: b.gonogo_score || 0,
            verdict: b.verdict || (b.gonogo_score >= 80 ? 'GO' : b.gonogo_score >= 60 ? 'GO WITH CAUTION' : 'NOGO'),
            logo: b.logo || '',
            website: b.website || '',

            // Raw per‑category scores for radar
            categoryScores: {
              'Compliance': {
                score: b.compliance_score,
                max: b.compliance_max
              },
              'Customer Satisfaction': {
                score: b.customer_satisfaction_score,
                max: b.customer_satisfaction_max
              },
              'Product Value': {
                score: b.product_value_score,
                max: b.product_value_max
              },
              'Innovation': {
                score: b.innovation_score,
                max: b.innovation_max
              },
              'Customer Support': {
                score: b.customer_support_score,
                max: b.customer_support_max
              },
              'Accessibility & Security': {
                score: b.accessibility_security_score,
                max: b.accessibility_security_max
              }
            },

            scores: calculatePercentageScores(b),
            strengths: parseListField(b.strengths),
            weaknesses: parseListField(b.concerns),
            features: parseListField(b.features),
            pricing: b.pricing || '',
            googlePlayRating: b.googleplay_rating || '',
            iosRating: b.ios_rating || '',
            tags: parseListField(b.tags),
            socialSentiment: b.social_sentiment || '',
            socialPositive: parseListField(b.social_positive),
            socialConcerns: parseListField(b.social_concerns),
            lastUpdated: b.last_updated || '',
            // NEW FIELDS
            overview: b.overview || '',
            ratingSummary: b.ratingSummary || ''
          };
        }
      }
    }
  }
  return null;
};

window.getBrandsByCategory = function(slug) {
  for (var i = 0; i < BRAND_DATA.length; i++) {
    if (BRAND_DATA[i].slug === slug) {
      var cat = BRAND_DATA[i];
      return (cat.brands || []).map(function(b) {
        return {
          id: b.id,
          name: b.name,
          category: cat.category,
          overallScore: b.gonogo_score || 0,
          verdict: b.verdict || (b.gonogo_score >= 80 ? 'GO' : b.gonogo_score >= 60 ? 'GO WITH CAUTION' : 'NOGO'),
          logo: b.logo || '',

          // Raw per‑category scores for radar (list view)
          categoryScores: {
            'Compliance': {
              score: b.compliance_score,
              max: b.compliance_max
            },
            'Customer Satisfaction': {
              score: b.customer_satisfaction_score,
              max: b.customer_satisfaction_max
            },
            'Product Value': {
              score: b.product_value_score,
              max: b.product_value_max
            },
            'Innovation': {
              score: b.innovation_score,
              max: b.innovation_max
            },
            'Customer Support': {
              score: b.customer_support_score,
              max: b.customer_support_max
            },
            'Accessibility & Security': {
              score: b.accessibility_security_score,
              max: b.accessibility_security_max
            }
          },

          scores: calculatePercentageScores(b),
          strengths: parseListField(b.strengths),
          weaknesses: parseListField(b.concerns),
          // NEW FIELDS
          overview: b.overview || '',
          ratingSummary: b.ratingSummary || ''
        };
      });
    }
  }
  return [];
};

window.getAllBrands = function() {
  var allBrands = [];
  for (var i = 0; i < BRAND_DATA.length; i++) {
    var cat = BRAND_DATA[i];
    if (cat.brands) {
      cat.brands.forEach(function(b) {
        allBrands.push({
          id: b.id,
          name: b.name,
          category: cat.category,
          overallScore: b.gonogo_score || 0,
          verdict: b.verdict || (b.gonogo_score >= 80 ? 'GO' : b.gonogo_score >= 60 ? 'GO WITH CAUTION' : 'NOGO'),
          logo: b.logo || '',

          // Raw per‑category scores for radar (global list)
          categoryScores: {
            'Compliance': {
              score: b.compliance_score,
              max: b.compliance_max
            },
            'Customer Satisfaction': {
              score: b.customer_satisfaction_score,
              max: b.customer_satisfaction_max
            },
            'Product Value': {
              score: b.product_value_score,
              max: b.product_value_max
            },
            'Innovation': {
              score: b.innovation_score,
              max: b.innovation_max
            },
            'Customer Support': {
              score: b.customer_support_score,
              max: b.customer_support_max
            },
            'Accessibility & Security': {
              score: b.accessibility_security_score,
              max: b.accessibility_security_max
            }
          },

          scores: calculatePercentageScores(b),
          // NEW FIELDS
          overview: b.overview || '',
          ratingSummary: b.ratingSummary || ''
        });
      });
    }
  }
  return allBrands;
};

window.getTopBrands = function(count) {
  var all = getAllBrands();
  all.sort(function(a, b) { return b.overallScore - a.overallScore; });
  return all.slice(0, count || 6);
};

window.getCategoriesWithBrands = function() {
  return BRAND_DATA.map(function(cat) {
    return {
      id: cat.slug,
      name: cat.category,
      icon: cat.icon,
      brandCount: cat.brands ? cat.brands.length : 0,
      hasBrands: cat.brands && cat.brands.length > 0
    };
  });
};

// Calculate percentage scores for radar chart
function calculatePercentageScores(brand) {
  var scores = {};
  var scoreFields = [
    {name: 'Compliance', score: 'compliance_score', max: 'compliance_max'},
    {name: 'Customer Satisfaction', score: 'customer_satisfaction_score', max: 'customer_satisfaction_max'},
    {name: 'Product Value', score: 'product_value_score', max: 'product_value_max'},
    {name: 'Innovation', score: 'innovation_score', max: 'innovation_max'},
    {name: 'Customer Support', score: 'customer_support_score', max: 'customer_support_max'},
    {name: 'Accessibility & Security', score: 'accessibility_security_score', max: 'accessibility_security_max'}
  ];

  scoreFields.forEach(function(field) {
    if (brand[field.score] !== undefined && brand[field.max] && brand[field.max] > 0) {
      scores[field.name] = Math.round((brand[field.score] / brand[field.max]) * 100);
    }
  });

  return scores;
}

// Parse semicolon-separated list fields
function parseListField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.toString().split(';').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
}

console.log('helpers.js loaded - testing now...');
console.log('Test window.getCategoriesWithBrands():');
var testCats = window.getCategoriesWithBrands();
console.log('getCategoriesWithBrands called, BRAND_DATA:', typeof BRAND_DATA);
console.log('getCategoriesWithBrands returning:', testCats.length, 'categories');
console.log('Result:', testCats.length, 'categories');
