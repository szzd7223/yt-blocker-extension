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
  `
};

let styleElement = null;

// Initialize styles
async function init() {
  const settings = await chrome.storage.local.get({
    blockHome: true,
    blockSidebar: true,
    blockComments: false,
    blockShorts: true
  });

  applyStyles(settings);

  // Listen for changes
  chrome.storage.onChanged.addListener((changes) => {
    chrome.storage.local.get(null, (newSettings) => {
      applyStyles(newSettings);
    });
  });
}

function applyStyles(settings) {
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'yt-focus-blocker-style';
    (document.head || document.documentElement).appendChild(styleElement);
  }

  let cssContent = '';
  for (const [key, value] of Object.entries(settings)) {
    if (value && SELECTORS[key]) {
      cssContent += SELECTORS[key];
    }
  }
  
  // Extra precaution for "click to play" - if home is hidden, ensure search bar is still usable
  // Search results are usually in ytd-browse[page-subtype="search"] or ytd-search
  // We explicitly ONLY target 'home' subtype in SELECTORS.

  styleElement.textContent = cssContent;
}

// Run immediately
init();

// Re-inject if YouTube's SPA navigation removes it or weird things happen
const observer = new MutationObserver(() => {
  if (styleElement && !styleElement.parentElement) {
    (document.head || document.documentElement).appendChild(styleElement);
  }
});

observer.observe(document.documentElement, { childList: true, subtree: true });
