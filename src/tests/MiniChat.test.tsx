import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ConversationNode } from '#shared/types';

import { MiniChat } from '../sidepanel/components';
import { parseMockHtml } from './utils/html-parser';

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

const allMockNodes = parseMockHtml();
const mockNodes = allMockNodes.slice(0, 4) as ConversationNode[];

describe('MiniChat', () => {
  describe('Empty State', () => {
    it('shows empty message when no nodes', () => {
      render(<MiniChat nodes={[]} activeNodeId={null} onNodeClick={() => {}} />);

      expect(screen.getByText('No messages detected.')).toBeInTheDocument();
      expect(
        screen.getByText('Navigate to a ChatGPT conversation to see the map.')
      ).toBeInTheDocument();
    });
  });

  describe('Node Rendering', () => {
    it('renders all provided nodes', () => {
      render(<MiniChat nodes={mockNodes} activeNodeId={null} onNodeClick={() => {}} />);

      mockNodes.forEach((node) => {
        expect(screen.getByText(node.textPreview)).toBeInTheDocument();
      });
    });

    it('passes correct isActive prop to nodes', () => {
      render(<MiniChat nodes={mockNodes} activeNodeId={mockNodes[0].id} onNodeClick={() => {}} />);

      // First node should be active (have scale class)
      const firstNode = screen.getByText(mockNodes[0].textPreview).closest('[role="button"]');
      expect(firstNode).toHaveClass('scale-[1.02]');

      // Other nodes should not be active
      const secondNode = screen.getByText(mockNodes[1].textPreview).closest('[role="button"]');
      expect(secondNode).not.toHaveClass('scale-[1.02]');
    });
  });
});
