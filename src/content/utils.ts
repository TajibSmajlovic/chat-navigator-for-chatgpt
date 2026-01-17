import type { ContentToPanel } from '#/shared/types';

export function isExtensionContextValid(): boolean {
  try {
    return !!chrome?.runtime?.id;
  } catch {
    return false;
  }
}

export function sendToPanel(message: ContentToPanel): void {
  if (!isExtensionContextValid()) {
    if (import.meta.env.DEV) {
      console.log('[sendToPanel] Extension context invalid, message not sent:', message);
    }
    return;
  }

  if (import.meta.env.DEV) {
    console.log('[sendToPanel] Sending message to panel:', message);
  }

  try {
    chrome.runtime.sendMessage(message).catch((error) => {
      if (import.meta.env.DEV) {
        console.log('[sendToPanel] Panel might not be open (expected):', error);
      }
    });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.log('[sendToPanel] Extension context invalidated (dev/HMR):', error);
    }
  }
}

export function getChatTitle(): string {
  // ChatGPT marks the active conversation with data-active attribute
  const activeElement = document.querySelector('[data-active]');
  if (activeElement?.textContent) {
    return activeElement.textContent.trim();
  }

  // Fallback to document title
  const docTitle = document.title.replace(' | ChatGPT', '').replace('ChatGPT', '').trim();
  return docTitle || 'Chat';
}
