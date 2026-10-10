// Merges newly polled messages into the chat thread shown on screen.
export function mergeMessages(thread, incoming) {
  const merged = thread;

  for (const message of incoming) {
    if (!merged.includes(message)) {
      merged.push(message);
    }
  }

  return merged.sort((a, b) => a.sentAt - b.sentAt);
}
