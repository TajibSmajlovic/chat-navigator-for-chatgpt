import type { Meta, StoryObj } from '@storybook/react-vite';

import '../sidepanel/styles.css';

import type { ConversationNode } from '#shared/types';

import mockNodes from '../../tests/mocks/conversation-nodes.json';
import { Footer, Header, LoadingState, MiniChat, NotChatGptState } from '../components';

interface AppProps {
  connectionState: 'loading' | 'connected' | 'not-chatgpt';
  nodes: ConversationNode[];
  activeNodeId: string | null;
  clickedNodeId: string | null;
  chatTitle: string;
}

function AppComponent({
  connectionState,
  nodes,
  activeNodeId,
  clickedNodeId,
  chatTitle,
}: AppProps) {
  const renderContent = () => {
    switch (connectionState) {
      case 'loading':
        return <LoadingState />;
      case 'not-chatgpt':
        return <NotChatGptState />;
      case 'connected':
        return (
          <MiniChat
            nodes={nodes}
            activeNodeId={activeNodeId}
            clickedNodeId={clickedNodeId}
            onNodeClick={() => {}}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-(--cn-bg-primary) text-sm text-(--cn-text-primary)">
      <Header chatTitle={chatTitle} />
      <main className="minichat flex-1 overflow-y-auto px-3 py-4">{renderContent()}</main>
      {connectionState === 'connected' && <Footer messageCount={nodes.length} />}
    </div>
  );
}

// Generate node ID options for controls
const nodeIdOptions = ['null', ...mockNodes.map((node) => node.id)];

const meta: Meta<typeof AppComponent> = {
  title: 'App',
  component: AppComponent,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    connectionState: {
      control: 'select',
      options: ['loading', 'connected', 'not-chatgpt'],
      description: 'The connection state of the app',
    },
    activeNodeId: {
      control: 'select',
      options: nodeIdOptions,
      description: 'The currently active/visible node',
      mapping: { null: null },
    },
    clickedNodeId: {
      control: 'select',
      options: nodeIdOptions,
      description: 'The node that was clicked by the user',
      mapping: { null: null },
    },
    chatTitle: {
      control: 'text',
      description: 'The title of the chat conversation',
    },
    nodes: {
      control: false,
      description: 'The conversation nodes to display',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px', height: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AppComponent>;

export const Connected: Story = {
  args: {
    connectionState: 'connected',
    nodes: mockNodes as ConversationNode[],
    activeNodeId: 'question-0',
    clickedNodeId: null,
    chatTitle: 'Software Design Principles',
  },
};

export const Loading: Story = {
  args: {
    connectionState: 'loading',
    nodes: [],
    activeNodeId: null,
    clickedNodeId: null,
    chatTitle: '',
  },
};

export const NotChatGpt: Story = {
  args: {
    connectionState: 'not-chatgpt',
    nodes: [],
    activeNodeId: null,
    clickedNodeId: null,
    chatTitle: '',
  },
};

export const EmptyConversation: Story = {
  args: {
    connectionState: 'connected',
    nodes: [],
    activeNodeId: null,
    clickedNodeId: null,
    chatTitle: 'New Chat',
  },
};
