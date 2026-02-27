# Computer 2 Startup Prompt

> **⚠️ ARCHIVED — This document is historical only.**  
> It reflects pre-reset coordination prompts and is **not** authoritative for product direction.  
> The current source of truth is [ARCHITECTURE-CONSTRAINTS-v1.md](../ARCHITECTURE-CONSTRAINTS-v1.md) and [CONTEXT-CONTRACT-v1.md](../CONTEXT-CONTRACT-v1.md).

Copy and paste this into GitHub Copilot on Computer 2:

---

I'm working on the Swift Assist codebase cleanup project as **Computer 2 (Worker)**. 

**READ THIS FIRST:** Open and read `/Users/macboundgeneral/swift-assist/WORK_COMPUTER_2_WORKER.md` - this is my task list and work instructions.

**My Role:** Component and UI specialist working on branch `refactor/components-cleanup`

**My Mission Today:**
1. Remove ALL console.log statements from React components
2. Create ErrorBoundary component
3. Add component tests
4. Improve code quality in components

**CRITICAL RULES:**
- ❌ NEVER modify files in `src/services/` - Computer 1 owns these
- ❌ NEVER modify `src/utils/supabaseClient.js`
- ❌ NEVER modify `package.json` without coordination
- ✅ ONLY work on files in `src/components/` and `src/App.js`
- ✅ Commit small, focused changes regularly
- ✅ Update `WORK_COMPUTER_2_WORKER.md` with my progress

**First Steps:**
1. Create and switch to my branch: `git checkout -b refactor/components-cleanup`
2. Push the branch: `git push -u origin refactor/components-cleanup`
3. Start with Task 1: Remove console.log from all components

**Current Task:** [Tell me which task from WORK_COMPUTER_2_WORKER.md you want to work on]

---

After pasting this, ask Copilot: "I'm ready to start. Should I begin with creating the branch and removing console.logs from components?"
