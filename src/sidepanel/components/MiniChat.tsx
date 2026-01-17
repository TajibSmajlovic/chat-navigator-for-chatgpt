import type { FC } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import type { ConversationNode } from '#shared/types';

import { MessageNode } from './MessageNode';

interface MiniChatProps {
  nodes: ConversationNode[];
  activeNodeId: string | null;
  clickedNodeId?: string | null;
  onNodeClick: (nodeId: string, nodeType: 'question' | 'answer') => void;
}

export const MiniChat: FC<MiniChatProps> = ({
  nodes,
  activeNodeId,
  clickedNodeId,
  onNodeClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldScrollToActiveNode = useRef(true);

  const scrollToNode = useCallback((nodeId: string) => {
    const activeElement = containerRef?.current?.querySelector(`[data-turn-id="${nodeId}"]`);
    activeElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  useEffect(() => {
    if (clickedNodeId) {
      shouldScrollToActiveNode.current = false;
      scrollToNode(clickedNodeId);

      const interval = setTimeout(() => {
        shouldScrollToActiveNode.current = true;
      }, 3000);

      return () => {
        clearTimeout(interval);
      };
    }
  }, [clickedNodeId, scrollToNode]);

  useEffect(() => {
    if (!shouldScrollToActiveNode.current) return;

    if (activeNodeId) {
      scrollToNode(activeNodeId);
    }
  }, [activeNodeId, scrollToNode]);

  if (nodes.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center text-(--cn-text-muted)">
        <p>No messages detected.</p>
        <p className="mt-2 text-xs text-(--cn-text-dimmed)">
          Navigate to a ChatGPT conversation to see the map.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      {nodes.map((node) => (
        <div key={node.id} data-turn-id={node.id}>
          <MessageNode
            node={node}
            isActive={
              !shouldScrollToActiveNode.current && clickedNodeId
                ? node.id === clickedNodeId
                : node.id === activeNodeId
            }
            onClick={onNodeClick}
          />
        </div>
      ))}
    </div>
  );
};
