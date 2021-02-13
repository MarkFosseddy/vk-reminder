// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const VK: any;

export type ObserverCallback = (...args: unknown[]) => void

export function subscribe(event: string, cb: ObserverCallback) {
  VK.Observer.subscribe(event, cb);
}

export function unsubscribe(event: string, cb?: ObserverCallback) {
  VK.Observer.unsubscribe(event, cb);
}
