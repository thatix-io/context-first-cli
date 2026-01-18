# Requirements Refinement

This command refines a collected issue, transforming it into clear and validated requirements.

## ⚠️ IMPORTANT: This Command DOES NOT Implement Code

**This command is ONLY for requirements refinement:**
- ✅ Refine and validate requirements
- ✅ Update issue in the task manager via MCP
- ✅ **READ** files from main repositories (read-only)
- ❌ **DO NOT implement code**
- ❌ **DO NOT edit code files**
- ❌ **DO NOT checkout branches in main repositories**
- ❌ **DO NOT make commits**

**Next step**: `/spec [ISSUE-ID]` to create the complete specification (PRD).

---

## 📋 Prerequisites

- Issue already collected via `/collect`
- Project context will be loaded automatically (see "Load MetaSpecs" section below)

## 🎯 Objective

Refine the collected issue, clarifying:
- Exact scope (what is included and what is not)
- Clear acceptance criteria
- Impact on each repository
- Technical dependencies
- Risks and constraints

## 📝 Refinement Process

### 1. Load Issue

**PRIORITY 1: Use MCP (Model Context Protocol)**

- Read `ai.properties.md` from the orchestrator to identify the `task_management_system`
- Use the appropriate MCP to fetch the issue:
  - `task_management_system=jira`: Use Jira MCP
  - `task_management_system=linear`: Use Linear MCP
  - `task_management_system=github`: Use GitHub MCP
- Load all issue data (title, description, labels, etc.)

**FALLBACK: If MCP is unavailable or fails**

- Read `./.sessions/<ISSUE-ID>/collect.md`
- If the file does not exist, inform the user of the error

### 2. Load MetaSpecs

**Automatically locate MetaSpecs**:
1. Read `context-manifest.json` from the orchestrator
2. Find the repository with `"role": "metaspecs"`
3. Read `ai.properties.md` to get the `base_path`
4. The metaspecs are located at: `{base_path}/{metaspecs-repo-id}/`
5. Read relevant `index.md` files to understand:
   - System architecture
   - Design patterns
   - Technical constraints
   - Project conventions

### 3. Scope Analysis

Clearly define:

**What IS in scope**:
- Specific functionalities to be implemented
- Repositories that will be modified
- Necessary integrations

**What IS NOT in scope**:
- Related functionalities deferred for later
- Future optimizations
- "Nice to have" features

### 4. Acceptance Criteria

Define measurable and testable criteria:

```markdown
## Acceptance Criteria

### Functional
- [ ] [Criterion 1 - specific and testable]
- [ ] [Criterion 2 - specific and testable]

### Technical
- [ ] [Technical criterion 1]
- [ ] [Technical criterion 2]

### Quality
- [ ] Unit tests implemented
- [ ] Integration tests implemented
- [ ] Documentation updated
```

### 5. Impact Analysis

For each affected repository:

```markdown
## Impact by Repository

### <repo-1>
- **Affected components**: [list]
- **Type of change**: New feature / Modification / Refactoring
- **Estimated complexity**: Low / Medium / High
- **Risks**: [specific risks]

### <repo-2>
- **Affected components**: [list]
- **Type of change**: New feature / Modification / Refactoring
- **Estimated complexity**: Low / Medium / High
- **Risks**: [specific risks]
```

### 6. Dependencies and Constraints

Identify:
- Dependencies between repositories
- Dependencies on other features/issues
- Technical constraints
- Business constraints
- Known blockers

### 7. Initial Estimate

Provide effort estimate:
- **Small**: < 1 day
- **Medium**: 1-3 days
- **Large**: 3-5 days
- **Very Large**: > 5 days (consider breaking into smaller issues)

### 8. Pending Questions

List questions that still need answers before starting implementation.

## 📄 Saving the Refinement

**PRIORITY 1: Update via MCP**

- Use the task manager MCP to update the issue
- Add acceptance criteria as a comment or custom field
- Update labels/tags if necessary (e.g., "refined", "ready-for-spec")
- Add estimate if supported by the task manager
- Inform the user: "✅ Issue [ID] updated with refinement"

**FALLBACK: Create .md file only if MCP fails**

If MCP is unavailable or fails, create/update `./.sessions/<ISSUE-ID>/refine.md`:

```markdown
# [Issue Title] - Refinement

## Scope

### Included
- [Item 1]
- [Item 2]

### Excluded
- [Item 1]
- [Item 2]

## Acceptance Criteria
[As per section 3 above]

## Impact by Repository
[As per section 4 above]

## Dependencies
- [Dependency 1]
- [Dependency 2]

## Constraints
- [Constraint 1]
- [Constraint 2]

## Estimate
[Small/Medium/Large/Very Large] - [Justification]

## Pending Questions
1. [Question 1]
2. [Question 2]

## Identified Risks
- [Risk 1 and mitigation]
- [Risk 2 and mitigation]
```

Inform the user: "⚠️ Refinement saved locally in .sessions/ (task manager not available)"

## 🔍 Validation

Validate the refinement against:
- Product strategy (if documented)
- Technical architecture (if documented)
- Team capacity
- Roadmap priorities

---

**Provided arguments**:

```
#$ARGUMENTS
```

---

## 🎯 Next Step

After approved refinement:

```bash
/spec [ISSUE-ID]
```

This command will create the complete feature specification (PRD).