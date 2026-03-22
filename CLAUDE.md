# @nestjs-modules/ioredis

NestJS module for ioredis — provides Redis single and cluster connections as injectable providers with full support for NestJS dependency injection, health checks, and graceful shutdown.

## IMPORTANT: Keep this file updated

Every time you make changes to the codebase (new features, refactors, architecture changes, dependency updates), you MUST update this file to reflect the current state. This is the single source of truth for AI-assisted development on this repo.

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm build` | Build all packages (via Turborepo) |
| `pnpm test` | Run all tests (via Turborepo) |
| `pnpm check` | Run Biome linter |
| `pnpm format` | Format all files with Biome |
| `pnpm check:fix` | Auto-fix Biome issues |
| `npx jest` | Run tests in current package |
| `npx tsc --noEmit` | Type-check without emitting |

---

## Architecture

### Monorepo Structure

```
/
├── packages/ioredis/          # Main library (@nestjs-modules/ioredis)
├── apps/website/              # Docusaurus documentation site
├── samples/                   # Example NestJS apps (single + cluster)
├── biome.json                 # Biome linter/formatter config
├── turbo.json                 # Turborepo task config
└── pnpm-workspace.yaml        # pnpm workspace definition
```

### Library Structure (`packages/ioredis/lib/`)

```
lib/
├── index.ts                              # Public API barrel (all exports)
├── constants.ts                          # DI tokens and module constants
├── interfaces/
│   └── index.ts                          # All TypeScript interfaces/types
├── modules/
│   ├── redis-core.module.ts              # @Global core module (forRoot/forRootAsync)
│   └── redis.module.ts                   # Public-facing module (facade over core)
├── providers/
│   ├── redis-connection.provider.ts      # Connection provider factories
│   └── redis-options.provider.ts         # Async options provider factories
├── decorators/
│   └── inject-redis.decorator.ts         # @InjectRedis() parameter decorator
├── utils/
│   └── redis-connection.util.ts          # Token helpers + createRedisConnection
├── health/
│   ├── redis-health.indicator.ts         # Health indicator (uses HealthIndicatorService)
│   ├── redis-health.module.ts            # Health module (imports TerminusModule)
│   └── redis-health.provider.ts          # Bridges Redis connection to health indicator
└── __tests__/
    ├── redis-connection.util.spec.ts     # Token + connection factory tests
    ├── inject-redis.decorator.spec.ts    # Decorator tests
    ├── redis-core.module.spec.ts         # Core module DI tests
    ├── redis.module.spec.ts              # Public module integration tests
    ├── redis-providers.spec.ts           # Provider factory unit tests
    └── redis-health.indicator.spec.ts    # Health indicator tests
```

### Module Pattern

```
RedisModule (public facade)
  └── imports RedisCoreModule (@Global, handles DI + shutdown)
        ├── creates options provider (sync or async)
        ├── creates connection provider (Redis | Cluster)
        └── implements OnApplicationShutdown (calls quit on all connections)
```

- `RedisModule` is what users import. It delegates to `RedisCoreModule`.
- `RedisCoreModule` is `@Global()` so connections are available everywhere.
- Provider creation logic lives in `providers/` (extracted from the module).
- `forRoot()` creates connections eagerly; `forRootAsync()` supports factory/class/existing patterns.

---

## Key Concepts

### Connection Types

- **single**: Standard Redis connection (`new Redis(options)` or `new Redis(url, options)`)
- **cluster**: Redis Cluster connection (`new Redis.Cluster(nodes, options)`)

### Named Connections

Multiple Redis connections via name parameter:
```typescript
RedisModule.forRoot(options, 'cache')
RedisModule.forRoot(options, 'session')

// Inject with name:
@InjectRedis('cache') private readonly cache: Redis
```

### DI Tokens

Tokens are generated as `{connectionName}_{tokenSuffix}`:
- Options: `{name}_IORedisModuleOptionsToken`
- Connection: `{name}_IORedisModuleConnectionToken`
- Default name: `'default'`

### Health Checks

Uses `@nestjs/terminus` with the new `HealthIndicatorService` API (not the deprecated `HealthCheckError`/`HealthIndicator`). The health provider bridges the default Redis connection to the indicator via `REDIS_HEALTH_INDICATOR` token.

### Graceful Shutdown

`RedisCoreModule` implements `OnApplicationShutdown`. Tracks all connection tokens in a `Set<string>` and calls `quit()` on each during shutdown. Errors during quit are silently caught.

---

## Tooling

- **Package manager**: pnpm (v10.32.1)
- **Monorepo**: Turborepo
- **Linter/formatter**: Biome 2.4.8
  - Import sorting: external first, then relative (auto-sorted)
  - Single quotes, trailing commas, 2-space indent, 80 line width
  - Decorators enabled (`unsafeParameterDecoratorsEnabled`)
- **Testing**: Jest 30 + ts-jest
  - Tests in `lib/__tests__/*.spec.ts`
  - `lazyConnect: true` in all tests (no real Redis needed)
- **TypeScript**: 5.9.3, target ES2021, CommonJS output
- **Build**: `tsc` directly (no bundler)

---

## Dependencies

### Peer Dependencies (user must install)
- `@nestjs/common` >= 6.7.0
- `@nestjs/core` >= 6.7.0
- `ioredis` >= 5.0.0

### Optional Dependencies
- `@nestjs/terminus` 11.1.1 (only for health checks)

---

## Development Conventions

1. **Always run `pnpm check` before committing** — Biome enforces sorted imports, formatting.
2. **Tests don't need Redis running** — use `lazyConnect: true` in all test fixtures.
3. **New features need tests** in `lib/__tests__/`.
4. **Public API goes through `index.ts`** — never import from internal paths in consuming code.
5. **Provider logic stays in `providers/`** — modules should be thin orchestrators.
6. **Use `Set` not `Array` for token tracking** — prevents duplicates on multiple `forRoot` calls.
