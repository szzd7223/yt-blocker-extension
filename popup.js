// Default settings
const defaultSettings = {
  blockHome: true,
  blockSidebar: true,
  blockComments: false,
  blockShorts: true
};

// Initialize popup with storage values
async function initialize() {
  const settings = await chrome.storage.local.get(defaultSettings);
  
  Object.keys(settings).forEach(key => {
    const input = document.getElementById(key);
    if (input) {
      input.checked = settings[key];
      input.addEventListener('change', (e) => saveSetting(key, e.target.checked));
    }
  });
}

// Save settings and notify content scripts (via storage change)
async function saveSetting(key, value) {
  const update = {};
  update[key] = value;
  await chrome.storage.local.set(update);
  
  // Optional: Explicitly notify active tabs if needed immediately
  // For this extension, content.js will listen for storage changes.
}

document.addEventListener('DOMContentLoaded', initialize);
