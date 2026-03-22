# Test and Validate

Run the full validation pipeline for the ioredis package.

## Steps

1. **Run Biome check** (`pnpm check`) — fix any linting/formatting issues automatically with `pnpm check:fix` if needed.

2. **Run TypeScript type check** (`npx tsc --noEmit` from `packages/ioredis/`) — fix any type errors.

3. **Run tests** (`npx jest` from `packages/ioredis/`) — all tests must pass.

4. **Report results**: Summarize pass/fail status for each step. If any step fails, diagnose and fix the issue, then re-run.

5. **Update CLAUDE.md** if the validation revealed architectural drift from what's documented.

$ARGUMENTS
