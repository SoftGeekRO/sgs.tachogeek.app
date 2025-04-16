const _manifest = __ASSET_MANIFEST__,
  baseUrl = '//cdn.softgeek.ro/tachogeek/app',
  targetStyle = document.querySelector('link[href*="dev-style.css"]'),
  targetScript = document.querySelector('script[src*="dev.js"]');

function sortAssets(a, b) {
  if (a.name.includes('vendor')) { return -1; }
  if (b.name.includes('vendor')) { return 1; }
  if (a.name.includes('main')) { return 1; }
  if (b.name.includes('main')) { return -1; }
  return 0;
}

// Function to append timestamp if needed
function appendTimestamp(url) {
  const urlParams = new URLSearchParams(window.location.search);
  const shouldAddTimestamp = urlParams.get('_') === 'true';

  if (shouldAddTimestamp) {
    const timestamp = new Date().getTime();
    const separator = url.includes('?') ? '&' : '?';
    return url + separator + 'ts=' + timestamp;
  }
  return url;
}

(async () => {

  try {
    const manifest = _manifest,
      jsFiles = [],
      cssFiles = [];

    // Separate JS and CSS and append timestamp if needed
    Object.entries(manifest).forEach(([name, filePath]) => {
      const fullUrl = baseUrl + filePath;
      if (filePath.endsWith('.js')) {
        jsFiles.push({ name, path: appendTimestamp(fullUrl) });
      } else if (filePath.endsWith('.css')) {
        cssFiles.push({ name, path: appendTimestamp(fullUrl) });
      }
    });

    // Sort CSS: vendor first, main last
    cssFiles.sort(sortAssets).reverse();

    // Inject CSS into <head>
    cssFiles.forEach(file => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = file.path;

      if (targetStyle) {
        targetStyle.insertAdjacentElement('afterend', link);
      }
    });

    // Sort JS: vendor first, main last
    jsFiles.sort(sortAssets);


    // Inject JS into <body> in order
    for (const file of jsFiles.reverse()) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = file.path;
        script.async = false;
        script.onload = resolve;
        script.onerror = () => {
          console.error('Failed to load script:', file.path);
          reject();
        };

        if (targetScript) {
          targetScript.insertAdjacentElement('afterend', script);
        }
      });
    }

  } catch (error) {
    console.error('Error loading assets from manifest:', error);
  }
})();
