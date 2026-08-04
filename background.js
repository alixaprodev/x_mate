chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get({ enabled: true, blockedCount: 0 }, (data) => {
    chrome.storage.local.set(data);
  });
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type === 'xmate-blocked-update' && sender.tab?.id) {
    chrome.action.setBadgeText({
      tabId: sender.tab.id,
      text: message.total > 0 ? String(message.total) : '',
    });
    chrome.action.setBadgeBackgroundColor({ tabId: sender.tab.id, color: '#f4212e' });
  }
});
