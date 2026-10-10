import { describe, expect, it } from 'vitest';
import { greeting } from './greeting.js';

describe('greeting', () => {
  it('uses the preferred name when there is one', () => {
    expect(greeting({ firstName: 'Amelia', profile: { preferredName: 'Mia' } })).toBe('Welcome back, Mia');
  });

  it('falls back to the first name', () => {
    expect(greeting({ firstName: 'Liam', profile: {} })).toBe('Welcome back, Liam');
  });

  it('works for guests created at the front desk', () => {
    expect(greeting({ firstName: 'Noor' })).toBe('Welcome back, Noor');
  });
});
