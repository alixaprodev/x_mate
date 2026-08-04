(() => {
  const ROOT = document.documentElement;
  const AD_CELL_SELECTOR = 'div[data-testid="cellInnerDiv"]';
  const AD_MARKER_SELECTOR = 'div[data-testid="placementTracking"]';
  const SIDEBAR_AD_SELECTOR = '[data-testid="whoToFollowSspAd"]';

  // Apply the toggle attribute as early as possible so content.css can hide
  // ads with zero flash. Defaults to "on" until storage says otherwise.
  ROOT.setAttribute('data-xmate', 'on');
  chrome.storage.local.get({ enabled: true, blockedCount: 0 }, (data) => {
    ROOT.setAttribute('data-xmate', data.enabled ? 'on' : 'off');
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.enabled) {
      ROOT.setAttribute('data-xmate', changes.enabled.newValue ? 'on' : 'off');
    }
  });

  // Counting is purely for the popup's "ads blocked" stat — the CSS above
  // does the actual hiding on its own.
  const seen = new WeakSet();

  function countNewlyBlocked() {
    let newly = 0;

    document.querySelectorAll(AD_CELL_SELECTOR).forEach((cell) => {
      if (seen.has(cell)) return;
      if (cell.querySelector(AD_MARKER_SELECTOR)) {
        seen.add(cell);
        newly++;
      }
    });

    document.querySelectorAll(SIDEBAR_AD_SELECTOR).forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      newly++;
    });

    if (newly > 0) {
      chrome.storage.local.get({ blockedCount: 0 }, (data) => {
        const total = data.blockedCount + newly;
        chrome.storage.local.set({ blockedCount: total });
        chrome.runtime.sendMessage({ type: 'xmate-blocked-update', total }).catch(() => {});
      });
    }
  }

  let scheduled = false;
  function scheduleCount() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      countNewlyBlocked();
    }, 500);
  }

  const observer = new MutationObserver(scheduleCount);

  function start() {
    countNewlyBlocked();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.body) {
    start();
  } else {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  }
})();
