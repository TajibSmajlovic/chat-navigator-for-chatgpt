// Highlight classes for different message types
export const HIGHLIGHT_CLASS_USER = 'chatnav-highlight-user';
export const HIGHLIGHT_CLASS_ASSISTANT = 'chatnav-highlight-assistant';

export const SCROLL_OBSERVER_ROOT_MARGIN = '-25% 0px -25% 0px'; // rootMargin shrinks the viewport for detection - '-25%' means middle 50% is the active zone
export const SCROLL_OBSERVER_MIN_VISIBILITY = 0.1; // Minimum 10% visibility to be considered "active"

export const HIGHLIGHT_DURATION = 1250;
export const DEBOUNCE_DELAY = 150; // Increased to wait for message content to load
export const MIN_CONTENT_LENGTH = 3; // Minimum chars for valid message content
export const TEXT_PREVIEW_MAX_LENGTH = 140; // Allow up to 140 chars for 2-3 lines of preview

export const BUTTON_ID = 'chatnav-btn';
export const CONTAINER_ID = 'chatnav-container';

export const CHAT_GPT_MESSAGE_ID_ATTRIBUTE = 'data-turn-id';
export const CHAT_GPT_MESSAGE_ATTRIBUTE = 'data-turn';
export const MESSAGE_SELECTOR = `article[${CHAT_GPT_MESSAGE_ID_ATTRIBUTE}]`;
export const CHAT_GPT_USER_MESSAGE_CLASS_SELECTOR = 'div.whitespace-pre-wrap';
export const CHAT_GPT_ASSISTANT_MESSAGE_CLASS_SELECTOR = 'div.markdown';
