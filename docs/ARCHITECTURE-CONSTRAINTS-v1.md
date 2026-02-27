# SWIFT ASSIST v1 — TECHNICAL ARCHITECTURE CONSTRAINTS

## Non-Negotiable Architecture Goal

Swift Assist v1 must remain:
- Closed-context
- Single-source-of-truth
- Low-infra

Runtime answers are generated **only** from:
- Metadata + Primary Context Body

**No other runtime knowledge sources exist.**

---

## Core Data Model (Minimum)

### Assistant (or "Bot")

```
id
owner_id
slug (public link identifier)
name
category (enum: event | service | knowledge_hub)
optional_schedule_text (string, optional)
optional_pricing_text (string, optional)
profile_image_url (optional)
background_image_url (optional)
primary_context (TEXT, required)
created_at, updated_at
is_active (bool)
expires_at (optional, future improvement)
```

### Important constraints:
- `primary_context` is the **only knowledge body**.
- Keep it as **one field** (not multiple sections) to avoid knowledge fragmentation.

---

## Runtime Chat Contract

Every runtime chat request must be constructed from:

1. **System Prompt:** "You are Swift Assist…"
   - Behavioral rules (no guessing, ask to contact owner if missing)
   - Formatting rules (mobile-friendly brevity)

2. **Developer Prompt** (generated per assistant):
   - Name, category
   - Schedule/pricing if present
   - `primary_context`

3. **User Message:**
   - User question
   - Optional short conversation history window

**That's it.**

### Hard rule:
- ❌ No retrieval calls.
- ❌ No embeddings.
- ❌ No "search" step.

---

## Setup Intelligence Contract (AI in onboarding only)

Setup Intelligence is allowed **only** for:
- Extracting metadata from pasted text
- Suggesting missing clarifications
- Producing a structured draft view for the owner to edit

The output of setup intelligence is:
- Metadata fields (optional)
- Improved `primary_context` text (suggested edits)

### Hard rules:
- Do **not** store setup chat as knowledge.
- Do **not** store extracted "FAQ lists" or parallel notes.
- Always collapse everything into `primary_context`.
- Setup AI is a helper, **not a second database**.

---

## UI Constraints (Prevent Scope Creep)

### Owner Dashboard must have only:
- Primary Context editor (single text box)
- Minimal metadata fields (name, category, optional schedule/pricing)
- Basic appearance customization (profile image, background image)
- Publish toggle + shareable link

Avoid new tabs unless they are required for v1 stability.

### Explicitly NOT in v1:
- ❌ File upload tab
- ❌ "Documents" tab
- ❌ "Knowledge base" tab
- ❌ Integrations tab
- ❌ Analytics dashboard

**If you add a new tab, you must justify it in a short design note.**

---

## Public Page Constraints (In-app browser first)

The public assistant page must be:
- Mobile-first
- Fast to load
- Minimal UI chrome
- Centered chat window
- Clear owner identity (profile image + name)

### Constraints:
- ❌ No login required for audience
- ❌ No scrolling walls of text
- ❌ No multi-step flows

**Goal:** Tap link → chat immediately.

---

## Error & Safety Behavior

If the assistant lacks information, it must:
- Say it doesn't know based on provided context
- Suggest contacting the owner (provide owner contact link if available)

It must **not**:
- ❌ Invent details
- ❌ Make confident claims about pricing/schedule if not present
- ❌ Provide unsafe instructions (standard model safety still applies)

---

## "No New Infrastructure" Rule

Any feature that requires introducing:
- Vector database
- Embeddings pipeline
- Chunking
- Document storage
- Crawler
- External API integrations (Zendesk/Intercom/etc.)

**is out of v1 scope.**

If you need it, it goes to a separate roadmap doc.

---

## Testing Constraints (Stability First)

### Minimum automated tests for v1 stability:
- [ ] Creating an assistant persists `primary_context` correctly
- [ ] Public page loads assistant by slug
- [ ] Chat request contains correct context injection
- [ ] "No info available" behavior works when context is missing a detail

Tests do not need to be perfect. But they **must protect core flows** so you stop breaking things when moving forward/back.

---

## AI-Assisted Development Rules (Operational)

When using coding assistants:
- Require **small diffs**
- Limit changes to a **single module per task**
- Prohibit **"refactor the whole repo"**
- Require **reasoning + risks** before code

### Default instruction snippet (paste into AI prompts):

```
Do not modify database schema, routing, or auth unless explicitly asked.
Make the smallest change possible.
Explain risks first.
Provide tests.
```
