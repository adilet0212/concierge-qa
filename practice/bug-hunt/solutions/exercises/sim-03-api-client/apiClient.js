export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Every screen of the guest app talks to the backend through this client.
export function createApiClient({ baseUrl, fetchFn, getToken, retries = 2 }) {
  async function request(method, path, body) {
    let lastError;

    // Fixed (bug 1): first attempt + `retries` extra attempts = retries + 1 in total.
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        // Fixed (bug 3): only send Authorization when there is a token ("Bearer null" is a bad request).
        const headers = { 'Content-Type': 'application/json' };
        const token = getToken();
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetchFn(`${baseUrl}${path}`, {
          method,
          headers,
          body: body === undefined ? undefined : JSON.stringify(body),
        });

        if (response.status >= 500) {
          throw new ApiError(response.status, `Server error (${response.status})`);
        }
        if (!response.ok) {
          // Fixed (bug 2): a 4xx is an error, not data. Throw it...
          const problem = await response.json();
          throw new ApiError(response.status, problem.error);
        }
        return await response.json();
      } catch (error) {
        // ...and make sure the catch block does not swallow it or retry it.
        if (error instanceof ApiError && error.status < 500) throw error;
        lastError = error;
      }
    }

    throw lastError;
  }

  return {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
  };
}
