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

    for (let attempt = 1; attempt < retries; attempt++) {
      try {
        const response = await fetchFn(`${baseUrl}${path}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        });

        if (response.status >= 500) {
          throw new ApiError(response.status, `Server error (${response.status})`);
        }
        if (!response.ok) {
          const problem = await response.json();
          return { error: problem.error };
        }
        return await response.json();
      } catch (error) {
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
