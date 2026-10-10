import { describe, expect, it, vi } from 'vitest';
import { confirmBooking } from './confirmBooking.js';

function fakeApi(booking) {
  return {
    getBooking: vi.fn(async () => booking),
    updateStatus: vi.fn(async () => undefined),
  };
}

describe('confirmBooking', () => {
  it('confirms a pending booking and returns its reference', async () => {
    const api = fakeApi({ id: 7, status: 'pending', reference: 'AUR-4F7K2Q' });

    await expect(confirmBooking(api, 7)).resolves.toBe('AUR-4F7K2Q');
    expect(api.updateStatus).toHaveBeenCalledWith(7, 'confirmed');
  });

  it('refuses a cancelled booking and reports the real status', async () => {
    const api = fakeApi({ id: 8, status: 'cancelled', reference: 'AUR-9Z1X0B' });

    await expect(confirmBooking(api, 8)).rejects.toThrow('Booking 8 cannot be confirmed (status: cancelled)');
    expect(api.updateStatus).not.toHaveBeenCalled();
  });
});
