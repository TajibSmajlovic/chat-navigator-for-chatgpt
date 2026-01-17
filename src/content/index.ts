import './styles.css';

import { injectMiniChatButton } from './button';
import MessagesHandler from './messages-handler';
import { createScrollObserver, observeMessages, createMessageObserver } from './observers';
import { sendToPanel, getChatTitle, isExtensionContextValid } from './utils';

function startApp(mainContainer: HTMLElement): void {
  if (!isExtensionContextValid()) return;

  const nodes = MessagesHandler.detectMessages();
  const messageHandler = new MessagesHandler();

  messageHandler.setNodes(nodes);
  sendToPanel({ type: 'NODES_UPDATED', nodes, chatTitle: getChatTitle() });

  const scrollObserver = createScrollObserver();
  messageHandler.handleNodesUpdate(nodes, scrollObserver, observeMessages);

  const messageObserver = createMessageObserver((newNodes) =>
    messageHandler.handleNodesUpdate(newNodes, scrollObserver, observeMessages)
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
  init();
}
