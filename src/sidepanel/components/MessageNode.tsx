import type { FC } from 'react';
import { memo } from 'react';

import type { ConversationNode } from '#shared/types';

interface MessageNodeProps {
  node: ConversationNode;
  isActive: boolean;
  onClick: (nodeId: string, nodeType: 'question' | 'answer') => void;
}

const activeIndicator = 'ring-2 scale-[1.02] shadow-lg';
const baseClasses =
  'max-w-[85%] cursor-pointer rounded-2xl px-3 py-2.5 transition-all duration-150';

const MessageNodeComponent: FC<MessageNodeProps> = ({ node, isActive, onClick }) => {
  const isQuestion = node.type === 'question';

  const questionClasses = isActive
    ? `bg-[var(--cn-user-medium)] ring-[var(--cn-user)] ${activeIndicator} rounded-br-md`
    : 'bg-[var(--cn-user-light)] hover:bg-[var(--cn-user-medium)] rounded-br-md';

  const answerClasses = isActive
    ? `bg-[var(--cn-accent-medium)] ring-[var(--cn-accent)] ${activeIndicator} rounded-bl-md`
    : 'bg-[var(--cn-accent-light)] hover:bg-[var(--cn-accent-medium)] rounded-bl-md';

  const nodeClasses = `${baseClasses} ${isQuestion ? questionClasses : answerClasses}`;
  const badge = isQuestion ? 'You' : 'ChatGPT';
  const badgeColor = isQuestion ? 'text-[var(--cn-user)]' : 'text-[var(--cn-accent)]';

  return (
    <div className={`flex ${isQuestion ? 'justify-end' : 'justify-start'}`}>
      <div
        className={nodeClasses}
        onClick={() => onClick(node.id, node.type)}
        role="button"
        tabIndex={0}
      >
        <div className="mb-1 flex items-center gap-2">
          <span className={`text-[10px] font-semibold uppercase tracking-wide ${badgeColor}`}>
            {badge}
          </span>
        </div>
        <p className="line-clamp-4 text-[13px] leading-relaxed text-(--cn-text-primary)/90">
          {node.textPreview}
        </p>
      </div>
    </div>
  );
};

export const MessageNode = memo(
  MessageNodeComponent,
  (prevProps, nextProps) =>
    prevProps.node.id === nextProps.node.id && prevProps.isActive === nextProps.isActive
);
