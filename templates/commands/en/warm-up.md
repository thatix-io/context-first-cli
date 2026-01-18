# Warm-up - Context Loading

This command prepares the environment by loading the full context of the current project and workspace.

## 1. Identify Current Workspace

Check if you are inside a workspace created by `context-cli`:

```bash
# Check if you are in a workspace directory
pwd
# The workspace is usually located at ~/workspaces/<ISSUE-ID>/
```

If you are not in a workspace, ask the user which workspace to use or if a new one should be created with `feature:start`.

## 📋 Project Configuration

**⚠️ IMPORTANT: Always read the project configuration files BEFORE running this command!**

### Required Files

1. **`context-manifest.json`** (root of the orchestrator)
   - List of project repositories
   - Roles of each repository (metaspecs, application, etc.)
   - URLs and dependencies between repositories

2. **`ai.properties.md`** (root of the orchestrator)
   - Project settings (`project_name`, `base_path`)
   - Task management system (`task_management_system`)
   - Credentials and specific configurations

### How to Read

```bash
# 1. Read context-manifest.json
cat context-manifest.json

# 2. Read ai.properties.md
cat ai.properties.md
```

### Essential Information

After reading the files, you will have:
- ✅ Complete list of project repositories
- ✅ Location of the metaspecs repository
- ✅ Base path to locate repositories
- ✅ Configured task management system
- ✅ Project-specific configurations

**🛑 DO NOT proceed without reading these files!** They contain critical information for the correct execution of the command.

## 2. Load Project Configuration

You are already in the project orchestrator (root of the current repository).

1. **Verify you are at the orchestrator root**: `pwd` should show the orchestrator directory
2. **Read the `context-manifest.json` file** at the orchestrator root
3. **Read the `ai.properties.md` file** to obtain local configurations (base_path, etc.)

## 3. Load Project Manifest

Read the `context-manifest.json` from the orchestrator to understand:
- Complete list of ecosystem repositories
- URL of the MetaSpecs repository
- Dependencies between repositories
- Roles of each repository (application, library, service, specs-provider)

## 4. Load MetaSpecs

The MetaSpecs repository is **separate** and defined in `context-manifest.json` with `role: "metaspecs"`.

**Locate the metaspecs repository:**

1. Read `context-manifest.json` and find the repository with `role: "metaspecs"`
2. Obtain the `id` of that repository (e.g., "my-project-metaspecs")
3. Read `ai.properties.md` to get the `base_path`
4. The metaspecs repository is located at: `{base_path}/{metaspecs-id}/`

**Always read the index files first:**

1. **`README.md`** - Project overview and documentation structure
2. **`index.md`** (in root or subfolders) - Index of available specifications

**Use the indexes as a reference** to navigate to the specific specifications you need. Do not assume specific files exist — always consult the indexes first.

## 5. Load Current Session (if any)

Check if there is a saved session for this workspace:

```bash
# Look for session in the orchestrator
ls -la .sessions/<ISSUE-ID>/ 2>/dev/null
```

If it exists, read the session files to recover the context of the last execution.

## 6. Repository Context

For each repository present in the workspace, read:
- `README.md` - Purpose and overview of the repository
- Main configuration file (`package.json`, `pom.xml`, `requirements.txt`, etc.)

## 7. Smart Navigation

- **Code**: Use search tools (glob, grep) to locate relevant files
- **Documentation**: Use MetaSpecs indexes as reference
- **Wait for Instructions**: DO NOT read other files now. Wait for the next command.

## 8. Jidoka Principle (Stop Upon Detecting Problems)

If you detect misalignment, conflicts, or problems:
1. 🛑 **STOP** immediately
2. 📝 **DOCUMENT** the problem found
3. 💬 **ALERT** the user before proceeding

---

**Provided arguments**: #$ARGUMENTS

**Status**: Context loaded. Awaiting next command.