# COMPUTER 1 (LEADER) - Master Coordinator

**Branch:** `main` (stays on main, coordinates all work)  
**Role:** Planning, coordination, critical security fixes, code review  
**Status:** ACTIVE  
**Last Updated:** 2026-02-12

---

## CURRENT RESPONSIBILITIES

### Today's Tasks (Priority Order)
1. **CRITICAL SECURITY** - Remove hardcoded secrets from codebase
2. **PROJECT SETUP** - Create .env.example and fix .gitignore
3. **COORDINATION** - Review and merge Computer 2's work
4. **DOCUMENTATION** - Update README with actual project info

---

## FILES YOU OWN (Modify Freely)

### Critical Files
- `.gitignore` - Add proper exclusions
- `.env.example` - Create template (NO ACTUAL SECRETS)
- `README.md` - Update with real documentation
- `package.json` - Remove unused dependencies

### Security Critical Files
- `src/utils/supabaseClient.js` - Remove hardcoded credentials
- `src/services/authService.js` - Remove legacy backdoor (admin/admin123)
- `env` file - DELETE THIS FILE (secrets exposed)

### Coordination Files
- `WORK_COMPUTER_1_LEADER.md` (this file)
- `WORK_COMPUTER_2_WORKER.md`
- `MASTER_PLAN.md`

---

## FILES TO AVOID (Computer 2 owns these)

- `src/components/*.js` - All React components (except for reviewing PRs)
- `src/App.js` - Routing and UI structure
- CSS files - Styling updates

---

## TODAY'S EXECUTION PLAN

### Phase 1: Critical Security (30 min) ✅ COMPLETED
- [x] Delete `env` file (contains exposed secrets)
- [x] Update `.gitignore` to exclude `.env*` files
- [x] Create `.env.example` with placeholder values
- [x] Remove hardcoded credentials from `src/utils/supabaseClient.js`
- [x] Remove legacy auth backdoor from `src/services/authService.js`
- [x] Commit: `[SECURITY] Remove hardcoded credentials and fix env handling`

### Phase 2: Database Architecture Decision (20 min) ✅ COMPLETED
- [x] Decide: Keep Supabase, remove Sequelize
- [x] Delete unused files: `models/`, `config/`, `migrations/`
- [x] Remove from package.json: `sequelize`, `sqlite3`, `pg`, `ajv`, `dexie`, `three`, `uuid`
- [x] Commit: `[REFACTOR] Remove unused Sequelize/SQLite dependencies`

### Phase 3: Cleanup & Documentation (30 min) ✅ COMPLETED
- [x] Audit and remove unused dependencies (three.js, dexie, ajv removed)
- [x] Update README.md with actual project description
- [x] Add setup instructions to README
- [x] Commit: `[DOCS] Update README and remove unused deps`

### Phase 4: Code Quality Setup (20 min) ✅ COMPLETED
- [x] Add ESLint configuration
- [x] Add Prettier configuration  
- [x] Add husky + lint-staged for pre-commit hooks
- [x] Commit: `[CHORE] Add linting and formatting tools`

### Phase 5: Coordination (Ongoing) 🔄 ACTIVE
- [ ] Review Computer 2's branch when ready
- [ ] Test integration of both changes
- [ ] Merge Computer 2's work into main

---

## CRITICAL SECURITY NOTES

### ⚠️ EXPOSED SECRETS (MUST ROTATE IMMEDIATELY)
These credentials are in git history and must be rotated:

1. **Supabase** (in `env` file and `supabaseClient.js`)
   - URL: `https://ndjikafopssxqkoxkhzc.supabase.co`
   - Anon Key: `eyJhbGci...` (exposed)
   
2. **Stripe** (in `env` file)
   - Secret Key: `sk_test_51RDvEe...` (PAYMENT CREDENTIALS!)
   - Publishable Key: `pk_test_51RDvEe...`

3. **Google OAuth** (in `env` file)
   - Client ID: `61421152634-bfqtbvco580...`

**ACTION:** After cleaning code, go to each service and rotate these credentials

---

## DECISIONS MADE

✅ **Database:** Using Supabase only, removing Sequelize  
✅ **Logging:** Will add proper logger in Phase 2  
✅ **Testing:** Will add after critical fixes  
✅ **Workflow:** Computer 1 on main, Computer 2 on feature branch

---

## COORDINATION PROTOCOL

### When Computer 2 Finishes a Task:
1. Computer 2 pushes to `refactor/components-cleanup` branch
2. Computer 2 updates their status in `WORK_COMPUTER_2_WORKER.md`
3. You (Computer 1) review the branch
4. You merge into main after approval

### Daily End-of-Session:
1. Both computers push their changes
2. Both update status in respective files
3. Computer 1 syncs changes between branches if needed

---

## NEXT SESSION PRIORITIES

After today's critical fixes:
- [ ] Implement proper logging (replace all console.log)
- [ ] Add comprehensive error handling patterns
- [ ] Set up testing infrastructure
- [ ] Security headers and CORS configuration
