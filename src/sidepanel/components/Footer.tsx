import type { FC } from 'react';
import { memo } from 'react';

interface FooterProps {
  messageCount: number;
}

const FooterComponent: FC<FooterProps> = ({ messageCount }: FooterProps) => {
  const text = messageCount === 1 ? '1 message' : `${messageCount} messages`;

  return (
    <footer className="flex shrink-0 items-center justify-center border-t border-(--cn-border-light) px-4 py-2">
      <span className="font-mono text-xs text-(--cn-text-secondary)">{text}</span>
    </footer>
  );
};

export const Footer = memo(FooterComponent);
