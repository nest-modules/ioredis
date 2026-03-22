---
sidebar_position: 3
---

# Cluster

## Configuration

To connect to a Redis Cluster, use `type: 'cluster'`:

```typescript
RedisModule.forRoot({
  type: 'cluster',
  nodes: [
    { host: '127.0.0.1', port: 7000 },
    { host: '127.0.0.1', port: 7001 },
    { host: '127.0.0.1', port: 7002 },
  ],
  options: {
    redisOptions: {
      password: 'your-password',
    },
  },
});
```

## Async Cluster Configuration

```typescript
RedisModule.forRootAsync({
  useFactory: () => ({
    type: 'cluster',
    nodes: [
      { host: '127.0.0.1', port: 7000 },
      { host: '127.0.0.1', port: 7001 },
    ],
  }),
});
```
