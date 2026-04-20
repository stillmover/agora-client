# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Start dev server (default: localhost:5173)
bun run build        # Production build
bun run build:dev    # Development build
bun run lint         # Run oxlint
bun run lint:fix     # Lint + format fix
bun run fmt          # Format with oxfmt
bun run type-check   # TypeScript type check
bun run codegen:gql  # Regenerate GraphQL types/hooks from schema
bun run codegen:rest # Regenerate REST hooks from OpenAPI spec (Orval)
bun run preview      # Preview production build
```

No test runner is configured in this project.

**Git hooks** (via Lefthook) run automatically on commit: lint, format, typecheck, no-debug check, codegen, and commitlint.

## Architecture

This is a Reddit-like social platform frontend. It follows **Feature-Sliced Design (FSD)** — a strict layering where higher layers can import from lower ones but not vice versa:

```
pages → widgets → features → entities → shared
```

**Framework & Routing**: React 19 with TanStack Router (file-based routing). Routes live in `src/pages/` using filename conventions (`_main.tsx` = layout, `_main.r.$communityId.tsx` = nested dynamic route). The route tree at `src/routeTree.gen.ts` is auto-generated — never edit it manually.

**State Management**:

- Server state: TanStack Query v5 (configured in `src/shared/utils/query-client.ts` — 10min cache, 5min stale, no refetch on focus/mount)
- Client state: TanStack Store (`src/shared/stores/`)

**API Layer** — two parallel systems:

- **REST**: Orval auto-generates React Query hooks from OpenAPI spec into `src/shared/api/endpoints/`. Custom `apiMutator` at `src/shared/api/apiMutator.ts` wraps fetch with credentials, error handling, and sanitized dev logging.
- **GraphQL**: URQL client (`src/shared/api/gql/graphql-client.ts`) with auto-generated hooks at `src/shared/api/gql/index.ts`.

**Styling**: Tailwind CSS v4. Custom design tokens in `src/shared/design-tokens/`. UI primitives are Shadcn/UI components in `src/shared/ui/`.

**Build**: RSBuild (not Vite/Webpack directly). Config in `rsbuild.config.ts` — proxies `/api` and `/graphql` to the backend. Path alias `@/*` maps to `src/*`.

**Environment**: Zod-validated at runtime in `src/shared/utils/env.ts`. Key vars: `VITE_BACKEND_URL`, `VITE_APP_ENV`, optional `VITE_SENTRY_DSN`, `VITE_GOOGLE_CLIENT_ID`.

**Error handling**: Sentry at root (`src/sentry.ts`), React Error Boundary in `src/app/`, global query error subscription (skips 401s).

## Key Conventions

- When adding new API calls, prefer the auto-generated Orval hooks (`src/shared/api/endpoints/`) over manual fetch calls. Run `bun run codegen:rest` after OpenAPI spec changes.
- Query keys are centralized in `src/shared/api/query-keys.ts`.
- New shadcn components go in `src/shared/ui/`; use the `components.json` config for the CLI.
- Route params use `$paramName` syntax; layouts use `_layoutName.tsx` prefix.

### Cross-Repo Integration

- **Backend Partner**: Connects to `agora-backend-graphql`.
- **Infrastructure**:
  - Backend must be running (`bun run dev` + Docker) for API calls and codegen to work.
  - GraphQL endpoint is proxied via RSBuild config.
- **Syncing**: After backend schema updates, execute `bun run codegen:gql` to refresh URQL hooks and TypeScript types in `src/shared/api/gql/`.
