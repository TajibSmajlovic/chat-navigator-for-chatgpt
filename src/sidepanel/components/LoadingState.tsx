export const LoadingState = () => (
  <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 animate-spin rounded-full border-2 border-(--cn-border) border-t-(--cn-accent)" />
    </div>
    <div>
      <p className="text-[15px] font-medium text-(--cn-text-primary)">Loading conversation...</p>
      <p className="mt-1 text-sm text-(--cn-text-muted)">Syncing with ChatGPT</p>
    </div>
  </div>
);
