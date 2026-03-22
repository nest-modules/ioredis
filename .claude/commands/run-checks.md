Run all quality checks on the codebase and report results.

## Steps

1. **Biome lint**: `pnpm check`
2. **TypeScript**: `cd packages/ioredis && npx tsc --noEmit`
3. **Tests**: `cd packages/ioredis && npx jest --verbose`
4. **Build**: `pnpm build`

Report each step's result. If any step fails, diagnose and fix the issue before proceeding to the next step.
