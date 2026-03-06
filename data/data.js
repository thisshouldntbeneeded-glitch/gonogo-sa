// Combine all data parts into one BRAND_DATA array
var BRAND_DATA = []
  .concat(typeof BRAND_DATA_PARTA !== 'undefined' ? BRAND_DATA_PARTA : [])
  .concat(typeof BRAND_DATA_PARTB !== 'undefined' ? BRAND_DATA_PARTB : [])
  .concat(typeof BRAND_DATA_PARTC !== 'undefined' ? BRAND_DATA_PARTC : [])
  .concat(typeof BRAND_DATA_PARTD !== 'undefined' ? BRAND_DATA_PARTD : [])
  .concat(typeof BRAND_DATA_PARTE !== 'undefined' ? BRAND_DATA_PARTE : [])
  .concat(typeof BRAND_DATA_PARTF !== 'undefined' ? BRAND_DATA_PARTF : []);
