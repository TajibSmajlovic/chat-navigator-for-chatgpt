import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock Chrome API
const chromeMock = {
  runtime: {
    sendMessage: vi.fn().mockResolvedValue(undefined),
    connect: vi.fn().mockReturnValue({
      disconnect: vi.fn(),
      onMessage: { addListener: vi.fn() },
      onDisconnect: { addListener: vi.fn() },
    }),
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
  },
  tabs: {
    query: vi.fn().mockResolvedValue([{ id: 1 }]),
    sendMessage: vi.fn().mockResolvedValue(undefined),
  },
  sidePanel: {
    open: vi.fn(),
    setPanelBehavior: vi.fn(),
  },
  action: {
    onClicked: {
      addListener: vi.fn(),
    },
  },
};

vi.stubGlobal('chrome', chromeMock);
