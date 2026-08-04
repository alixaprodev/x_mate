const countEl = document.getElementById('count');
const toggleEl = document.getElementById('enabled-toggle');
const resetBtn = document.getElementById('reset-btn');

function render() {
  chrome.storage.local.get({ enabled: true, blockedCount: 0 }, (data) => {
    countEl.textContent = data.blockedCount;
    toggleEl.checked = data.enabled;
  });
}

toggleEl.addEventListener('change', () => {
  chrome.storage.local.set({ enabled: toggleEl.checked });
});

resetBtn.addEventListener('click', () => {
  chrome.storage.local.set({ blockedCount: 0 }, render);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') render();
});

render();
