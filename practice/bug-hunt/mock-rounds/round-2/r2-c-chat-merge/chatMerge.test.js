import { describe, expect, it } from 'vitest';
import { mergeMessages } from './chatMerge.js';

const message = (id, time, text) => ({ id, sentAt: `2026-05-01T${time}:00Z`, text });

function screenThread() {
  return [message('m1', '10:00', 'Hello, could I book a table for two?'), message('m2', '10:02', 'At 8pm please')];
}

function polledMessages() {
  // Fresh objects from the server: m2 again (already on screen) plus a new m3.
  return [message('m2', '10:02', 'At 8pm please'), message('m3', '10:01', 'Of course! For which evening?')];
}

describe('mergeMessages', () => {
  it('shows every message once', () => {
    const ids = mergeMessages(screenThread(), polledMessages()).map((m) => m.id);
    expect(ids).toHaveLength(3);
    expect(new Set(ids).size).toBe(3);
  });

  it('sorts messages by time sent, oldest first', () => {
    expect(mergeMessages(screenThread(), polledMessages()).map((m) => m.id)).toEqual(['m1', 'm3', 'm2']);
  });

  it('does not modify the thread on screen', () => {
    const thread = screenThread();
    mergeMessages(thread, polledMessages());
    expect(thread).toEqual(screenThread());
  });
});
