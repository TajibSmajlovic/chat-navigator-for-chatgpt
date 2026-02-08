const CHATGPT_HOSTNAME = 'chatgpt.com';

export function isChatGptUrl(url: string | undefined): boolean {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    return parsed.hostname === CHATGPT_HOSTNAME;
  } catch {
    return false;
  }
}
