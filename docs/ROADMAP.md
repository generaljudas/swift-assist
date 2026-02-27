# Swift Assist — Project Roadmap

**Last Updated:** 2026-02-26  
**Status:** Active Development  
**Owner:** <!-- your name / team -->

This document defines the project's current direction, upcoming phases, and the constraints that govern all decisions. Update this when priorities shift — it is the single source of truth for where Swift Assist is headed.

---

## Vision

<!-- One or two sentences describing the end state of the product. -->
> _What does Swift Assist look like when it's "done"? Who uses it and what problem does it solve?_

---

## Guiding Principles

> These are the non-negotiable rules that every contribution must respect.

1. **Security first** — No secrets in the repo. Credentials always via environment variables.
2. **Test before ship** — No feature merges to `main` without accompanying tests.
3. **Supabase is the database** — No new ORM, no local SQLite, no dual-database patterns.
4. **main is always deployable** — Feature work lives on branches; `main` reflects production.
5. <!-- Add your own rule -->
6. <!-- Add your own rule -->

---

## Current Phase

### Phase 4 — <!-- Give it a name, e.g. "Feature Buildout" -->

**Goal:** <!-- What does success look like at the end of this phase? -->  
**Target dates:** <!-- e.g. 2026-03-01 to 2026-03-31 -->  
**Branch strategy:** <!-- e.g. feature/* branches off main, PR required to merge -->

#### In Progress
- [ ] <!-- Task -->
- [ ] <!-- Task -->

#### Up Next
- [ ] <!-- Task -->
- [ ] <!-- Task -->

#### Out of Scope (this phase)
- <!-- Explicitly list things you are NOT doing this phase to avoid scope creep -->

---

## Backlog

> Rough future work, not yet committed to a phase. Ordered loosely by priority.

### High Priority
- [ ] <!-- e.g. Rate limiting on the chat API endpoint -->
- [ ] <!-- e.g. Admin ability to delete / ban users -->

### Medium Priority
- [ ] <!-- e.g. Dark mode support -->
- [ ] <!-- e.g. Webhook support for chat events -->

### Low Priority / Nice to Have
- [ ] <!-- e.g. Export chat history as PDF -->
- [ ] <!-- e.g. Multi-language support -->

---

## Completed Phases

| Phase | Summary | Completed |
|-------|---------|-----------|
| Phase 1 | Security hardening — removed exposed credentials, fixed `.gitignore`, rotated keys | 2026-02-12 |
| Phase 2 | Code quality — removed Sequelize, replaced `console.*` with logger, added ESLint/Prettier | 2026-02-16 |
| Phase 3 | Testing & accessibility — 66 unit tests, Cypress E2E suite, ARIA improvements, code splitting | 2026-02-26 |

_See [CHANGELOG.md](./CHANGELOG.md) for detailed change history per release._

---

## Architecture Decisions

Key decisions that are locked and should not be revisited without a deliberate discussion.

| Decision | Rationale | Date |
|----------|-----------|------|
| Supabase only (no Sequelize/SQLite) | Reduce complexity; one auth + DB layer | 2026-02-12 |
| React on the frontend, no SSR | Team familiarity; Vercel deployment | — |
| <!-- Decision --> | <!-- Why --> | <!-- When --> |

---

## How to Use This Document

- **Adding a task:** Drop it in the Backlog. Move it to the current phase when work begins.
- **Completing a task:** Check the box, then add an entry to [CHANGELOG.md](./CHANGELOG.md).
- **Changing direction:** Update the Vision, Guiding Principles, or current phase — and note _why_ in CHANGELOG.md under `[Unreleased]`.
- **Starting a new phase:** Move the current phase to the Completed Phases table, create a new "Current Phase" section.
