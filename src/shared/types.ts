// Represents a single message node in the conversation
export interface ConversationNode {
  id: string;
  type: 'question' | 'answer';
  textPreview: string;
}

// Messages sent from Content Script to Side Panel
export type ContentToPanel =
  | { type: 'NODES_UPDATED'; nodes: ConversationNode[]; chatTitle: string }
  | { type: 'ACTIVE_NODE_CHANGED'; nodeId: string | null };

// Messages sent from Side Panel to Content Script
export type PanelToContent =
  | { type: 'NAVIGATE_TO_NODE'; nodeId: string; nodeType: 'question' | 'answer' }
  | { type: 'REQUEST_SYNC' };

// Messages sent from Background to Content Script
type BackgroundToContent = { type: 'PANEL_VISIBILITY'; isOpen: boolean };

/**
 * All message types
 */
export type ExtensionMessage = ContentToPanel | PanelToContent | BackgroundToContent;
