import { describe, expect, it } from 'vitest';
import { isValidReference, referenceHint } from './bookingReference.js';

describe('isValidReference', () => {
  it.each(['AUR-4F7K2Q', '  aur-4f7k2q ', 'AUR-000000'])('accepts %j', (input) => {
    expect(isValidReference(input)).toBe(true);
  });

  it.each(['AUR-4F7K2Q9', 'XAUR-4F7K2Q', 'AUR-4F7K', 'AUR_4F7K2Q', 'AUR-4F7K2Q AUR-1'])('rejects %j', (input) => {
    expect(isValidReference(input)).toBe(false);
  });
});

describe('referenceHint', () => {
  it('asks for a reference when the field is empty', () => {
    expect(referenceHint('   ')).toBe('Enter the reference from your confirmation email.');
  });

  it('shows no hint for a valid reference', () => {
    expect(referenceHint('AUR-4F7K2Q')).toBe('');
  });

  it('shows the expected format for an invalid reference', () => {
    expect(referenceHint('AUR-4F7K')).toBe('A booking reference looks like AUR-4F7K2Q.');
  });
});
