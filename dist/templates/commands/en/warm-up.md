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

You are already in the project's orchestrator (current repository root).

1. **Verify you're at the orchestrator root**: `pwd` should show the orchestrator directory
2. **Read the `context-manifest.json` file** at the orchestrator root
3. **Read the `ai.properties.md` file** to get local configurations (base_path, etc.)

## 3. Load Project Manifest

Read the `context-manifest.json` from the orchestrator to understand:
- Complete list of ecosystem repositories
- MetaSpecs repository URL
- Dependencies between repositories
- Role of each repository (application, library, service, specs-provider)

## 4. Load MetaSpecs

The MetaSpecs repository is **separate** and defined in `context-manifest.json` with `role: "metaspecs"`.

**Locate the metaspecs repository:**

1. Read `context-manifest.json` and find the repository with `role: "metaspecs"`
2. Get the `id` of that repository (e.g., "my-project-metaspecs")
3. Read `ai.properties.md` to get the `base_path`
4. The metaspecs repository is at: `{base_path}/{metaspecs-id}/`

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
