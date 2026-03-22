Apply ioredis best practices to the code being discussed or modified.

## Connection Management

### Single Instance
```typescript
// With options
new Redis({ host: '127.0.0.1', port: 6379, password: 'secret', db: 0 })

// With URL
new Redis('redis://:password@host:6379/0')

// With URL + overrides
new Redis('redis://host:6379', { password: 'secret' })
```

### Cluster
```typescript
new Redis.Cluster(
  [{ host: '10.0.0.1', port: 6379 }, { host: '10.0.0.2', port: 6379 }],
  { redisOptions: { password: 'secret' }, scaleReads: 'slave' }
)
```

### Connection Lifecycle
- Use `lazyConnect: true` in tests and when deferring connection
- `quit()` sends QUIT command and waits for reply (graceful)
- `disconnect()` forcefully destroys the socket (use as fallback)
- Listen to `'error'` events to prevent unhandled exceptions
- Listen to `'connect'`, `'ready'`, `'close'`, `'reconnecting'` for monitoring

### Reconnection
- ioredis auto-reconnects by default with exponential backoff
- Customize with `retryStrategy` option
- Return `null` from `retryStrategy` to stop reconnecting
- `maxRetriesPerRequest: null` for blocking commands (pub/sub, streams)

### Performance
- Use pipelines for multiple commands: `redis.pipeline().get('a').set('b', 1).exec()`
- Use `multi()` for transactions (MULTI/EXEC)
- Avoid blocking commands (`BLPOP`, `SUBSCRIBE`) on shared connections — use dedicated connections
- `enableReadyCheck: true` (default) ensures Redis is ready before commands

### Error Handling
- Always handle `'error'` event on the connection
- Commands that fail during disconnect will reject their promises
- Use `try/catch` around `quit()` — may fail if already disconnected
- `ECONNREFUSED` = Redis server not reachable
- `ECONNRESET` = connection dropped (network issue)

### Pub/Sub
- Subscriber connections become dedicated — can only run subscribe commands
- Use separate connections for pub/sub and regular commands
- Named connections pattern: `forRoot(pubSubOptions, 'subscriber')`

## Apply these patterns to: $ARGUMENTS
