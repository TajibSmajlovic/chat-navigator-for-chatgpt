import { useCallback, useEffect, useState } from 'react';

import type { PanelToContent } from '#/shared/types';
import { isChatGptUrl } from '#/shared/utils';

type ConnectionState = 'loading' | 'connected' | 'not-chatgpt';

interface UseConnectionStateProps {
  sendToContent: (message: PanelToContent) => Promise<unknown>;
  onConnected?: VoidFunction;
}

export function useConnectionState({ sendToContent, onConnected }: UseConnectionStateProps) {
  const [connectionState, setConnectionState] = useState<ConnectionState>('loading');

  const updateConnectionState = useCallback(
    (state: ConnectionState) => {
      setConnectionState(state);
      if (state === 'connected') {
        onConnected?.();
      }
    },
    [onConnected]
  );

  // Check initial connection state and request data when panel first loads
  useEffect(() => {
    const checkInitialState = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab?.id || !isChatGptUrl(tab.url)) {
          setConnectionState('not-chatgpt');
          return;
        }

        await sendToContent({ type: 'REQUEST_SYNC' });
      } catch {
        setConnectionState('not-chatgpt');
      }
    };

    checkInitialState();
  }, [sendToContent]);

  return {
    connectionState,
    updateConnectionState,
  };
}
