// Merges newly polled messages into the chat thread shown on screen.
export function mergeMessages(thread, incoming) {
  // Fixed (bug 2): includes() compares object references, and polled messages are fresh
  // copies, so nothing ever matched. Compare by id instead.
  const shownIds = new Set(thread.map((message) => message.id));
  const newMessages = incoming.filter((message) => !shownIds.has(message.id));

  // Fixed (bug 1): `const merged = thread` was the same array, so push() changed React state.
  // Build a new array.
  const merged = [...thread, ...newMessages];

  // Fixed (bug 3): subtracting ISO strings gives NaN. Compare the times as numbers.
  return merged.sort((a, b) => Date.parse(a.sentAt) - Date.parse(b.sentAt));
}
