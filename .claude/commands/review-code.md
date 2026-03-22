Review the current codebase for issues and improvements.

## Instructions

1. Read CLAUDE.md for architecture context.
2. Check all source files in `packages/ioredis/lib/` for:

### NestJS Best Practices
- [ ] Dynamic modules use `forRoot`/`forRootAsync` correctly
- [ ] `@Global()` is used sparingly (only on core module)
- [ ] Providers use proper scoping (default singleton)
- [ ] `OnApplicationShutdown` is implemented for cleanup
- [ ] Async options support all three patterns (factory/class/existing)
- [ ] Modules export what consumers need, no more

### ioredis Best Practices
- [ ] Connections use `lazyConnect` where appropriate
- [ ] Cluster and single modes handled correctly
- [ ] `quit()` preferred over `disconnect()` for graceful shutdown
- [ ] Connection options are properly typed (`RedisOptions`/`ClusterOptions`)
- [ ] No hardcoded connection defaults (host/port)

### Node.js Best Practices
- [ ] No memory leaks (event listeners cleaned up, connections closed)
- [ ] Error handling doesn't swallow important errors silently
- [ ] No synchronous I/O in module initialization
- [ ] Proper use of `async`/`await` (no floating promises)

### Code Quality
- [ ] No deprecated APIs (check @nestjs/terminus, ioredis)
- [ ] Biome passes (`pnpm check`)
- [ ] TypeScript strict-ish (no implicit any where avoidable)
- [ ] Tests cover all public API paths
- [ ] No duplicate logic across files

3. Run `pnpm check` and `npx jest` to validate.
4. Report findings and fix issues.
5. Update CLAUDE.md if anything changed.
