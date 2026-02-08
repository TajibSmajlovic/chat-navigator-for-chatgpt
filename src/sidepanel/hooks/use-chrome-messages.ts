import { useCallback, useEffect, useState } from 'react';

import type { ContentToPanel, ConversationNode, PanelToContent } from '#/shared/types';

import { useConnectionState } from './use-connection-state';

export function useChromeMessages() {
  const [nodes, setNodes] = useState<ConversationNode[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [clickedNodeId, setClickedNodeId] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState<string>('');

  const sendToContent = useCallback(async (message: PanelToContent) => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab?.id) {
        return null;
      }

      // Check if we're on ChatGPT
      if (!tab.url?.startsWith('https://chatgpt.com')) {
        return null;
      }

      return chrome.tabs.sendMessage(tab.id, message);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error(err);
      }
    }
  }, []);

  const { connectionState, updateConnectionState } = useConnectionState({
    sendToContent,
  });

  const navigateToNode = useCallback(
    (nodeId: string, nodeType: 'question' | 'answer') => {
      setClickedNodeId(nodeId);
      sendToContent({ type: 'NAVIGATE_TO_NODE', nodeId, nodeType });
    },
    [sendToContent]
  );

  // Establish port connection - background detects disconnect when panel closes
  useEffect(() => {
    const port = chrome.runtime.connect({ name: 'chatnav-panel' });

    // Port automatically disconnects when panel closes
    return () => {
      port.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleMessage = (message: ContentToPanel) => {
      switch (message.type) {
        case 'NODES_UPDATED':
          setNodes(message.nodes);
          setActiveNodeId(
            message.nodes.length > 0 ? message.nodes[message.nodes.length - 1].id : null
          );
          setChatTitle(message.chatTitle);
          updateConnectionState('connected');
          break;
        case 'ACTIVE_NODE_CHANGED':
          setActiveNodeId(message.nodeId);
          break;
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [updateConnectionState]);

  return {
    nodes,
    activeNodeId,
    clickedNodeId,
    connectionState,
    chatTitle,
    navigateToNode,
  };
}
