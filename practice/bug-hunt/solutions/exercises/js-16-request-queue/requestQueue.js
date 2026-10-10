// The concierge desk's queue of guest requests, oldest first.
export class RequestQueue {
  constructor() {
    this.requests = [];
  }

  add(request) {
    this.requests.push({ ...request, receivedAt: this.requests.length + 1 });
  }

  addAll(requests) {
    // Fixed: passing `this.add` detaches the method from the object, so `this` was undefined.
    // An arrow function keeps `this` pointing at the queue.
    requests.forEach((request) => this.add(request));
  }

  next() {
    return this.requests.shift();
  }
}
