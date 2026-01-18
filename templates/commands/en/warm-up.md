# Warm-up - Context Loading

This command prepares the environment by loading the complete context of the project and current workspace.

## 1. Identify Current Workspace

Check if you are inside a workspace created by `context-cli`:

```bash
# Check if you're in a workspace directory
pwd
# The workspace is usually at ~/workspaces/<ISSUE-ID>/
```

If you're not in a workspace, ask the user which workspace to use or if you should create a new one with `feature:start`.

## 2. Load Project Configuration

Identify the project's orchestrator:

1. **Look for the `.contextrc.json` file** in any of the workspace repositories
2. This file contains the orchestrator repository URL
3. If the orchestrator is not cloned locally yet, clone it

## 3. Load Project Manifest

Read the `context-manifest.json` from the orchestrator to understand:
- Complete list of ecosystem repositories
- MetaSpecs repository URL
- Dependencies between repositories
- Role of each repository (application, library, service, specs-provider)

## 4. Load MetaSpecs

The MetaSpecs repository is defined in `context-manifest.json` (usually with `role: "specs-provider"`).

**Always read the index files first:**

1. **`README.md`** - Project overview and documentation structure
2. **`index.md`** (in root or subfolders) - Index of available specifications

**Use the indexes as reference** to navigate to the specific specifications you need. Don't assume specific files exist - always consult the indexes first.

## 5. Load Current Session (if exists)

Check if there's a saved session for this workspace:

```bash
# Look for session in orchestrator
ls -la .sessions/<ISSUE-ID>/ 2>/dev/null
```

If it exists, read the session files to recover the context from the last execution.

## 6. Repository Context

For each repository present in the workspace, read:
- `README.md` - Repository purpose and overview
- Main configuration file (`package.json`, `pom.xml`, `requirements.txt`, etc.)

## 7. Smart Navigation

- **Code**: Use search tools (glob, grep) to locate relevant files
- **Documentation**: Use MetaSpecs indexes as reference
- **Wait for Instructions**: DO NOT read other files now. Wait for the next command.

## 8. Jidoka Principle (Stop When Detecting Problems)

If you detect misalignment, conflicts, or problems:
1. 🛑 **STOP** immediately
2. 📝 **DOCUMENT** the problem found
3. 💬 **ALERT** the user before proceeding

---

**Provided arguments**: #$ARGUMENTS

**Status**: Context loaded. Waiting for next command.
