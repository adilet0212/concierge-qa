import { describe, expect, it } from 'vitest';
import { amenitySentence } from './amenitySentence.js';

describe('amenitySentence', () => {
  it.each([
    [[], ''],
    [['Pool'], 'Pool'],
    [['Pool', 'Spa'], 'Pool and Spa'],
    [['Pool', 'Spa', 'Gym'], 'Pool, Spa and Gym'],
    [['Pool', 'Spa', 'Gym', 'Kids club'], 'Pool, Spa, Gym and Kids club'],
  ])('%j -> %j', (amenities, sentence) => {
    expect(amenitySentence(amenities)).toBe(sentence);
  });
});
