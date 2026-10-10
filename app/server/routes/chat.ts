import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import type { ChatMessage } from '../../shared/types.ts';
import { findProperty } from '../catalog.ts';
import { currentGuest, requireGuest, sendError } from '../http.ts';
import { store } from '../store.ts';

// Chat with the concierge. A real hotel would route messages to staff; this demo
// answers every guest message with a canned reply after a short "typing" delay.
export const chatRoutes = Router();
chatRoutes.use(requireGuest);

const AUTO_REPLY_DELAY_MS = 800;
const MAX_MESSAGE_LENGTH = 500;

function threadFor(email: string, propertyId: string): ChatMessage[] {
  const key = `${email}:${propertyId}`;
  if (!store.chats.has(key)) store.chats.set(key, []);
  return store.chats.get(key)!;
}

chatRoutes.get('/:propertyId', (req, res) => {
  if (!findProperty(req.params.propertyId)) {
    sendError(res, 404, 'PROPERTY_NOT_FOUND', 'We could not find that property.');
    return;
  }
  res.json(threadFor(currentGuest(res).email, req.params.propertyId));
});

chatRoutes.post('/:propertyId', (req, res) => {
  const text = String(req.body?.text ?? '').trim();
  if (!findProperty(req.params.propertyId)) {
    sendError(res, 404, 'PROPERTY_NOT_FOUND', 'We could not find that property.');
    return;
  }
  if (text.length === 0 || text.length > MAX_MESSAGE_LENGTH) {
    sendError(res, 400, 'VALIDATION_FAILED', `Messages must be 1 to ${MAX_MESSAGE_LENGTH} characters.`, ['text']);
    return;
  }

  const thread = threadFor(currentGuest(res).email, req.params.propertyId);
  const message: ChatMessage = { id: randomUUID(), from: 'guest', text, sentAt: new Date().toISOString() };
  thread.push(message);

  setTimeout(() => {
    thread.push({ id: randomUUID(), from: 'concierge', templateKey: 'chat.autoReply', sentAt: new Date().toISOString() });
  }, AUTO_REPLY_DELAY_MS);

  res.status(201).json(message);
});
