# Swift Assist — Roadmap (v1 Direction Reset)

**Last Updated:** 2026-02-26  
**Status:** Direction reset (planning → implementation next)  
**Owner:** Javier Ibarra

This roadmap is the execution plan for Swift Assist v1. It is **forward-looking**.
For historical shipped changes, see [CHANGELOG.md](./CHANGELOG.md).

---

## v1 Non‑Negotiable Contracts (Source of Truth)

These documents define what Swift Assist **is** and what it **cannot become** in v1:

- **Context Contract:** [CONTEXT-CONTRACT-v1.md](./CONTEXT-CONTRACT-v1.md)
- **Architecture Constraints:** [ARCHITECTURE-CONSTRAINTS-v1.md](./ARCHITECTURE-CONSTRAINTS-v1.md)

If a proposed feature conflicts with either document, it is **out of scope for v1**.

---

## Vision (v1)

Swift Assist is a **closed-domain conversational interface** to **owner-defined knowledge**.
It answers only from **Metadata + a single Primary Context Body**. No retrieval, no ingestion, no hidden knowledge.

---

## Guiding Principles (v1)

1. **No retrieval** — no web search, no file ingestion, no vector DBs.
2. **Single knowledge source** — Primary Context Body is the only source of “truth.”
3. **No guessing** — if not in context/metadata, the assistant must say so and route to owner.
4. **Scope protection** — features that require crawling, uploads, or multi-doc merging are v1 “no.”
5. **Security first** — no secrets in repo; env vars only.
6. **main is deployable** — work happens on branches; PRs required.

---

## Current Phase

### Phase 0 — Direction Reset → Implementation Plan Lock

**Goal:** Convert the v1 contract into concrete product requirements and engineering tasks.  
**Exit criteria:** We can start coding without ambiguity.

#### In Progress
- [ ] Translate Context Contract into explicit runtime rules (allowed inputs, disallowed behaviors)
- [ ] Define the v1 data model: Metadata + Primary Context Body (fields, limits, validation)
- [ ] Define core user flows:
	- [ ] Owner setup (enter metadata + context body, refine)
	- [ ] Follower chat runtime (answers constrained to context)

#### Up Next
- [ ] Create an “Out of Scope for v1” list based on the contracts (uploads, ingestion, retrieval, etc.)
- [ ] Define acceptance tests (behavioral) for “No guessing / No hallucinated specifics”
- [ ] Decide tracking system (GitHub Issues/Projects) and map roadmap items to issues

#### Out of Scope (Phase 0)
- Any feature that expands knowledge sources beyond Metadata + Primary Context Body

---

## Next Phase (planned)

### Phase 1 — v1 Minimal Product (Contract-Compliant Assistant)

**Goal:** Ship the smallest working system that fully obeys the v1 contracts.

#### Candidate deliverables (draft)
- [ ] Owner can create/update assistant metadata + Primary Context Body
- [ ] Runtime chat uses only metadata + Primary Context Body
- [ ] Guardrails: “cannot answer → acknowledge limitation + suggest contacting owner”
- [ ] Basic auditability: log which context fields were used (no extra knowledge stores)

---

## Backlog (Not Scheduled)

### High Priority
- [ ] Setup “gap suggestions” (only as guidance; not stored as a secondary knowledge layer)
- [ ] UX for refining Primary Context Body before launch

### Later (Explicitly Not v1 Runtime)
- [ ] Knowledge gap loop: logging frequently unanswered questions (post‑v1)

---

## Historical Note (pre-reset)

The entries below reflect earlier work prior to the v1 scope reset and may not map 1:1 to v1 deliverables.

| Phase | Summary | Completed |
|-------|---------|-----------|
| Phase 1 | Security hardening — removed exposed credentials, fixed `.gitignore`, rotated keys | 2026-02-12 |
| Phase 2 | Code quality — removed Sequelize, replaced `console.*` with logger, added ESLint/Prettier | 2026-02-16 |
| Phase 3 | Testing & accessibility — 66 unit tests, Cypress E2E suite, ARIA improvements, code splitting | 2026-02-26 |
