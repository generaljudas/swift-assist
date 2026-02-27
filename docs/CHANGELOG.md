# Changelog

All notable changes to Swift Assist are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

_Nothing pending yet — see [ROADMAP.md](./ROADMAP.md) for what's coming._

---

## [0.3.0] — 2026-02-26

### Added
- Cypress E2E test suite covering 5 major user flows (home, login, register, contact, navigation)
- Security headers via `public/_headers`, `vercel.json`, and CSP meta tag
- Production build hardening: `GENERATE_SOURCEMAP=false`, `source-map-explorer` integration

### Changed
- All feature branches merged to `main`; repo now in clean, production-ready state
- Finalized project documentation structure (archived coordination docs → `docs/archive/`)

---

## [0.2.0] — 2026-02-19 to 2026-02-23

### Added
- Comprehensive test suite: 66 tests across 13 suites
- Accessibility improvements: ARIA labels, skip-nav link, live announcement regions
- `src/utils/logger.js` — structured logging utility replacing all raw `console.*` calls
- Code splitting with `React.lazy` + `Suspense` for all routes
- Performance optimizations (lazy loading, bundle reduction)

### Changed
- Integration tests: all services fully mocked and covered

---

## [0.1.0] — 2026-02-12 to 2026-02-16

### Added
- `src/components/ErrorBoundary.js` — React error boundary for graceful failure handling
- `src/components/ErrorDisplay.js` — standardized error UI component
- `src/components/__tests__/` — initial component test suite (11 tests passing by end of week)
- `.env.example` — safe credential template for onboarding
- ESLint + Prettier configuration
- Husky + lint-staged pre-commit hooks

### Removed
- `env` file (contained exposed secrets — **critical security fix**)
- Hardcoded Supabase credentials from `src/utils/supabaseClient.js`
- Legacy admin backdoor (`admin/admin123`) from `src/services/authService.js`
- Unused dependencies: `sequelize`, `sqlite3`, `pg`, `ajv`, `dexie`, `three`, `uuid`
- Unused folders: `models/`, `config/`, `migrations/`
- All raw `console.log` / `console.error` / `console.warn` calls from components

### Changed
- `.gitignore` updated to properly exclude all `.env*` files
- `README.md` rewritten with accurate project description and setup instructions
- Architecture decision: **Supabase only** — Sequelize/SQLite/PostgreSQL removed

### Fixed
- Exposed secrets no longer tracked in git history (credentials rotated)
