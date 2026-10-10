// The concierge desk's queue of guest requests, oldest first.
export class RequestQueue {
  constructor() {
    this.requests = [];
  }

  add(request) {
    this.requests.push({ ...request, receivedAt: this.requests.length + 1 });
  }

  addAll(requests) {
    requests.forEach(this.add);
  }

  next() {
    return this.requests.shift();
  }
}
