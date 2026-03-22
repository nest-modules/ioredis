Add a new feature to @nestjs-modules/ioredis following the established architecture.

## Instructions

1. **Read CLAUDE.md** first to understand the current architecture.
2. **Plan the feature** considering the domain-separated structure:
   - New interfaces go in `packages/ioredis/lib/interfaces/index.ts`
   - New providers go in `packages/ioredis/lib/providers/`
   - New decorators go in `packages/ioredis/lib/decorators/`
   - New utils go in `packages/ioredis/lib/utils/`
   - Module changes go in `packages/ioredis/lib/modules/`
3. **Write tests first** in `packages/ioredis/lib/__tests__/` (TDD approach).
4. **Implement the feature** following existing patterns.
5. **Export from `index.ts`** if it's part of the public API.
6. **Run checks**:
   - `pnpm check` (Biome lint)
   - `npx jest` (tests)
   - `npx tsc --noEmit` (type check)
7. **Update CLAUDE.md** with the new feature documentation.

## NestJS Module Best Practices

- Use `@Global()` only on `RedisCoreModule`, not on feature modules.
- Async options should support `useFactory`, `useClass`, and `useExisting`.
- Always accept optional `connection` name for multi-connection support.
- Provider factories should be pure functions, not class methods.
- Use `OnApplicationShutdown` for cleanup, not `OnModuleDestroy`.

## Feature: $ARGUMENTS
