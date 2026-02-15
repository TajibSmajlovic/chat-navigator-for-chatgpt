# Chat Navigator for ChatGPT

A Chrome extension that provides a MiniChat for ChatGPT conversations, making it easier to navigate long chat threads.

Add to chrome from this [link](https://chromewebstore.google.com/detail/chat-navigator-for-chatgp/hnfkbolcmboaeknfjadppmgbhobhmino?authuser=0&hl=en-GB).

## Prerequisites for running locally

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher)

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/TajibSmajlovic/chat-navigator-for-chatgpt
cd chat-navigator-for-chatgpt

# Install dependencies
pnpm install
```

### Local Development

1. **Start the development build:**

   ```bash
   pnpm dev
   ```

   This will build the extension in watch mode, automatically rebuilding on file changes.

2. **Load the extension in Chrome:**
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

3. **Test the extension:**
   - Go to [ChatGPT](https://chatgpt.com)
   - Click the extension icon to open the side panel
   - The MiniChat will display your conversation

### Running Storybook

```bash
pnpm storybook
```

Opens Storybook at `http://localhost:6006` for component development and testing.

## Project Structure

```
chat-navigator-for-chatgpt/
├── src/
│   ├── background/      # Service worker scripts
│   ├── content/         # Content scripts and logic injected into ChatGPT
│   ├── shared/          # Shared types and utilities
│   ├── sidepanel/       # Side panel UI and logic
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom React hooks
│   │   └── stories/     # Storybook stories
│   └── tests/           # Test files
├── assets/              # Extension icons and images
├── manifest.json        # Chrome extension manifest
└── vite.config.ts       # Vite configuration
```

## Troubleshooting

### Extension not updating after changes

- Make sure `pnpm dev` is running
- Go to `chrome://extensions` and click the refresh icon on the extension
- If issues persist, remove and re-load the unpacked extension
