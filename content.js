// Selectors for blocking elements
const SELECTORS = {
  blockHome: `
    ytd-browse[page-subtype="home"] { display: none !important; }
    #primary.ytd-browse[page-subtype="home"] { display: none !important; }
  `,
  blockSidebar: `
    ytd-watch-next-secondary-results-renderer { display: none !important; }
    #secondary { display: none !important; }
    ytd-compact-autoplay-renderer { display: none !important; }
    yt-related-video-renderer { display: none !important; }
  `,
  blockComments: `
    ytd-comments { display: none !important; }
    #comments { display: none !important; }
  `,
  blockShorts: `
    ytd-rich-shelf-renderer[is-shorts] { display: none !important; }
    ytd-reel-shelf-renderer { display: none !important; }
    ytd-guide-entry-renderer:has(a[title="Shorts"]) { display: none !important; }
    ytd-mini-guide-entry-renderer:has(a[title="Shorts"]) { display: none !important; }
    a[title="Shorts"] { display: none !important; }
    [is-shorts] { display: none !important; }
    ytd-pivot-bar-item-renderer:has(a[title="Shorts"]) { display: none !important; }
  `
};

let styleElement = null;

// The core function to fetch and apply everything
async function update() {
  try {
    const settings = await chrome.storage.local.get({
      masterEnabled: true,
      blockHome: true,
      blockSidebar: true,
      blockComments: false,
      blockShorts: true
    });

    applyStyles(settings);
  } catch (e) {
    console.error("Focus YT: Failed to update settings", e);
  }
}

function applyStyles(settings) {
  // Create the style element if it doesn't exist
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'yt-focus-blocker-style';
    const target = document.head || document.documentElement;
    if (target) {
      target.appendChild(styleElement);
    }
  }

  let cssContent = '';
  
  // Only build CSS if master switch is ON
  if (settings.masterEnabled !== false) {
    for (const key in SELECTORS) {
      if (settings[key] === true) {
        cssContent += SELECTORS[key];
      }
    }
  }

  // Update content - even if it's empty (this removes the blocking)
  if (styleElement) {
    styleElement.textContent = cssContent;
  }
}

// Initial application
update();

// Listen for storage changes from the popup
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    update();
  }
});

// Re-inject if YouTube's navigation removes it (important for YouTube's SPA layout)
const observer = new MutationObserver(() => {
  const target = document.head || document.documentElement;
  if (styleElement && target && !styleElement.parentElement) {
    target.appendChild(styleElement);
  }
});

if (document.documentElement) {
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
