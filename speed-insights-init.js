/**
 * Vercel Speed Insights Initialization
 * This script initializes Vercel Speed Insights for performance monitoring
 */
(function() {
  // Initialize Vercel Speed Insights queue
  window.si = window.si || function() {
    (window.siq = window.siq || []).push(arguments);
  };

  // Load the Speed Insights script
  var script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/speed-insights/script.js';
  document.head.appendChild(script);
})();
