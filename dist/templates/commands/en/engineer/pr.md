# Pull Request Creation

This command creates Pull Requests for all modified repositories in the workspace.

## 📋 Prerequisites

Before creating PRs, make sure that:
- You have run `/pre-pr` and all validations passed
- All commits have been made
- All tests are passing
- Documentation is up to date

## 🎯 PR Creation Process

### 1. Identify Modified Repositories

For each repository in the workspace, check:
```bash
cd <repositório>
git status
git log origin/main..HEAD  # View unpushed commits
```

### 2. Push Branches

For each modified repository:
```bash
cd <repositório>
git push origin <branch-name>
```

### 3. Create Pull Requests

For each repository, create a PR using GitHub CLI or the web interface:

**Using GitHub CLI**:
```bash
cd <repositório>
gh pr create --title "[ISSUE-ID] Feature Title" \
  --body "$(cat ../.sessions/<ISSUE-ID>/pr-description.md)" \
  --base main
```

**PR Description Template**:

```markdown
## 🎯 Objective

[Brief description of what this PR does]

## 📝 Changes

### Repository: <nome-do-repo>

- [Change 1]
- [Change 2]
- [Change 3]

## 🔗 Relationships

- **Issue**: <ISSUE-ID>
- **Related PRs**: 
  - <repo-1>#<PR-number>
  - <repo-2>#<PR-number>

## ✅ Checklist

- [ ] Code implemented and tested
- [ ] Unit tests added/updated
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Peer reviewed (after PR creation)

## 🧪 How to Test

1. [Step 1]
2. [Step 2]
3. [Expected result]

## 📸 Screenshots/Demos

[If applicable, add screenshots or links to demos]

## 🔍 Notes for Reviewers

- [Point of attention 1]
- [Point of attention 2]
```

### 4. Link PRs

If there are multiple PRs (one per repository):
- Add cross-links between the PRs
- Document the recommended merge order
- Indicate dependencies between PRs

### 5. Update Issue in Task Manager

If the task manager is configured:
- Move the issue to "In Review" or "PR Open"
- Add PR links in the issue
- Add a comment summarizing the changes

### 6. Session Documentation

Update `./.sessions/<ISSUE-ID>/pr.md`:

```markdown
# [Feature Title] - Pull Requests

## Created PRs

### <repo-1>
- **Link**: <PR URL>
- **Status**: Open
- **Commits**: X commits

### <repo-2>
- **Link**: <PR URL>
- **Status**: Open
- **Commits**: Y commits

## Recommended Merge Order

1. <repo-1> - [Justification]
2. <repo-2> - [Justification]

## Merge Notes

- [Important note 1]
- [Important note 2]
```

## 🔍 Final Checklist

Before requesting review:
- [ ] All PRs created
- [ ] Complete and clear descriptions
- [ ] PRs linked to each other
- [ ] Issue updated in task manager
- [ ] Tests passing in CI/CD
- [ ] Session documentation complete

## 📢 Communication

Notify the team about the PRs:
- Mention relevant reviewers
- Highlight critical changes or breaking changes
- Indicate urgency if applicable

---

**Provided arguments**:

```
#$ARGUMENTS
```

---

## 🎯 Next Steps

1. Await PR review
2. Respond to comments and make adjustments
3. After approval, merge in the recommended order
4. Run `context-cli feature:end <ISSUE-ID>` to clean the workspace