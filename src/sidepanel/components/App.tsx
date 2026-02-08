import { useChromeMessages } from '../hooks';
import { Footer } from './Footer';
import { Header } from './Header';
import { LoadingState } from './LoadingState';
import { MiniChat } from './MiniChat';
import { NotChatGptState } from './NotChatGptState';

export const App = () => {
  const { nodes, activeNodeId, clickedNodeId, connectionState, chatTitle, navigateToNode } =
    useChromeMessages();

  const renderContent = () => {
    switch (connectionState) {
      case 'loading':
        return <LoadingState />;
      case 'not-chatgpt':
        return <NotChatGptState />;
      case 'connected':
        return (
          <MiniChat
            key={chatTitle}
            nodes={nodes}
            activeNodeId={activeNodeId}
            clickedNodeId={clickedNodeId}
            onNodeClick={navigateToNode}
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
};
