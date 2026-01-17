import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ConversationNode } from '#shared/types';

import { parseMockHtml } from './utils/html-parser';

Element.prototype.scrollIntoView = vi.fn();

const allMockNodes = parseMockHtml();
const mockNodes = allMockNodes.slice(0, 4) as ConversationNode[];
const mockNavigateToNode = vi.fn();
const mockState = {
  nodes: [] as ConversationNode[],
  activeNodeId: null as string | null,
  clickedNodeId: null as string | null,
  connectionState: 'loading' as 'loading' | 'connected' | 'not-chatgpt',
  chatTitle: '',
};

vi.mock('../sidepanel/hooks', () => ({
  useChromeMessages: () => ({
    ...mockState,
    navigateToNode: mockNavigateToNode,
  }),
}));

const { App } = await import('../sidepanel/components/App');

function setMockState(updates: Partial<typeof mockState>) {
  Object.assign(mockState, updates);
}

function resetMockState() {
  mockState.nodes = [];
  mockState.activeNodeId = null;
  mockState.clickedNodeId = null;
  mockState.connectionState = 'loading';
  mockState.chatTitle = '';
  mockNavigateToNode.mockClear();
}

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetMockState();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Tests happy path E2E flow', async () => {
    const { rerender } = render(<App />);

    expect(screen.getByText('Loading conversation...')).toBeInTheDocument();
    expect(screen.getByText('Navigator')).toBeInTheDocument();

    setMockState({
      connectionState: 'connected',
      nodes: mockNodes,
      chatTitle: 'Design Principles Discussion',
      activeNodeId: mockNodes[0].id,
    });
    rerender(<App />);

    expect(screen.queryByText('Loading conversation...')).not.toBeInTheDocument();
    expect(screen.getByText('Design Principles Discussion')).toBeInTheDocument();
    expect(screen.getByText(mockNodes[0].textPreview)).toBeInTheDocument();
    expect(screen.getByText('4 messages')).toBeInTheDocument();

    // Highlights active node as user scrolls in chat 👇🏻
    let node = screen.getByText(mockNodes[0].textPreview).closest('[role="button"]'); // First node is active
    expect(node).toHaveClass('scale-[1.02]');

    setMockState({
      connectionState: 'connected',
      nodes: mockNodes,
      activeNodeId: mockNodes[2].id,
    });
    rerender(<App />);

    node = screen.getByText(mockNodes[0].textPreview).closest('[role="button"]');
    expect(node).not.toHaveClass('scale-[1.02]');

    const newNode = screen.getByText(mockNodes[2].textPreview).closest('[role="button"]');
    expect(newNode).toHaveClass('scale-[1.02]');

    // Navigates to node when clicked 👇🏻
    vi.useRealTimers();
    const user = userEvent.setup();

    setMockState({
      connectionState: 'connected',
      nodes: mockNodes,
    });

    rerender(<App />);

    node = screen.getByText(mockNodes[0].textPreview).closest('[role="button"]');
    await user.click(node!);

    expect(mockNavigateToNode).toHaveBeenCalledWith(mockNodes[0].id, mockNodes[0].type);
  });

  it('shows not-chatgpt state when not on chatgpt.com', () => {
    const { rerender } = render(<App />);

    setMockState({ connectionState: 'not-chatgpt' });
    rerender(<App />);

    expect(screen.getByText('Not on ChatGPT')).toBeInTheDocument();
    expect(screen.getByText('Open ChatGPT')).toBeInTheDocument();
  });
});
