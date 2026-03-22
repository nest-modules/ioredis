Apply NestJS best practices to the code being discussed or modified.

## NestJS Dynamic Module Patterns

### forRoot / forRootAsync
- `forRoot()` for synchronous configuration
- `forRootAsync()` must support three strategies:
  - `useFactory` — function that returns options (supports `inject` for DI)
  - `useClass` — class that implements options factory interface
  - `useExisting` — reuse an existing provider that implements the factory
- Always validate that at least one strategy is provided (throw clear error)
- Accept optional `connection` parameter for multi-instance support

### Module Scoping
- `@Global()` only on core/infrastructure modules
- Feature modules should NOT be global
- Use `exports` array to control what's accessible
- `imports` in async options for cross-module dependency injection

### Dependency Injection
- Prefer constructor injection over property injection
- Use `@Inject(TOKEN)` for non-class tokens
- Create custom decorators (like `@InjectRedis()`) to hide token details
- Token naming: `{scope}_{purpose}Token` pattern

### Lifecycle Hooks (in order)
1. `OnModuleInit` — after module DI is resolved
2. `OnApplicationBootstrap` — after all modules initialized
3. `OnModuleDestroy` — on shutdown signal (before connections close)
4. `BeforeApplicationShutdown` — before shutdown
5. `OnApplicationShutdown` — final cleanup (close connections here)

### Testing
- Use `@nestjs/testing` `Test.createTestingModule()` for unit tests
- Always call `app.init()` and `app.close()` for lifecycle tests
- Mock external services at the provider level, not module level
- Test DI resolution by getting providers from the compiled module

## Apply these patterns to: $ARGUMENTS
