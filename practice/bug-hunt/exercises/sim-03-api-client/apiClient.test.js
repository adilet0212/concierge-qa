import { describe, expect, it, vi } from 'vitest';
import { ApiError, createApiClient } from './apiClient.js';

const json = (status, body) => new Response(JSON.stringify(body), { status });

// fetch fake that returns the given responses one after another.
function fakeFetch(...responses) {
  return vi.fn(async () => responses.shift());
}

function client(fetchFn, token = 'abc123') {
  return createApiClient({ baseUrl: 'http://localhost:4300', fetchFn, getToken: () => token });
}

describe('createApiClient', () => {
  it('resolves the JSON body of a successful response', async () => {
    const fetchFn = fakeFetch(json(200, { id: 1 }));
    await expect(client(fetchFn).get('/api/bookings/1')).resolves.toEqual({ id: 1 });
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('retries server errors and succeeds on the third attempt', async () => {
    const fetchFn = fakeFetch(json(503, {}), json(503, {}), json(200, { ok: true }));
    await expect(client(fetchFn).get('/api/menu')).resolves.toEqual({ ok: true });
    expect(fetchFn).toHaveBeenCalledTimes(3);
  });

  it('gives up after the first try plus two retries', async () => {
    const fetchFn = fakeFetch(json(503, {}), json(503, {}), json(503, {}), json(200, {}));
    await expect(client(fetchFn).get('/api/menu')).rejects.toMatchObject({ name: 'ApiError', status: 503 });
    expect(fetchFn).toHaveBeenCalledTimes(3);
  });

  it('does not retry a 404 and rejects with the server message', async () => {
    const fetchFn = fakeFetch(json(404, { error: 'Booking not found' }), json(200, {}));
    const result = client(fetchFn).get('/api/bookings/AUR-000000');

    await expect(result).rejects.toBeInstanceOf(ApiError);
    await expect(result).rejects.toMatchObject({ status: 404, message: 'Booking not found' });
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('sends the token when the guest is signed in', async () => {
    const fetchFn = fakeFetch(json(200, {}));
    await client(fetchFn, 'abc123').get('/api/me');
    expect(fetchFn.mock.calls[0][1].headers.Authorization).toBe('Bearer abc123');
  });

  it('sends no Authorization header when the guest is signed out', async () => {
    const fetchFn = fakeFetch(json(200, {}));
    await client(fetchFn, null).get('/api/properties');
    expect(fetchFn.mock.calls[0][1].headers).not.toHaveProperty('Authorization');
  });
});
