// Track active panel ports per tab
const panelPorts = new Map<number, chrome.runtime.Port>();

function notifyContentScript(tabId: number, isOpen: boolean): void {
  chrome.tabs.sendMessage(tabId, { type: 'PANEL_VISIBILITY', isOpen }).catch((err) => {
    if (import.meta.env.DEV) {
      console.warn('Failed to notify content script:', err);
    }
  });
}

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
    notifyContentScript(tab.id, true);
  }
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Handle port connections from side panel
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'chatnav-panel') return;

  // Get the tab ID for this panel
  chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    const tabId = tab?.id;
    if (!tabId) return;

    panelPorts.set(tabId, port);
    notifyContentScript(tabId, true);

    // When panel disconnects (closes), show the button
    port.onDisconnect.addListener(() => {
      panelPorts.delete(tabId);
      notifyContentScript(tabId, false);
    });
  });
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'OPEN_SIDE_PANEL' && sender.tab?.id) {
    chrome.sidePanel.open({ tabId: sender.tab.id });
    notifyContentScript(sender.tab.id, true);
  }
});
