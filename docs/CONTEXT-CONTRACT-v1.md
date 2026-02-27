# SWIFT ASSIST v1 — CONTEXT CONTRACT (REVISED)

## Core Principle

- Swift Assist does not search for knowledge.
- Swift Assist reflects knowledge.
- The assistant answers questions only from information explicitly provided by the owner.

There is:
- No document ingestion
- No external retrieval
- No hidden knowledge layer

All intelligence is bounded by owner-defined context.

---

## The Context Model

Each assistant is powered by:

### A. Metadata (light structure)
- Name
- Category
- Optional schedule
- Optional pricing

### B. Primary Context Body (single source of truth)
A large freeform text area where the owner describes:
- What they offer
- What they do
- What followers should know
- What they recommend
- Clarifications and edge cases

This is the **ONLY knowledge source**.

There are no additional layers such as FAQs or uploaded materials.

---

## Design Philosophy

Swift Assist is a **closed-domain conversational layer**.

It transforms:
- Owner knowledge → Structured context → Conversational accessibility

It does **NOT** transform:
- Documents → Retrieval index → Ranked search responses

---

## Quality Dependency Principle

The quality of responses depends **directly** on the clarity and completeness of the owner's context.

Swift Assist does not compensate for missing knowledge.

Instead, Swift Assist:
- Encourages clarity during setup
- Helps identify likely gaps
- Supports refinement before launch

---

## Setup Intelligence

During setup, AI may:
- Extract structured info from freeform input
- Suggest areas that may need clarification
- Simulate likely follower questions

**Example:**
```
"You may want to clarify:
• Compatibility
• Turnaround time
• Pricing structure"
```

These suggestions exist **only to help improve the Primary Context**.

They are **not stored separately**.

They do **not create a secondary knowledge layer**.

---

## Runtime Constraint

At runtime, the assistant answers **exclusively** from:
- Metadata + Primary Context Body

If a question cannot be answered from this information:

The assistant should:
- Acknowledge the limitation
- Suggest contacting the owner

**No guessing.**  
**No hallucinated specifics.**

---

## Future Knowledge Gap Loop (Not v1)

Swift Assist may later support logging of:
- Frequently unanswered questions

This would help owners refine context over time.

**This is not part of v1 runtime behavior.**

---

## Scope Protection Statement

If a feature requires:
- File uploads
- Multi-document ingestion
- Vector databases
- External crawling
- Cross-domain merging

**It violates the Swift Assist v1 Context Contract.**

---

## System Identity

- Swift Assist is **not** a knowledge retrieval engine.
- It is a **conversational interface to owner-defined knowledge**.
- The assistant **reasons** from provided context.
- It does **not search** for answers.
