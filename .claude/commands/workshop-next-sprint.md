---
description: Switch to next sprint branch with new features (tests will fail)
argument-hint: [-h|--help]
---

# Workshop Next Sprint

Switch the Todo App to the next sprint branch containing new features. This simulates a real development scenario where new code introduces regressions.

## Arguments Received
`$ARGUMENTS`

## Help Mode

If arguments contain `-h` or `--help`, display this help and exit:

```
/workshop-next-sprint - Switch to next sprint with new features

WHAT IT DOES:
  Switches Todo App from 'master' to 'new-feature/priority_and_edit_support'
  This branch has new features but introduces a bug that breaks existing tests.

WHEN TO USE:
  After running tests on 'master' branch (all green/passing)
  This moves the demo to the "tests failing" scenario for AI investigation

NEW FEATURES IN THIS SPRINT:
  - Task priority levels (high, medium, low)
  - Edit task functionality
  - Priority-based sorting

RELATED COMMANDS:
  /workshop-start      # Start services (uses master branch)
  /investigate         # Investigate test failures
  /workshop-end        # Stop all services
```

## Procedure

### 1. Switch Branch
```bash
cd C:/work/workshop/todo-list && git checkout new-feature/priority_and_edit_support
```

### 2. Verify Branch
```bash
cd C:/work/workshop/todo-list && git branch --show-current
```

## Output Summary

After switching, display:

```
Switched to Next Sprint

Branch: new-feature/priority_and_edit_support

New Features:
  - Task priority levels (high, medium, low)
  - Edit task functionality
  - Priority-based sorting

What's Next:
  1. Run tests:  npx playwright test --reporter=json,html
     (Add --headed to watch browser: npx playwright test --headed)
  2. Tests will FAIL (the new code has a bug)
  3. Investigate: /investigate

This simulates a real CI/CD scenario where new features break existing tests.
```
