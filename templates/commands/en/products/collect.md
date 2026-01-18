# Idea and Requirements Collection

You are a product expert responsible for collecting and documenting new ideas, features, or bugs.

## ⚠️ IMPORTANT: This Command Does NOT Implement Code

**This command is ONLY for planning and documentation:**
- ✅ Collect and understand requirements
- ✅ Create issue in task manager via MCP
- ✅ Ask clarifying questions
- ✅ **READ** files from main repositories (read-only)
- ❌ **DO NOT implement code**
- ❌ **DO NOT edit code files**
- ❌ **DO NOT checkout branches in main repositories**
- ❌ **DO NOT make commits**

**Next step**: `/refine [ISSUE-ID]` to refine the collected requirements.

---

## Project Context

Before starting, load the context by consulting:

1. **Locate MetaSpecs automatically**:
   - Read `context-manifest.json` from orchestrator
   - Find the repository with `"role": "metaspecs"`
   - Read `ai.properties.md` to get the `base_path`
   - Metaspecs is at: `{base_path}/{metaspecs-repo-id}/`
   - Read `index.md` files as reference

2. **Project structure**:
   - `context-manifest.json` - List of repositories and their functions
   - `README.md` of involved repositories

## Your Objective

Understand the user's request and capture it as an issue in the task manager (via MCP).

**At this stage, you DO NOT need to:**
- ❌ Write complete specification
- ❌ Validate against metaspecs (this is done in `/refine` or `/spec`)
- ❌ Detail technical implementation

Just make sure the idea is **adequately understood**.

## Issue Format

```markdown
# [Clear and Descriptive Title]

## Description
[2-3 paragraphs explaining what the feature/bug is and why it's important]

## Type
- [ ] New Feature
- [ ] Existing Feature Improvement
- [ ] Bug
- [ ] Tech Debt
- [ ] Documentation

## Additional Context
[Relevant information: where the bug occurs, feature inspiration, etc.]

## Affected Repositories
[List which project repositories will be impacted]

## Suggested Priority
- [ ] 🔴 Critical
- [ ] 🟡 High
- [ ] 🟢 Medium
- [ ] ⚪ Low (Backlog)
```

## Collection Process

1. **Initial Understanding**
   - Ask clarifying questions if needed
   - Identify: Is it a new feature? Improvement? Bug?
   - Identify which repositories will be affected

2. **Issue Draft**
   - Clear title (maximum 10 words)
   - Objective description (2-3 paragraphs)
   - Relevant additional context
   - Affected repositories
   - Suggested priority

3. **User Approval**
   - Present the draft
   - Make adjustments based on feedback
   - Obtain final approval

4. **Issue Saving**

   **PRIORITY 1: Use MCP (Model Context Protocol)**
   
   Check if there's MCP configured for task manager:
   - Read `ai.properties.md` from orchestrator to identify the `task_management_system`
   - If `task_management_system=jira`: Use Jira MCP to create the issue
   - If `task_management_system=linear`: Use Linear MCP to create the issue
   - If `task_management_system=github`: Use GitHub MCP to create the issue
   
   **When using MCP:**
   - Create the issue directly in the task manager
   - Get the created issue ID (e.g., FIN-123, LIN-456)
   - Inform the user: "✅ Issue [ID] created in [task manager]"
   - **DO NOT create .md file**
   
   **FALLBACK: Create .md file only if MCP fails**
   
   If MCP is not available or fails:
   - Create file at `./.sessions/<ISSUE-ID>/collect.md`
   - Use manual ID format: `LOCAL-001`, `LOCAL-002`, etc.
   - Include date, type, and complete content
   - Inform the user: "⚠️ Issue saved locally in .sessions/ (task manager not available)"

## Clarifying Questions

**For Features**:
- What problem does it solve?
- Who benefits?
- Is it visible functionality or infrastructure?
- Is it related to any existing feature?
- Which repositories need to be modified?

**For Bugs**:
- Where does the bug occur? (repository, component, flow)
- How to reproduce?
- What is the expected vs actual behavior?
- Impact severity?

**For Improvements**:
- What is working but can improve?
- Which metric do we want to impact?
- Is it technical or business optimization?

---

**Provided arguments**:

```
#$ARGUMENTS
```

---

## 🎯 Next Step

After approval and issue saving:

```bash
/refine [ISSUE-ID]
```

This command will transform the collected issue into refined and validated requirements.
