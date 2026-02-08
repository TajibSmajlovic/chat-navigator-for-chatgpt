import type { ConversationNode } from '#/shared/types';

import {
  DEBOUNCE_DELAY,
  MESSAGE_SELECTOR,
  SCROLL_OBSERVER_MIN_VISIBILITY,
  SCROLL_OBSERVER_ROOT_MARGIN,
} from './constants';
import MessagesHandler from './messages-handler';
import { sendToPanel } from './utils';

/**
 * Create an IntersectionObserver to track which message is currently visible
 * Uses SCROLL_OBSERVER_ROOT_MARGIN to define the "active zone" in the viewport
 */
export function createScrollObserver(): IntersectionObserver {
  let currentActiveId: string | null = null;

  return new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter((e) => e.isIntersecting);
      if (visibleEntries.length === 0) return;

      // Sort by intersection ratio to find the most visible element
      visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      const bestEntry = visibleEntries[0];

      // Only update if the element has significant visibility
      if (bestEntry.intersectionRatio < SCROLL_OBSERVER_MIN_VISIBILITY) return;

      const nodeId = bestEntry.target.getAttribute('data-turn-id');

      if (nodeId && nodeId !== currentActiveId) {
        currentActiveId = nodeId;
        sendToPanel({ type: 'ACTIVE_NODE_CHANGED', nodeId });
      }
    },
    {
      rootMargin: SCROLL_OBSERVER_ROOT_MARGIN,
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    }
  );
}

// Start observing all message elements with the scroll observer
export function observeMessages(observer: IntersectionObserver): void {
  document.querySelectorAll(MESSAGE_SELECTOR).forEach((el) => observer.observe(el));
}

// Create a MutationObserver to detect when new messages are added/removed.
export function createMessageObserver(
  onNodesChange: (nodes: ConversationNode[]) => void
): MutationObserver {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let lastNodeCount = 0;
  let lastNodesSignature = '';

  const observer = new MutationObserver((mutations) => {
    const hasRelevant = mutations.some((m) => m.addedNodes.length > 0 || m.removedNodes.length > 0);
    if (!hasRelevant) return;

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      const newNodes = MessagesHandler.detectMessages();
      const nextSignature = newNodes.map((node) => `${node.id}:${node.textPreview}`).join('|');

      if (newNodes.length !== lastNodeCount || nextSignature !== lastNodesSignature) {
        lastNodeCount = newNodes.length;
        lastNodesSignature = nextSignature;
        onNodesChange(newNodes);
      }
    }, DEBOUNCE_DELAY);
  });

  const originalDisconnect = observer.disconnect.bind(observer);
  observer.disconnect = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    originalDisconnect();
  };

  return observer;
}
