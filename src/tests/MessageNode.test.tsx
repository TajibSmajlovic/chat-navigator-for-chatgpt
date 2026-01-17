import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { ConversationNode } from '#shared/types';

import { MessageNode } from '../sidepanel/components';
import { parseMockHtml } from './utils/html-parser';

const allMockNodes = parseMockHtml();
const questionNode = allMockNodes[0] as ConversationNode;
const answerNode = allMockNodes[1] as ConversationNode;

describe('MessageNode', () => {
  it('shows "You" badge for questions', () => {
    render(<MessageNode node={questionNode} isActive={false} onClick={() => {}} />);
    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('shows "ChatGPT" badge for answers', () => {
    render(<MessageNode node={answerNode} isActive={false} onClick={() => {}} />);
    expect(screen.getByText('ChatGPT')).toBeInTheDocument();
  });

  it('applies scale when active', () => {
    render(<MessageNode node={questionNode} isActive={true} onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveClass('scale-[1.02]');
  });

  it('does not apply scale when inactive', () => {
    render(<MessageNode node={questionNode} isActive={false} onClick={() => {}} />);
    expect(screen.getByRole('button')).not.toHaveClass('scale-[1.02]');
  });

  it('calls onClick with node id and type on click', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<MessageNode node={questionNode} isActive={false} onClick={handleClick} />);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledWith(questionNode.id, questionNode.type);
  });
});
