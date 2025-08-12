export function retryEventSource(url: string): EventSource {
  let retryDelay = 1000; // Start with 1 second
  const maxDelay = 30000; // Cap at 30 seconds

  const connect = (): EventSource => {
    const eventSource = new EventSource(url);

    eventSource.onerror = () => {
      eventSource.close();
      retryDelay = Math.min(retryDelay * 2, maxDelay); // Exponential backoff
      setTimeout(() => connect(), retryDelay);
    };

    return eventSource;
  };

  return connect();
}
