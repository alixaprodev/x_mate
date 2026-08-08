(() => {
  const ROOT = document.documentElement;
  const AD_CELL_SELECTOR = 'div[data-testid="cellInnerDiv"]';
  const AD_MARKER_SELECTOR = 'div[data-testid="placementTracking"]';
  const SIDEBAR_AD_SELECTOR = '[data-testid="whoToFollowSspAd"]';
  const AD_FLAG_ATTR = 'data-xmate-ad';

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

  // content.css hides plain promoted tweets on its own, but it can't tell a
  // promoted video from an ordinary one — X uses data-testid="placementTracking"
  // both for an ad's impression block and for the wrapper its video player
  // mounts into. The two are distinguishable by position: an ad's block sits
  // outside the tweet's <article>, a video player's sits inside it. Cells that
  // really are ads get flagged here for the CSS to hide.
  function isAdCell(cell) {
    return Array.prototype.some.call(
      cell.querySelectorAll(AD_MARKER_SELECTOR),
      (marker) => !marker.closest('article')
    );
  }

  // Counting is purely for the popup's "ads blocked" stat.
  const seen = new WeakSet();

  function countNewlyBlocked() {
    let newly = 0;

    document.querySelectorAll(AD_CELL_SELECTOR).forEach((cell) => {
      // Cells are recycled by X's virtualized list, so the flag is refreshed
      // every pass rather than only set once.
      if (!isAdCell(cell)) {
        cell.removeAttribute(AD_FLAG_ATTR);
        return;
      }

      cell.setAttribute(AD_FLAG_ATTR, '');
      if (seen.has(cell)) return;
      seen.add(cell);
      newly++;
    });

    document.querySelectorAll(SIDEBAR_AD_SELECTOR).forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      newly++;
    });

    if (newly > 0) {
      chrome.storage.local.get({ blockedCount: 0 }, (data) => {
        chrome.storage.local.set({ blockedCount: data.blockedCount + newly });
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
