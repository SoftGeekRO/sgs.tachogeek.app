const manifestUrl = "https://cdn.softgeek.ro/tachogeek/app/manifest.json";
const assetPrefix = "https://cdn.softgeek.ro/tachogeek/app"; // adjust if needed

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Skip static assets by file extension (prevent loop on CSS/JS)
    if (/\.(js|css|json|jpg|jpeg|png|svg|gif|ico|woff2?|ttf|eot|mp4|webm)$/i.test(path)) {
      console.log("⏭ Skipping static asset:", path);
      return fetch(request);  // Don't process static assets
    }

    console.log("➡️ Worker received:", request.url);
    const response = await fetch(request, {
      headers: {
        'Accept-Encoding': 'identity'  // prevent gzip/brotli
      }
    });

    const contentType = response.headers.get("Content-Type") || "";
    console.log("🧾 Content-Type:", contentType);

    if (!contentType.includes("text/html")) {
      console.log("⛔ Not HTML, skipping transformation.");
      return response;  // Only modify HTML pages
    }

    console.log("✅ HTML content detected, transforming...");

    const manifestRes = await fetch(manifestUrl);
    const manifest = await manifestRes.json();

    // Prepare asset paths
    const scripts = [];
    const styles = [];

    // Organize scripts and styles, vendor first
    for (const [key, value] of Object.entries(manifest)) {
      const _url = `${assetPrefix}${value}`;

      if (key.endsWith(".js")) {
        if (key.includes("vendor")) {
          scripts.unshift(_url); // Add vendor first
        } else {
          scripts.push(_url);
        }
      } else if (key.endsWith(".css")) {
        if (key.includes("vendor")) {
          styles.unshift(_url); // Add vendor first
        } else {
          styles.push(_url);
        }
      }
    }

    // Keep track of whether we've injected the styles
    let stylesInjected = false;

    return new HTMLRewriter()
      // Inject styles after dev-style.css
      .on("link[href*='dev-style.css']", new StyleInjector(styles))

      // Fallback: inject styles into <head> if no match is found
      .on("head", {
        element(el) {
          if (stylesInjected) {
            return;
          } // Skip if styles are already injected
          stylesInjected = true;
          console.log("📍 Fallback: Injecting styles into <head>");
          styles.forEach(href => {
            el.append(`<link rel="stylesheet" href="${href}">`, { html: true });
          });
        }
      })

      // Inject scripts after dev.js
      .on('script[src*="dev.js"]', new ScriptInjector(scripts))

      .transform(response);
  }
};

// StyleInjector to inject styles
class StyleInjector {
  constructor(styles) {
    this.styles = styles;
    this.injected = false;
  }

  element(element) {
    if (this.injected) {
      return;
    } // Avoid duplicate injections
    console.log("📍 Injecting CSS after dev-style.css");
    this.injected = true;
    this.styles.forEach(href => {
      element.after(`<link rel="stylesheet" href="${href}">`, { html: true });
    });
  }
}

// ScriptInjector to inject scripts
class ScriptInjector {
  constructor(scripts) {
    this.scripts = scripts;
    this.injected = false;
  }

  element(element) {
    if (this.injected) {
      return;
    } // Avoid duplicate injections
    console.log("📍 Injecting JS after dev.js");
    this.injected = true;
    this.scripts.forEach(src => {
      element.after(`<script src="${src}" defer></script>`, { html: true });
    });
  }
}
