import { BUTTON_ID, CONTAINER_ID } from './constants';
import { isExtensionContextValid } from './utils';

const ICON_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <line x1="9" y1="3" x2="9" y2="18"/>
    <line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
`;

function createButton(): HTMLButtonElement {
  const button = document.createElement('button');

  button.id = BUTTON_ID;
  button.className = 'chatnav-btn';
  button.setAttribute('aria-label', 'Open MiniChat');
  button.setAttribute('title', 'Open MiniChat');
  button.innerHTML = ICON_SVG;

  button.addEventListener('click', () => {
    if (!isExtensionContextValid()) return;
    chrome.runtime.sendMessage({ type: 'OPEN_SIDE_PANEL' });
  });

  return button;
}

export function setButtonVisibility(visible: boolean, injectButton: () => void): void {
  const container = document.getElementById(CONTAINER_ID);
  if (container) {
    container.style.display = visible ? 'block' : 'none';
  } else if (visible) {
    // Button doesn't exist yet, inject it
    injectButton();
  }
}

export function injectMiniChatButton(): void {
  if (document.getElementById(BUTTON_ID)) {
    return;
  }

  // Wait for body to be ready
  if (!document.body) {
    setTimeout(injectMiniChatButton, 500);
    return;
  }

  const container = document.createElement('div');
  container.id = CONTAINER_ID;
  container.className = 'chatnav-container';

  const button = createButton();
  container.appendChild(button);
  document.body.appendChild(container);
}
