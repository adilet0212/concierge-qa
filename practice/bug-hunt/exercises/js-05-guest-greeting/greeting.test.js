import { describe, expect, it } from 'vitest';
import { greeting, loyaltyBadge } from './greeting.js';

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

describe('loyaltyBadge', () => {
  it('capitalises the tier', () => {
    expect(loyaltyBadge({ firstName: 'Mia', loyaltyTier: 'gold' })).toBe('Gold member');
  });

  it('shows no badge for guests outside the programme', () => {
    expect(loyaltyBadge({ firstName: 'Liam' })).toBe('');
  });
});
