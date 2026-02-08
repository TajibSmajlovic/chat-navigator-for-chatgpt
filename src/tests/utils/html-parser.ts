import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ConversationNode } from '#/shared/types';

import MessagesHandler from '../../content/messages-handler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Utility to parse the mock HTML file and extract conversation nodes.
 * Replicates the logic from MessagesHandler.detectMessages but for test environments.
 */
export function parseMockHtml(): ConversationNode[] {
  const htmlPath = path.resolve(__dirname, '../mocks/example_conversation.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  return MessagesHandler.detectMessages(document);
}
