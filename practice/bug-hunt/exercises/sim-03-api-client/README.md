# sim-03 · API client with retries (interview simulation)

**Difficulty:** ●●● (3/3) · this module has **more than one** bug.

## What it should do
Every screen of the guest app talks to the backend through `createApiClient(options)`, which
returns `{ get(path), post(path, body) }`. Options: `baseUrl`, `fetchFn` (usually `fetch`),
`getToken()` (returns the session token, or `null` when signed out) and `retries` (default 2).

Rules:
1. A 2xx response resolves to the parsed JSON body.
2. A network error or a 5xx response is retried. `retries` is the number of extra attempts,
   so with `retries: 2` the client tries at most 3 times. If every attempt fails, it rejects with
   the last error.
3. A 4xx response is not retried (it will not succeed next time). It rejects with an
   `ApiError` whose `status` is the HTTP status and whose `message` is the `error` field of the body.
4. The `Authorization: Bearer <token>` header is sent only when there is a token.

## Examples
| Server behaviour | Result |
|---|---|
| `200 { "id": 1 }` | resolves `{ id: 1 }` after 1 call |
| `503`, `503`, then `200 { "ok": true }` | resolves `{ ok: true }` after 3 calls |
| `503` every time | rejects with ApiError status 503 after 3 calls |
| `404 { "error": "Booking not found" }` | rejects with ApiError status 404, message `Booking not found`, after 1 call |
| signed out (`getToken()` returns `null`) | request has no Authorization header |

## Your task
Set a 15-minute timer, read `apiClient.js` top to bottom, and talk through every bug you find. Then confirm:

```bash
npm run bug-hunt -- sim-03
```
