import './styles.css';

import { injectMiniChatButton } from './button';
import MessagesHandler from './messages-handler';
import { createScrollObserver, observeMessages, createMessageObserver } from './observers';
import { sendToPanel, getChatTitle, isExtensionContextValid } from './utils';

// Track active resources for cleanup on SPA navigation
let scrollObserver: IntersectionObserver | null = null;
let messageObserver: MutationObserver | null = null;
let messageHandler: MessagesHandler | null = null;

function cleanup(): void {
  if (scrollObserver) {
    scrollObserver.disconnect();
    scrollObserver = null;
  }

  if (messageObserver) {
    messageObserver.disconnect();
    messageObserver = null;
  }

  if (messageHandler) {
    chrome.runtime.onMessage.removeListener(messageHandler.handleMessage);
    messageHandler = null;
  }
}

function startApp(mainContainer: HTMLElement): void {
  if (!isExtensionContextValid()) return;

  // Tear down previous instance before creating a new one
  cleanup();

  const nodes = MessagesHandler.detectMessages();
  messageHandler = new MessagesHandler();

  messageHandler.setNodes(nodes);
  sendToPanel({ type: 'NODES_UPDATED', nodes, chatTitle: getChatTitle() });

  scrollObserver = createScrollObserver();
  messageHandler.handleNodesUpdate(nodes, scrollObserver, observeMessages);

  messageObserver = createMessageObserver((newNodes) =>
    messageHandler!.handleNodesUpdate(newNodes, scrollObserver, observeMessages)
  );

  messageObserver.observe(mainContainer, { childList: true, subtree: true });

  chrome.runtime.onMessage.addListener(messageHandler.handleMessage);

  injectMiniChatButton();
}

function init(): void {
  // If main already exists, start immediately
  const main = document.querySelector('main');
  if (main) {
    startApp(main as HTMLElement);
    return;
  }

  // Otherwise wait for it
  const initObserver = new MutationObserver((_mutations, obs) => {
    const main = document.querySelector('main');
    if (main) {
      obs.disconnect();
      startApp(main);
    }
  });

  initObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  setTimeout(init, 2_500);
}
