# Quality Metrics

This command collects and analyzes quality metrics of the code and the development process.

## 🎯 Objective

Measure and document the quality of the implementation through objective metrics:
- Test coverage
- Code complexity
- Technical debt
- Performance
- Compliance with standards

## 📋 Prerequisites

- Implementation completed (after `/work`)
- Tests implemented
- Build working

## 📊 Metrics to Collect

### 1. Test Coverage

For each modified repository:

```bash
cd <repositório>

# Run tests with coverage
npm run test:coverage  # or equivalent command

# Capture results
```

Document:
```markdown
## Test Coverage

### <repo-1>
- **Total Coverage**: X%
- **Statements**: X%
- **Branches**: X%
- **Functions**: X%
- **Lines**: X%
- **Uncovered Files**: [list]

### <repo-2>
[Same format]
```

### 2. Code Complexity

Analyze the cyclomatic complexity of the modified files:

```markdown
## Code Complexity

### Files with High Complexity
- **arquivo1.ts**: Complexity 15 (recommended: < 10)
- **arquivo2.ts**: Complexity 12

### Recommendations
- [Refactoring suggestion 1]
- [Refactoring suggestion 2]
```

### 3. Code Quality

```bash
# Run linting
npm run lint

# Check formatting
npm run format:check

# Static analysis (if available)
npm run analyze
```

Document:
```markdown
## Code Quality

### Linting
- **Errors**: 0
- **Warnings**: X
- **Justified Warnings**: [list with justifications]

### Formatting
- **Status**: ✅ Compliant / ⚠️ Adjustments needed

### Static Analysis
- **Critical Issues**: 0
- **Medium Issues**: X
- **Low Issues**: Y
```

### 4. Performance

If applicable, measure performance:

```markdown
## Performance

### Benchmarks
- **Operation X**: Yms (baseline: Zms)
- **Operation Y**: Yms (baseline: Zms)

### Applied Optimizations
- [Optimization 1 and impact]
- [Optimization 2 and impact]

### Identified Bottlenecks
- [Bottleneck 1 and mitigation plan]
```

### 5. Size and Impact

```markdown
## Size and Impact

### Lines of Code
- **Added**: +X lines
- **Removed**: -Y lines
- **Modified**: Z lines

### Files
- **New**: X files
- **Modified**: Y files
- **Removed**: Z files

### Dependencies
- **New dependencies**: [list]
- **Bundle size**: +X KB
```

### 6. Technical Debt

Identify technical debt introduced or resolved:

```markdown
## Technical Debt

### Introduced Debt
- **Item 1**: [Description and justification]
  - Severity: High / Medium / Low
  - Resolution plan: [when and how to resolve]

### Resolved Debt
- **Item 1**: [What was resolved]
  - Impact: [improvement achieved]
```

## 📄 Metrics Report

Create `./.sessions/<ISSUE-ID>/metrics.md`:

```markdown
# Metrics Report - [ISSUE-ID]

**Date**: [date/time]
**Repositories**: [list]

## Executive Summary

- **Test Coverage**: X% (target: Y%)
- **Code Quality**: ✅ / ⚠️ / ❌
- **Performance**: ✅ / ⚠️ / ❌
- **Technical Debt**: Low / Medium / High

## Detailed Metrics

[Include all sections above]

## Comparison with Baseline

| Metric | Before | After | Variation |
|--------|--------|-------|-----------|
| Coverage | X% | Y% | +Z% |
| Average Complexity | X | Y | +Z |
| Bundle Size | X KB | Y KB | +Z KB |

## Recommended Actions

1. [Action 1 - high priority]
2. [Action 2 - medium priority]
3. [Action 3 - low priority]

## Approval for Merge

- [ ] Test coverage >= target
- [ ] No critical quality issues
- [ ] Performance within requirements
- [ ] Technical debt documented and approved
```

## 🎯 Quality Goals

If the project has goals defined in metaspecs, validate:

```markdown
## Validation against Goals

### Project Goals
- **Minimum coverage**: 80%
- **Maximum complexity**: 10
- **Performance**: < 100ms

### Status
- Coverage: ✅ 85% (target: 80%)
- Complexity: ⚠️ 12 (target: 10) - Justified
- Performance: ✅ 85ms (target: 100ms)
```

## 🚨 Alerts

If any metric is out of acceptable range:
1. 🛑 **DOCUMENT** the problem
2. 💬 **ALERT** the user
3. 🔧 **PROPOSE** corrective actions
4. ⏸️ **CONSIDER** blocking the merge until resolved

---

**Provided arguments**:

```
#$ARGUMENTS
```

---

## 🎯 Result

After running this command, you will have:
- Complete metrics report
- Comparison with baseline and goals
- Identification of quality issues
- Recommended actions
- Objective basis for merge approval