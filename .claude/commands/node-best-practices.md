Apply Node.js best practices to the code being discussed or modified.

## Error Handling
- Never swallow errors silently (empty `catch {}`) unless explicitly intentional (like graceful shutdown)
- Use typed errors: `error instanceof Error` before accessing `.message`
- Validate at system boundaries (user input, external APIs), trust internal code
- Prefer `try/catch` over `.catch()` for async/await code

## Memory & Performance
- Clean up event listeners when done (`.off()` or `AbortController`)
- Close connections/handles in shutdown hooks
- Avoid holding references to large objects longer than needed
- Use `Set`/`Map` over arrays for lookups and uniqueness guarantees
- Prefer `for...of` over `.forEach()` for async iteration

## Async Patterns
- Never fire-and-forget promises (unhandled rejections crash Node 15+)
- Use `Promise.allSettled()` when multiple operations can fail independently
- Prefer `async/await` over raw `.then()` chains
- Don't `await` inside loops if operations are independent — batch with `Promise.all()`

## Module Design
- Export explicit named exports, not default exports
- Keep barrel files (`index.ts`) as re-exports only, no logic
- Use `type` imports/exports for types when possible (tree-shaking)
- Avoid circular dependencies — use dependency injection or events

## Testing
- Tests should be deterministic — no real network/DB calls in unit tests
- Use `jest.spyOn()` over manual mocks when possible (preserves types)
- Clean up after tests: close connections, restore mocks, clear timers
- Test error paths, not just happy paths
- Avoid `any` in tests — use proper types for better coverage

## Security
- Never log passwords, tokens, or connection strings
- Use environment variables for secrets, not hardcoded values
- Validate and sanitize any user-provided Redis keys
- Set appropriate timeouts on connections and commands

## Apply these patterns to: $ARGUMENTS
