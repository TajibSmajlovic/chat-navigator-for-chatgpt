import type { ConversationNode, ExtensionMessage } from '#/shared/types';

import { setButtonVisibility, injectMiniChatButton } from './button';
import {
  CHAT_GPT_ASSISTANT_MESSAGE_CLASS_SELECTOR,
  CHAT_GPT_MESSAGE_ATTRIBUTE,
  CHAT_GPT_MESSAGE_ID_ATTRIBUTE,
  CHAT_GPT_USER_MESSAGE_CLASS_SELECTOR,
  MESSAGE_SELECTOR,
  MIN_CONTENT_LENGTH,
  TEXT_PREVIEW_MAX_LENGTH,
} from './constants';
import { navigateToNode } from './navigation';
import { getChatTitle, sendToPanel } from './utils';

export default class MessagesHandler {
  private nodes: ConversationNode[] = [];

  public handleMessage = (
    message: ExtensionMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: unknown) => void
  ): boolean => {
    switch (message.type) {
      case 'NAVIGATE_TO_NODE':
        sendResponse({ success: navigateToNode(message.nodeId, message.nodeType) });
        break;
      case 'REQUEST_SYNC':
        this.nodes = MessagesHandler.detectMessages();
        sendToPanel({
          type: 'NODES_UPDATED',
          nodes: this.nodes,
          chatTitle: getChatTitle(),
        });
        sendResponse({ success: true });
        break;
      case 'PANEL_VISIBILITY':
        setButtonVisibility(!message.isOpen, injectMiniChatButton);
        sendResponse({ success: true });
        break;
      default:
        sendResponse({ success: false });
    }

    return true;
  };

  public handleNodesUpdate(
    newNodes: ConversationNode[],
    scrollObserver: IntersectionObserver | null,
    observeMessagesFn: (observer: IntersectionObserver) => void
  ): void {
    this.nodes = newNodes;
    sendToPanel({
      type: 'NODES_UPDATED',
      nodes: this.nodes,
      chatTitle: getChatTitle(),
    });

    if (scrollObserver) {
      scrollObserver.disconnect();
      observeMessagesFn(scrollObserver);
    }
  }

  public setNodes(newNodes: ConversationNode[]): void {
    this.nodes = newNodes;
  }

  static detectMessages(documentArg?: Document): ConversationNode[] {
    const elements = (documentArg || document).querySelectorAll(MESSAGE_SELECTOR);
    const detected: ConversationNode[] = [];

    elements.forEach((element) => {
      const id = element.getAttribute(CHAT_GPT_MESSAGE_ID_ATTRIBUTE);
      if (!id) return;

      const dataTurn = element.getAttribute(CHAT_GPT_MESSAGE_ATTRIBUTE);
      const textPreview = extractTextPreview(element);

      // Skip messages that don't have content yet (still loading)
      if (textPreview.length < MIN_CONTENT_LENGTH) {
        return;
      }

      const type = dataTurn === 'user' ? 'question' : 'answer';

      detected.push({
        id,
        type,
        textPreview,
      });
    });

    return detected;
  }
}

function extractTextPreview(element: Element): string {
  const dataTurn = element.getAttribute(CHAT_GPT_MESSAGE_ATTRIBUTE);
  let contentElement: Element | null = null;

  if (dataTurn === 'user') {
    contentElement = element.querySelector(CHAT_GPT_USER_MESSAGE_CLASS_SELECTOR);
  } else {
    contentElement = element.querySelector(CHAT_GPT_ASSISTANT_MESSAGE_CLASS_SELECTOR);
  }

  if (!contentElement) {
    return '';
  }

  const textContent = contentElement.textContent || '';
  const cleaned = textContent.replace(/\s+/g, ' ').trim();

  if (cleaned.length <= TEXT_PREVIEW_MAX_LENGTH) {
    return cleaned;
  }

  return cleaned.slice(0, TEXT_PREVIEW_MAX_LENGTH - 3) + '...';
}
