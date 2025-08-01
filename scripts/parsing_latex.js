// Dynamically load MathJax after setting the config
(function() {
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
  script.defer = true;
  document.head.appendChild(script);
})();


// Setup the setting configuration for the inline and block display equations
window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']]
  }
};

