export const NotChatGptState = () => {
  const handleOpenChatGpt = () => {
    chrome.tabs.create({ url: 'https://chatgpt.com' });
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--cn-accent-light)">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--cn-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </div>
      <div>
        <p className="text-[15px] font-medium text-(--cn-text-primary)">Not on ChatGPT</p>
        <p className="mt-2 text-sm leading-relaxed text-(--cn-text-muted)">
          This extension only works on <span className="text-(--cn-accent)">chatgpt.com</span>
        </p>
      </div>
      <button
        onClick={handleOpenChatGpt}
        className="mt-2 rounded-lg bg-(--cn-accent) px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-(--cn-accent-hover)"
      >
        Open ChatGPT
      </button>
    </div>
  );
};
