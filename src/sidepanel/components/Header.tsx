import type { FC } from 'react';

interface HeaderProps {
  chatTitle: string;
}

export const Header: FC<HeaderProps> = ({ chatTitle }) => {
  const displayTitle = chatTitle || 'Chat';

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-(--cn-border-light) px-4 py-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 text-(--cn-text-secondary)">Navigator</span>
        <span className="text-(--cn-text-muted)">/</span>
        <span className="truncate font-medium text-(--cn-text-primary)" title={displayTitle}>
          {displayTitle}
        </span>
      </div>
    </header>
  );
};
