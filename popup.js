const defaultSettings = {
  masterEnabled: true,
  blockHome: true,
  blockSidebar: true,
  blockComments: false,
  blockShorts: true
};

async function initialize() {
  const settings = await chrome.storage.local.get(defaultSettings);
  
  // Set initial states
  updateUIState(settings);

  // Setup Master Switch
  const masterSwitch = document.getElementById('masterSwitch');
  if (masterSwitch) {
    masterSwitch.checked = settings.masterEnabled;
    masterSwitch.addEventListener('change', async (e) => {
      const isEnabled = e.target.checked;
      await saveSetting('masterEnabled', isEnabled);
      const currentSettings = await chrome.storage.local.get(defaultSettings);
      updateUIState(currentSettings);
    });
  }

  // Setup Individual Toggle Switches
  const toggles = ['blockHome', 'blockSidebar', 'blockComments', 'blockShorts'];
  toggles.forEach(key => {
    const input = document.getElementById(key);
    if (input) {
      input.checked = settings[key];
      input.addEventListener('change', (e) => saveSetting(key, e.target.checked));
    }
  });
}

function updateUIState(settings) {
  const body = document.body;
  const statusText = document.getElementById('statusText');
  
  if (settings.masterEnabled) {
    body.classList.remove('disabled');
    body.classList.add('active-overlay');
    statusText.innerText = 'Protection Active';
  } else {
    body.classList.add('disabled');
    body.classList.remove('active-overlay');
    statusText.innerText = 'Protection Paused';
  }
}

async function saveSetting(key, value) {
  const update = {};
  update[key] = value;
  await chrome.storage.local.set(update);
}

document.addEventListener('DOMContentLoaded', initialize);
