# Warm-up - Context Loading

Prepares the environment by loading optimized project context.

## 1. Load Configuration

Read the orchestrator files:
- **`context-manifest.json`** - Repositories and roles
- **`ai.properties.md`** - base_path, task_management_system

## 2. Load Compact Context (OPTIMIZED)

**IMPORTANT**: Use PROGRESSIVE loading to save context window.

### Required (warm-up)

Locate metaspecs via `context-manifest.json` (role: "specs-provider"):

```
{base_path}/{metaspecs-id}/specs/_meta/WARM_UP_CONTEXT.md  (~100 lines)
```

This file contains ALL essentials:
- Technology stack
- Context hierarchy
- 5 critical rules
- Minimal code patterns
- On-demand loading table

### On Demand (DO NOT load during warm-up)

| Need | Document |
|------|----------|
| Generate code | `CLAUDE.meta.md` |
| Architecture | `ARCHITECTURE.md` |
| Specific feature | `features/{FEATURE}.md` |
| Complete anti-patterns | `ANTI_PATTERNS.md` |

## 3. Verify Repositories

For each repository in `context-manifest.json`:
- Verify existence at `{base_path}/{repo-id}/`
- **DO NOT** read README.md now (on demand)

## 4. Verify Session (if exists)

```bash
ls -la .sessions/<ISSUE-ID>/ 2>/dev/null
```

## 5. Jidoka Principle

If problems detected: **STOP**, document, alert the user.

---

**Arguments**: #$ARGUMENTS

**Status**: Context loaded. Awaiting next command.
