import {
  HIGHLIGHT_CLASS_USER,
  HIGHLIGHT_CLASS_ASSISTANT,
  HIGHLIGHT_DURATION,
  CHAT_GPT_MESSAGE_ID_ATTRIBUTE,
} from './constants';

function findMessageElement(id: string): Element | null {
  const byNodeId = document.querySelector(`[${CHAT_GPT_MESSAGE_ID_ATTRIBUTE}="${id}"]`);
  if (byNodeId) return byNodeId;

  return null;
}

export function navigateToNode(nodeId: string, nodeType: 'question' | 'answer'): boolean {
  const element = findMessageElement(nodeId);
  if (!element) return false;

  element.scrollIntoView({ behavior: 'instant', block: 'start' });

  const highlightClass = nodeType === 'question' ? HIGHLIGHT_CLASS_USER : HIGHLIGHT_CLASS_ASSISTANT;

  // Remove both classes first to ensure clean state
  element.classList.remove(HIGHLIGHT_CLASS_USER, HIGHLIGHT_CLASS_ASSISTANT);
  void (element as HTMLElement).offsetWidth; // Force reflow
  element.classList.add(highlightClass);

  setTimeout(() => element.classList.remove(highlightClass), HIGHLIGHT_DURATION);

  return true;
}
